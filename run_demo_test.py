import os
import cv2
import pkg_resources
import torch
import torch.nn.functional as F
import numpy as np
import torchvision.transforms as transforms
from PIL import Image
import time
from collections import deque, defaultdict

# My libs
import spiga.demo.analyze.track.get_tracker as tr
import spiga.demo.analyze.extract.spiga_processor as pr_spiga
from spiga.demo.analyze.analyzer import VideoAnalyzer
from spiga.demo.visualize.viewer import Viewer

from approach.ResEmoteNet import ResEmoteNet

# Gaze integration
from gaze import init_gaze_model, run_gaze_calibration, evaluate_gaze_attention, detect_phone

# Load ResEmoteNet model
emotions = ['happy', 'surprise', 'sad', 'anger', 'disgust', 'fear', 'neutral']
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
resnet_model = ResEmoteNet().to(device)
checkpoint = torch.load("models/best_model.pth", map_location=device)
resnet_model.load_state_dict(checkpoint['model_state_dict'])
resnet_model.eval()

# ResEmoteNet transforms
transform = transforms.Compose([
    transforms.Resize((64, 64)),
    transforms.Grayscale(num_output_channels=3),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Paths
video_out_path_dft = pkg_resources.resource_filename('spiga', 'demo/outputs')
if not os.path.exists(video_out_path_dft):
    os.makedirs(video_out_path_dft)

def run_integrated_demo():
    import argparse
    pars = argparse.ArgumentParser(description='SPIGA + ResEmoteNet + Gaze Demo')
    pars.add_argument('-i', '--input', type=str, default='0', help='Video input')
    pars.add_argument('-d', '--dataset', type=str, default='wflw',
                      choices=['wflw', '300wpublic', '300wprivate', 'merlrav'],
                      help='SPIGA pretrained weights per dataset')
    pars.add_argument('--window', type=int, default=180, help='Tracking window in seconds')
    pars.add_argument('-t', '--tracker', type=str, default='RetinaSort',
                      choices=['RetinaSort', 'RetinaSort_Res50'], help='Tracker name')
    pars.add_argument('--fps', type=int, default=30, help='Frames per second')
    pars.add_argument('--thresh1', type=float, default=0.05, help='Low threshold for inattentiveness')
    pars.add_argument('--thresh2', type=float, default=0.15, help='Medium threshold for inattentiveness')
    pars.add_argument('--thresh3', type=float, default=0.25, help='High threshold for inattentiveness')

    args = pars.parse_args()

    capture = cv2.VideoCapture(int(args.input))
    vid_w, vid_h = capture.get(3), capture.get(4)
    viewer = Viewer('Integrated Demo', width=vid_w, height=vid_h, fps=args.fps)
    viewer.start_view()

    # Init gaze model and calibration
    gaze_detector, gaze_face_detector, gaze_device, idx_tensor, config = init_gaze_model()
    pitch_range, yaw_range = run_gaze_calibration(capture, gaze_detector, gaze_face_detector, gaze_device, idx_tensor, config)

    faces_tracker = tr.get_tracker(args.tracker)
    faces_tracker.detector.set_input_shape(vid_h, vid_w)
    processor = pr_spiga.SPIGAProcessor(dataset=args.dataset)
    faces_analyzer = VideoAnalyzer(faces_tracker, processor=processor)

    segment_start = None #add this
    inattentive_per_second = defaultdict(bool) 
    segments = []

    '''# drowsiness (eyes closed) counter: 5 seconds continuous 
    DROWSY_THRESH = 10.0 
    DROWSY_FRAMES = int(args.fps * 5) 
    drowsy_counter = 0'''
    last_time = time.time()

    while capture.isOpened():
        ret, frame = capture.read()
        if not ret:
            break
        
        current_time = time.time()
        current_sec = int(current_time)
        faces_analyzer.process_frame(frame)
        inattentive = False
        #Rule 1: No face detected
        if not faces_analyzer.tracked_obj:
            inattentive = True
            print(f"[{time.strftime('%H:%M:%S')}] INATTENTIVE → No face detected")
        else:
            for face in faces_analyzer.tracked_obj:
                if face.bbox is not None:
                    bbox = np.array(face.bbox).astype(int)
                    x_min, y_min, x_max, y_max = bbox[:4]
                    x_min = max(0, x_min)
                    y_min = max(0, y_min)
                    x_max = min(frame.shape[1], x_max)
                    y_max = min(frame.shape[0], y_max)
                    face_crop = frame[y_min:y_max, x_min:x_max]
                else:
                    face_crop = None                  

                #Rule2: Headpose inattentive
                if face.headpose is not None and len(face.headpose) == 6:
                    yaw, pitch, roll = face.headpose[:3]
                    if abs(yaw) > 30 or abs(pitch) > 35:
                        inattentive = True
                        print(f"[{time.strftime('%H:%M:%S')}] INATTENTIVE → Head pose off (yaw={yaw:.1f}, pitch={pitch:.1f})")
                        
                #Rule3: Emotion inattentive
                if face_crop is not None and face_crop.size != 0:
                    face_pil = Image.fromarray(face_crop)
                    face_tensor = transform(face_pil).unsqueeze(0).to(device)
                    with torch.no_grad():
                        outputs = resnet_model(face_tensor)
                        probabilities = F.softmax(outputs, dim=1).cpu().numpy().flatten()
                    
                    max_index = np.argmax(probabilities)
                    max_emotion = emotions[max_index]
                    confidence = probabilities[max_index]

                    label = f"{max_emotion}: {probabilities[max_index]:.2f}"
                    cv2.putText(frame, label, (x_min, y_min - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
                
                    if max_emotion != 'neutral' and max_emotion != 'surprise' and confidence > 0.90:
                        inattentive = True
                        print(f"[{time.strftime('%H:%M:%S')}] INATTENTIVE → Emotion detected: {max_emotion} ({confidence:.2f})")
                
                #Rule4: Gaze + microsaccades inattentive
                if face.bbox is not None:
                    print("[DEBUG] Calling evaluate_gaze_attention()")
                    gaze_inattentive, micro_flag = evaluate_gaze_attention(
                        frame, face.bbox, gaze_detector, gaze_device, idx_tensor, config, pitch_range, yaw_range)
                                
                    if gaze_inattentive:
                        inattentive = True
                        print(f"[{time.strftime('%H:%M:%S')}] INATTENTIVE → Gaze outside calibrated range")

                    if micro_flag:
                        inattentive = True
                        print(f"[{time.strftime('%H:%M:%S')}] INATTENTIVE → Microsaccade detected")

                    '''# NEW: Closed-eye detection using Δdeg high for 5 seconds
                    if delta_deg > DROWSY_THRESH: 
                        drowsy_counter += 1 
                    else: 
                        drowsy_counter = 0 
                    if drowsy_counter >= DROWSY_FRAMES: 
                        inattentive = True 
                        print(f"[{time.strftime('%H:%M:%S')}] INATTENTIVE → Drowsiness (eyes closed ≥5s)")'''
                
                # Rule 5: Phone detection
                phone_inattentive, phone_boxes = detect_phone(frame)
                if phone_inattentive:
                    inattentive = True
                    for (x1, y1, x2, y2) in phone_boxes:
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                        cv2.putText(frame, "Phone", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                # Landmark movement

        #Calculate inattentive time
        if current_sec not in inattentive_per_second:
            inattentive_per_second[current_sec] = inattentive
        else:
            inattentive_per_second[current_sec] |= inattentive


        min_allowed_sec = current_sec - args.window
        inattentive_per_second = {sec: val for sec, val in inattentive_per_second.items() if sec >= min_allowed_sec}

        if current_sec - 1 in inattentive_per_second:
            prev = inattentive_per_second[current_sec - 1]
            curr = inattentive_per_second[current_sec]
            if curr and not prev:
                segment_start = current_sec
                print("State changed: INATTENTIVE", time.strftime('%H:%M:%S'))
            elif not curr and prev:
                segment_end = current_sec
                segments.append((segment_start, segment_end))
                segment_start = None  # Reset after appending
                print("State changed: ATTENTIVE", time.strftime('%H:%M:%S'))
                
        # === Per-second evaluation of past 3 minutes ===
        #window_secs = args.window
        #recent_secs = [sec for sec in inattentive_per_second.keys() if current_sec - window_secs < sec <= current_sec]
        #inattentive_count = sum(inattentive_per_second[sec] for sec in recent_secs)
            if curr != prev:
                if curr:
                    print("State changed: INATTENTIVE", time.strftime('%H:%M:%S'))
                else:
                    print("State changed: ATTENTIVE", time.strftime('%H:%M:%S'))

        inattentive_count = sum(inattentive_per_second.values())
        ratio = inattentive_count / args.window

        if ratio > args.thresh1:
            if ratio <= args.thresh2:
                tag = "slightly inattentive"
            elif args.thresh2 < ratio <= args.thresh3:
                tag = "medium inattentive"
            elif ratio > args.thresh3:
                tag = "heavily inattentive"

            #print(ratio)  
            #cv2.putText(frame, f"3-min Status: {tag}", (50, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
        
        #########       
        if inattentive:
            cv2.putText(frame, "INATTENTIVE", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 0, 255), 3)

        key = viewer.process_image(frame, drawers=[faces_analyzer], show_attributes=['landmarks', 'headpose', 'face_id', 'fps'])
        if key:
            break

        # ---- ADD FPS DEBUG HERE ---- 
        current_fps = 1.0 / (time.time() - last_time) 
        print("[DEBUG] FPS:", round(current_fps, 2)) 
        last_time = time.time()

    print("\nInattentive segments:")
    for start, end in segments:
        print(f"From {time.strftime('%H:%M:%S', time.localtime(start))} to {time.strftime('%H:%M:%S', time.localtime(end))}")

    capture.release()
    viewer.close()

if __name__ == '__main__':
    run_integrated_demo()
