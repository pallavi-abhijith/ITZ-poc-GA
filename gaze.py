import cv2
import logging
import warnings
import numpy as np
import time
import torch
import torch.nn.functional as F
from torchvision import transforms
from config import data_config
from utils.helpers import get_model, draw_bbox_gaze
import uniface
from ultralytics import YOLO

warnings.filterwarnings("ignore")
logging.basicConfig(level=logging.INFO, format='%(message)s')

# Gaze module integration for run_demo
# Call these before main loop:
#   gaze_detector, face_detector, device, idx_tensor, config = init_gaze_model()
#   pitch_range, yaw_range = run_gaze_calibration(cap, gaze_detector, face_detector, device, idx_tensor, config)
# Then in loop:
#   inattentive_flag, microsaccade_flag = evaluate_gaze_attention(frame, bbox, gaze_detector, device, idx_tensor, config, pitch_range, yaw_range)

gaze_history = []

def pre_process(image):
    if image is None: 
        raise ValueError("pre_process() received an empty image")
    
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    transform = transforms.Compose([
        transforms.ToPILImage(),
        transforms.Resize(448),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    image = transform(image)
    image_batch = image.unsqueeze(0)
    return image_batch

def detect_microsaccade(gaze_history, angle_thresh_deg=13, duration_ms=1000):
    print("[DEBUG] detect_microsaccade called, history length:", len(gaze_history))
    if len(gaze_history) < 2:
        return False
    now = time.time()
    recent_entries = [entry for entry in gaze_history if now - entry[0] <= duration_ms / 1000]

    # prevents loop from running on an empty or single‑entry list
    if len(recent_entries) < 2: 
        return False
    
    for i in range(1, len(recent_entries)):
        t0, p0, y0 = recent_entries[i - 1]
        t1, p1, y1 = recent_entries[i]
        delta = np.sqrt((p1 - p0) ** 2 + (y1 - y0) ** 2)
        delta_deg = np.degrees(delta)
        print("Δdeg:", round(delta_deg, 2))

        if delta_deg > angle_thresh_deg:
            return True
        
    return False

'''def compute_delta_deg_last(gaze_history):
    if len(gaze_history) < 2:
        return 0.0

    _, p0, y0 = gaze_history[-2]
    _, p1, y1 = gaze_history[-1]

    delta = np.sqrt((p1 - p0)**2 + (y1 - y0)**2)
    return np.degrees(delta)'''

def init_gaze_model(model_name="resnet34", weight_path="resnet34.pt", dataset="gaze360"):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    gaze_detector = get_model(model_name, data_config[dataset]["bins"], inference_mode=True)
    state_dict = torch.load(weight_path, map_location=device)
    gaze_detector.load_state_dict(state_dict)
    gaze_detector.to(device)
    gaze_detector.eval()
    face_detector = uniface.RetinaFace()
    idx_tensor = torch.arange(data_config[dataset]["bins"], device=device, dtype=torch.float32)
    return gaze_detector, face_detector, device, idx_tensor, data_config[dataset]

def run_gaze_calibration(cap, gaze_detector, face_detector, device, idx_tensor, config):
    import time
    calibration_pitch = []
    calibration_yaw = []
    calibration_points = [
        "TOP", "BOTTOM", "LEFT", "RIGHT",
        # "TOP-LEFT", "TOP-RIGHT", "BOTTOM-LEFT", "BOTTOM-RIGHT"
    ]

    # Step 1: Show calibration start message
    start_time = time.time()
    while time.time() - start_time < 3:  # Show for 3 seconds
        ret, frame = cap.read()
        if not ret:
            break
        cv2.putText(frame, "Calibration: Follow on-screen border prompts.",
                    (50, 100), cv2.FONT_HERSHEY_TRIPLEX, 0.6, (255, 255, 255), 2, cv2.LINE_AA)
        cv2.imshow("Calibration", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            return None, None

    # Step 2: Guide through each calibration point
    for point in calibration_points:
        print(f"Look at: {point}")
        collected = 0
        while collected < 30:
            ret, frame = cap.read()
            if not ret:
                break
            faces = face_detector.detect(frame)
            for face in faces:
                bbox = face['bbox']
                x_min, y_min, x_max, y_max = map(int, bbox[:4])
                image = frame[y_min:y_max, x_min:x_max]
                image = pre_process(image).to(device)
                pitch, yaw = gaze_detector(image)
                pitch = torch.sum(F.softmax(pitch, dim=1) * idx_tensor, dim=1) * config["binwidth"] - config["angle"]
                yaw = torch.sum(F.softmax(yaw, dim=1) * idx_tensor, dim=1) * config["binwidth"] - config["angle"]
                calibration_pitch.append(pitch.cpu().item())
                calibration_yaw.append(yaw.cpu().item())
                collected += 1
            # Show instruction text
            cv2.putText(frame, f"Look at the {point} edge of the screen", (50, 100),
                        cv2.FONT_HERSHEY_TRIPLEX, 0.8, (0, 255, 255), 2, cv2.LINE_AA)
            cv2.imshow("Calibration", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                return None, None

    pitch_range = (np.min(calibration_pitch), np.max(calibration_pitch))
    yaw_range = (np.min(calibration_yaw), np.max(calibration_yaw))
    print(f"Calibration complete. PITCH_RANGE: {pitch_range}, YAW_RANGE: {yaw_range}")
    return pitch_range, yaw_range

def evaluate_gaze_attention(frame, bbox, gaze_detector, device, idx_tensor, config, pitch_range, yaw_range):
    print("[DEBUG] Inside evaluate_gaze_attention")
    global gaze_history
    x_min, y_min, x_max, y_max = map(int, bbox[:4])
    image = frame[y_min:y_max, x_min:x_max]
    #print("DEBUG gaze crop:", None if image is None else image.shape)
    # --- SAFETY CHECK to avoid empty image ---
    if image is None or image.size == 0: 
        # No valid crop → skip gaze estimation 
        return False, False
    image = pre_process(image).to(device)
    pitch, yaw = gaze_detector(image)
    pitch_predicted = torch.sum(F.softmax(pitch, dim=1) * idx_tensor, dim=1) * config["binwidth"] - config["angle"]
    yaw_predicted = torch.sum(F.softmax(yaw, dim=1) * idx_tensor, dim=1) * config["binwidth"] - config["angle"]
    pitch_deg = pitch_predicted.cpu().item()
    yaw_deg = yaw_predicted.cpu().item()
    #inattentive_flag = not (pitch_range[0] <= pitch_deg <= pitch_range[1] and yaw_range[0] <= yaw_deg <= yaw_range[1])
    
    BUFFER = 3  # degrees of tolerance
    inattentive_flag = not (
        (pitch_range[0] - BUFFER) <= pitch_deg <= (pitch_range[1] + BUFFER) and
        (yaw_range[0] - BUFFER) <= yaw_deg <= (yaw_range[1] + BUFFER)
    )

    pitch_predicted = np.radians(pitch_deg)
    yaw_predicted = np.radians(yaw_deg)

    now = time.time()
    gaze_history.append((now, pitch_predicted, yaw_predicted))
    gaze_history = [entry for entry in gaze_history if now - entry[0] <= 1.0]
    
    draw_bbox_gaze(frame, bbox, pitch_predicted, yaw_predicted)
    micro_flag = detect_microsaccade(gaze_history)
    #delta_deg = compute_delta_deg_last(gaze_history)
    return inattentive_flag, micro_flag
    
# Load model only once
yolo_model = YOLO("./models/yolov8n.pt")  # or your preferred model
PHONE_CLASS_ID = 67    
    
def detect_phone(frame, confidence_threshold=0.5):
    """
    Detect phones in the frame using YOLOv8.
    Returns (bool, list of bounding boxes).
    """
    phone_boxes = []
    try:
        results = yolo_model(frame, verbose=False)
        for result in results:
            for box in result.boxes:
                class_id = int(box.cls[0])
                conf = float(box.conf[0])
                if class_id == PHONE_CLASS_ID and conf > confidence_threshold:
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
                    phone_boxes.append((x1, y1, x2, y2))
        phone_detected = len(phone_boxes) > 0
        return phone_detected, phone_boxes
    except Exception as e:
        print(f"[Phone Detection Error] {e}")
        return False, []
