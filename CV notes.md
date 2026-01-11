
# Dec 2025 CV testing notes - Pallavi

## Steps to install CV model

1. clone origin into ITZPOC folder -> checkout branch to cv-demo-revised (done this from vscode)

2. opened conda prompt as a admin -> conda update --all -> anaconda-navigator (this was not successful) -> conda create -n itz python=3.10 -> conda activate itz  -> conda install numpy scipy scikit-learn matplotlibc-> conda install numpy scipy scikit-learn matplotlib -> conda install pytorch torchaudio cpuonly -c pytorch  -> cd "C:\Users\palla\Documents\Guardian Airwaves\POC\NLP demo\ITZPOC" -> git branch

3. install dependencies:`pip install -r requirements.txt` `pip install -e .[demo]`
`pip install --upgrade torch torchvision` (this gave compatibility issues between torch, torchvision and torchaudio)(so better to skip this)

4. download and move resnet and model files.
5. python run_demo_test.py

Ran into cuda issues, then changed cuda/gpu to cpu in the error files which was coming on the console. able to see the mask. It always marked as inattentive.

## 2nd test time steps need to follow

1. Open Anaconda Prompt (as admin)
2. Activate your environment
    Your project lives in the itz conda environment, so activate it:`conda activate itz` You should see:`(itz) C:\Users\palla>`
3. Navigate to your project folder `cd "C:\Users\palla\Documents\Guardian Airwaves\POC\NLP demo\ITZPOC"`
4. Run the demo`python run_demo_test.py`

## tesing notes: 12/22/2025

```
# error: File"C:\Users\palla\Documents\Guardian Airwaves\POC\NLP demo\ITZPOC\gaze.py", line 28, in pre_process
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
cv2.error: OpenCV(4.9.0)
D:\a\opencv-python\opencv-python\opencv\modules\imgproc\src\color.
cpp:196: error: (-215:Assertion failed) !_src.empty() in function 'cv::cvtColor'
```

There are few reasons for this error:

1. The camera returned no frame
2. Face was not detected
3. The bounding box is invalid

I tested 3 times, assuming its issue with the laptop which is not sending frames immediately to process as my laptop is slow. issue causing due to "camera return no frame".

to debug this added few lines to gaze.py

line 28 and 29

```python
if image is None:
    raise ValueError("pre_process() received an empty image")
```

line 125 to 129

```python
print("DEBUG gaze crop:", None if image is None else image.shape)
    if image is None or image.size == 0:
        # No valid crop → skip gaze estimation
        return False, False
```

to print logs even for incompleted inattentive segments in run_demo_test.py
line 194 to 196

```python
# Close any open segment

    if segment_start is not None:
        segments.append((segment_start, int(time.time())))
```

line 172 to 176 (to print logs in real time when attentive changes to inattentive)

```python
 if curr != prev:
                if curr:
                    print("State changed: INATTENTIVE", time.strftime('%H:%M:%S'))
                else:
                    print("State changed: ATTENTIVE", time.strftime('%H:%M:%S'))
```

## run_demo_test.py program explaination

multi‑model, real‑time human‑attention monitoring system that combines face tracking, landmark extraction, head pose, emotion recognition, gaze estimation, and phone detection — all running live on webcam video.

1. Captures Live Video from webcam
2. loads multiple AI models:

    A. SPIGA (Face landmarks + head pose) --Detects faces, Tracks them across frames, Extracts 98 facial landmarks, Estimates head pose (yaw, pitch, roll)

    B. ResEmoteNet (Emotion recognition) -- Classifies emotions: happy, surprise, sad, anger, disgust, fear, neutral (Uses a 64×64 grayscale face crop). Flags inattentiveness if emotion is strong (not neutral/surprise)

    C. Gaze Model -- Calibrates your head orientation, Estimates pitch/yaw of your gaze, Detects microsaccades, Determines if you’re looking away

    D. Phone Detector -- Detects if a phone is visible in the frame

3. Performs Gaze Calibration
4. Tracks Faces in Real Time
5. Applies 4 Inattentiveness Rules

    Rule 1 — No Face Detected -- If no face is found → inattentive.

    Rule 2 — Head Pose -- If yaw or pitch exceeds ±20° (looking away from screen)

    Rule 3 — Emotion --If emotion is strong (anger, sadness, fear, etc.) with >90% confidence (Your emotional state suggests distraction.)

    Rule 4 — Gaze -- The gaze model checks: Are your eyes pointing outside calibrated range? Are microsaccades detected? If yes → inattentive.

    Rule 5 — Phone Detection -- If a phone is detected in the frame (You’re using your phone.)

6. Tracks Inattentiveness Over Time
The program keeps a per‑second log. It maintains a sliding window of the last 180 seconds (3 minutes).
It computes: ratio = inattentive_count / args.window
Then classifies: Slightly inattentive, Medium inattentive, Heavily inattentive

7. Displays “INATTENTIVE” on Screen
8. Records Inattentive Segments
logs and prints Inattentive segments:
From HH:MM:SS to HH:MM:SS
9. Displays Live Visualization
10. Clean Shutdown

`python run_demo_test.py`

```console
C:\Users\palla\Documents\Guardian Airwaves\POC\NLP demo\ITZPOC\run_demo_test.py:3: UserWarning: pkg_resources is deprecated as an API. See <https://setuptools.pypa.io/en/latest/pkg_resources.html>. The pkg_resources package is slated for removal as early as 2025-11-30. Refrain from using this package or pin to Setuptools<81.
  import pkg_resources
✓ Model loaded (CPU)
Look at: TOP
Look at: BOTTOM
Look at: LEFT
Look at: RIGHT
Calibration complete. PITCH_RANGE: (-19.51483154296875, 19.42626953125), YAW_RANGE: (-4.4168853759765625, 23.35491943359375)
Loading pretrained model from <https://drive.google.com/uc?export=download&confirm=yes&id=1nxhtpdVLbmheUTwyIb733MrL53X4SQgQ>
RetinaFace loaded!
SPIGA model loaded!
DEBUG gaze crop: (189, 146, 3)
....
DEBUG gaze crop: (189, 149, 3)
State changed: ATTENTIVE 07:13:11
DEBUG gaze crop: (184, 147, 3)
...
DEBUG gaze crop: (236, 174, 3)
State changed: INATTENTIVE 07:15:05
DEBUG gaze crop: (243, 180, 3)
...
State changed: ATTENTIVE 07:15:39
DEBUG gaze crop: (216, 163, 3)
....
DEBUG gaze crop: (211, 159, 3)
State changed: ATTENTIVE 07:16:28
```

### test 5

```console
Loading pretrained model from https://drive.google.com/uc?export=download&confirm=yes&id=1nxhtpdVLbmheUTwyIb733MrL53X4SQgQ
RetinaFace loaded!
SPIGA model loaded!
State changed: ATTENTIVE 16:50:03
State changed: ATTENTIVE 16:50:05
State changed: INATTENTIVE 16:50:07
State changed: ATTENTIVE 16:51:12
State changed: INATTENTIVE 16:51:14
```

### testing notes 12/23/2025

Added code `run_demo_test.py` to get differnt model logs

line 103:

```python
print(f"[{time.strftime('%H:%M:%S')}] INATTENTIVE → No face detected")
```

line 122:

```python
emotion_computed = False
```

line 132:

```python
emotion_computed = True
```

line 153:(block of code)

```python
 if inattentive:
    reasons = []

    # Rule 2: Head pose
    if face.headpose is not None and len(face.headpose) == 6:
        yaw, pitch, roll = face.headpose[:3]
        if abs(yaw) > 20 or abs(pitch) > 20:
            reasons.append(f"Head pose off (yaw={yaw:.1f}, pitch={pitch:.1f})")

    # Rule 3: Emotion
    if emotion_computed:
        reasons.append(f"Emotion: {max_emotion} ({confidence:.2f})")

    # Rule 4: Gaze
    if gaze_inattentive:
        reasons.append("Gaze outside calibrated range")
        if micro_flag:
            reasons.append("Microsaccade detected")

    # Rule 5: Phone
    if phone_inattentive:
        reasons.append("Phone detected")

    print(f"[{time.strftime('%H:%M:%S')}] INATTENTIVE → " + ", ".join(reasons))
```

Results

```console
Look at: TOP
Look at: BOTTOM
Look at: LEFT
Look at: RIGHT
Calibration complete. PITCH_RANGE: (-23.423187255859375, 15.573410034179688), YAW_RANGE: (-3.8378753662109375, 24.38067626953125)
Loading pretrained model from https://drive.google.com/uc?export=download&confirm=yes&id=1nxhtpdVLbmheUTwyIb733MrL53X4SQgQ
RetinaFace loaded!
SPIGA model loaded!
[05:53:04] INATTENTIVE → Head pose off (yaw=-1.7, pitch=27.6)
...+4...
[05:53:07] INATTENTIVE → Head pose off (yaw=-4.0, pitch=30.3)
[05:53:09] INATTENTIVE → Head pose off (yaw=-0.7, pitch=28.2), Microsaccade detected
[05:53:10] INATTENTIVE → Head pose off (yaw=1.3, pitch=24.4), Gaze outside calibrated range, Microsaccade detected
[05:53:11] INATTENTIVE → Head pose off (yaw=2.0, pitch=25.5), Microsaccade detected
[05:53:12] INATTENTIVE → Head pose off (yaw=1.1, pitch=25.6)...+2...
[05:53:14] INATTENTIVE → No face detected...+2....
[05:53:15] INATTENTIVE → Emotion: neutral (0.91), Gaze outside calibrated range
[05:53:16] INATTENTIVE → Emotion: neutral (0.99), Gaze outside calibrated range
[05:53:17] INATTENTIVE → Head pose off (yaw=0.4, pitch=25.4)
[05:53:18] INATTENTIVE → Head pose off (yaw=1.4, pitch=26.3)
[05:53:18] INATTENTIVE → No face detected...+5...
[05:53:20] INATTENTIVE → Head pose off (yaw=-0.8, pitch=30.8)
[05:53:20] INATTENTIVE → No face detected.....+3....
[05:53:21] INATTENTIVE → Head pose off (yaw=-2.0, pitch=23.3), Gaze outside calibrated range
[05:53:21] INATTENTIVE → No face detected....+2....
[05:53:22] INATTENTIVE → Head pose off (yaw=-1.3, pitch=20.7)
[05:53:23] INATTENTIVE → Head pose off (yaw=-1.2, pitch=23.4)
[05:53:23] INATTENTIVE → No face detected....+2....
[05:53:24] INATTENTIVE → Head pose off (yaw=-1.3, pitch=23.7)
[05:53:25] INATTENTIVE → No face detected.....+2....
[05:53:26] INATTENTIVE → Head pose off (yaw=-2.8, pitch=21.7)
State changed: ATTENTIVE 05:53:27
[05:53:28] INATTENTIVE → Head pose off (yaw=-1.7, pitch=21.2)
State changed: INATTENTIVE 05:53:28
[05:53:29] INATTENTIVE → Head pose off (yaw=-1.5, pitch=21.1)
[05:53:30] INATTENTIVE → Head pose off (yaw=-2.3, pitch=22.2)
[05:53:32] INATTENTIVE → Head pose off (yaw=-3.4, pitch=22.4)
[05:53:32] INATTENTIVE → No face detected
[05:53:32] INATTENTIVE → No face detected
[05:53:32] INATTENTIVE → No face detected
[05:53:33] INATTENTIVE → Head pose off (yaw=-2.1, pitch=20.6)
[05:53:35] INATTENTIVE → Head pose off (yaw=-2.2, pitch=21.2)
[05:53:36] INATTENTIVE → Head pose off (yaw=-1.9, pitch=20.4)
[05:53:38] INATTENTIVE → Head pose off (yaw=-1.9, pitch=20.2)
[05:53:39] INATTENTIVE → Head pose off (yaw=-1.2, pitch=20.2)
[05:53:41] INATTENTIVE → Head pose off (yaw=-0.3, pitch=21.0)
[05:53:42] INATTENTIVE → Head pose off (yaw=2.3, pitch=21.1)
[05:53:44] INATTENTIVE → Head pose off (yaw=0.4, pitch=21.0)
[05:53:47] INATTENTIVE → Head pose off (yaw=-0.5, pitch=20.3)
State changed: INATTENTIVE 05:53:47
[05:53:49] INATTENTIVE → Head pose off (yaw=-0.3, pitch=20.4)
State changed: INATTENTIVE 05:53:49
[05:53:51] INATTENTIVE → Head pose off (yaw=-1.4, pitch=20.7)
[05:53:52] INATTENTIVE → Head pose off (yaw=-0.8, pitch=21.5)
[05:53:54] INATTENTIVE → Head pose off (yaw=-0.1, pitch=21.2)
[05:53:55] INATTENTIVE → Head pose off (yaw=-0.4, pitch=20.7)
[05:53:56] INATTENTIVE → Head pose off (yaw=0.7, pitch=20.4)
[05:53:58] INATTENTIVE → Head pose off (yaw=0.6, pitch=21.3)
[05:53:59] INATTENTIVE → Head pose off (yaw=0.4, pitch=20.5)
[05:54:00] INATTENTIVE → Head pose off (yaw=0.3, pitch=21.1)
[05:54:02] INATTENTIVE → Head pose off (yaw=0.5, pitch=20.3)
[05:54:09] INATTENTIVE → Head pose off (yaw=1.7, pitch=20.2)
State changed: INATTENTIVE 05:54:09
[05:54:11] INATTENTIVE → Head pose off (yaw=1.6, pitch=20.3)
State changed: INATTENTIVE 05:54:11
State changed: ATTENTIVE 05:54:13
[05:54:14] INATTENTIVE → Head pose off (yaw=2.0, pitch=20.0)
[05:54:15] INATTENTIVE → Head pose off (yaw=2.0, pitch=20.0)
State changed: ATTENTIVE 05:54:17
[05:54:18] INATTENTIVE → Head pose off (yaw=1.6, pitch=20.4)
[05:54:19] INATTENTIVE → Head pose off (yaw=1.7, pitch=20.1)
State changed: ATTENTIVE 05:54:21
[05:54:22] INATTENTIVE → Head pose off (yaw=1.7, pitch=20.2)
State changed: ATTENTIVE 05:54:23
[05:54:38] INATTENTIVE → Head pose off (yaw=1.7, pitch=20.0)
State changed: ATTENTIVE 05:54:39
[05:54:47] INATTENTIVE → Head pose off (yaw=1.3, pitch=20.0)
State changed: INATTENTIVE 05:54:47
State changed: ATTENTIVE 05:54:48
[05:54:52] INATTENTIVE → Head pose off (yaw=0.4, pitch=20.8)
State changed: INATTENTIVE 05:54:52
[05:54:53] INATTENTIVE → Head pose off (yaw=0.2, pitch=20.8)
[05:54:55] INATTENTIVE → Head pose off (yaw=0.1, pitch=21.8)
[05:54:56] INATTENTIVE → Head pose off (yaw=-0.5, pitch=21.1)
[05:54:57] INATTENTIVE → Head pose off (yaw=0.5, pitch=20.1)
State changed: ATTENTIVE 05:54:58
[05:55:01] INATTENTIVE → Head pose off (yaw=0.3, pitch=20.4)
[05:55:03] INATTENTIVE → Emotion: neutral (0.69), Gaze outside calibrated range
State changed: ATTENTIVE 05:55:04
```

Result analysis:

1. your system is marking you inattentive almost entirely because of head pose

    Your pitch is consistently around 20–30°, which is above your threshold of 20°:

    ```python
    if abs(yaw) > 20 or abs(pitch) > 20:
    inattentive = True
    ```

    So even when you are looking at the screen normally, your pitch is slightly downward or upward → the system flags you as inattentive.

    This is the main reason for the constant inattentive logs.

2. “No face detected” spam happens because your face detector flickers

    This happens when:
    - lighting changes
    - you move slightly
    - the bounding box disappears for 1–2 frames
    - SPIGA loses track momentarily
    This is normal for real‑time face detectors.

3. Emotion logs appear only when emotion was computed

    ```console
    INATTENTIVE → Emotion: neutral (0.91), Gaze outside calibrated range
    ```

    This is correct — emotion is only logged when Rule 3 runs

4. “State changed” logs are correct too

    ```console
    State changed: ATTENTIVE
    State changed: INATTENTIVE
    ```

    This is your per‑second state machine working properly.

5. So what’s actually going wrong?

    **Nothing is wrong with your logging.Your thresholds are too strict.**

    Specifically:

    Head pose threshold is too tight
    You are using:

    ```python
    if abs(yaw) > 20 or abs(pitch) > 20:
    ```

    But your pitch is often: 21°, 22°, 25°, 28°, 30°

    This is normal human posture when looking slightly down at a laptop.

    So the system thinks you’re inattentive even when you’re not.

6. How to fix the false inattentive spam

    - Increase head pose tolerance

    ```python
    if abs(yaw) > 20 or abs(pitch) > 20:
    ```

    to

    ```python
    if abs(yaw) > 30 or abs(pitch) > 35:
    ```

    This alone will eliminate 80% of your false positives.

    - Add smoothing (require 5 consecutive bad frames)

    - Add hysteresis to “No face detected”

### Production logs analysis

Reviewing production logs, which Lawrence shared

There are three files:

1. Cv-prod-logs
inattentiveness identified due to gaze (Assuming user is Lawrence for that test)

    For 642 frames: inattentive reasons:330
    - Gaze -> 226
    - No face -> 0 (they fixed)
    - Headpose –> 37
    - Phone ->  47 (Assuming it is True because it is identifying phone for continuous frames)
    - Headpose, phone -> 0
    - Gaze, phone -> 0
    - Headpose, gaze -> 20

2. Cv-logs-pallavi
inattentiveness identified due to head pose, no face detection

    For 1000 (2130) frames:
    - Gaze -> 226  (700) (pitch/yaw ranges are too tight for your natural eye movement. Gaze is firing almost 23% of the time)
    - No face -> 13 (100) (This is normal flicker. Face detectors drop frames occasionally. Nothing alarming here.)
    - Headpose –> 142 (264) (pitch threshold (20°) is too strict for laptop posture. You naturally tilt your head more than that.)
    - Phone -> 4 (11) (Very low. Good — phone detection is stable and not noisy.)
    - headpose, phone -> 14 (24) (phone detection is often accompanied by head tilt. Makes sense — people look down at phones.)
    - gaze, phone -> 2 (2) (Rare but expected — looking down at a phone breaks gaze range.)
    - Headpose, gaze -> 50 (188)(This is the “double‑trigger” zone. When the head pose is off, gaze often becomes unreliable too.)

    How to fix the false inattentive spam

    **Tuning strategy** that will give the biggest improvement:
    - Relax headpose thresholds  
        Move from ±20° → ±30° or ±35° for pitch.
    - Relax gaze calibration ranges  
        Expand pitch/yaw min/max by ±5° after calibration.
    - Add smoothing for gaze  
        Require 3–5 consecutive bad gaze frames before marking inattentive.
    - Add smoothing for headpose  
        Same idea — don’t trigger on single-frame spikes.
    - Ignore “no face” unless > 0.5 seconds  
        Prevent flicker from causing false inattentiveness.

    >[!Notes]
    >
    > In our existing code
    >
    > - Gaze inattentiveness is based on calibration. Calibration directly controls gaze thresholds.
    > - Headphones threshold is hard-coded.  If you want headpose to behave like (adaptive), you can change the code to use calibration, add a buffer, eliminate 80% of false positives.

3. Agent-logs-pallavi

    Agent is catching what I am taking and trying to respond, responses are good, but there is delay and some glitch with the Avatar trying to say that.

    There is a need for post-processing for microphone content. Avatar is even responding for itzy when the user is on speaker (For example: It is considering this as User says “Hey there, I am Itzy how can I help you today”). Need strict rules, it has to respond only when “Itzy” name is called from User.

### Debugging

#### CV Model

1. changed yaw and pitch threshold value from 20 to 35 for the headpose. `run_demo_test.py`

``` python
#Rule2: Headpose inattentive
if face.headpose is not None and len(face.headpose) == 6:
    yaw, pitch, roll = face.headpose[:3]
    if abs(yaw) > 35 or abs(pitch) > 35:
        inattentive = True
```

``` console
python run_demo_test.py
C:\Users\palla\Documents\Guardian Airwaves\POC\NLP demo\ITZPOC\run_demo_test.py:3: UserWarning: pkg_resources is deprecated as an API. See https://setuptools.pypa.io/en/latest/pkg_resources.html. The pkg_resources package is slated for removal as early as 2025-11-30. Refrain from using this package or pin to Setuptools<81.
  import pkg_resources
✓ Model loaded (CPU)
Look at: TOP
Look at: BOTTOM
Look at: LEFT
Look at: RIGHT
Calibration complete. PITCH_RANGE: (-27.063385009765625, 21.89910888671875), YAW_RANGE: (-19.492431640625, 19.924163818359375)
Loading pretrained model from https://drive.google.com/uc?export=download&confirm=yes&id=1nxhtpdVLbmheUTwyIb733MrL53X4SQgQ
RetinaFace loaded!
SPIGA model loaded!
[13:59:22] INATTENTIVE → Emotion: neutral (0.77), Microsaccade detected
State changed: INATTENTIVE 13:59:22
State changed: ATTENTIVE 13:59:23
[13:59:26] INATTENTIVE → Emotion: neutral (0.89), Microsaccade detected
State changed: INATTENTIVE 13:59:26
State changed: ATTENTIVE 13:59:27
[13:59:46] INATTENTIVE → Emotion: neutral (0.99), Gaze outside calibrated range, Microsaccade detected
State changed: INATTENTIVE 13:59:46
State changed: ATTENTIVE 13:59:47
[13:59:49] INATTENTIVE → Emotion: neutral (0.96), Microsaccade detected
State changed: INATTENTIVE 13:59:49
State changed: ATTENTIVE 13:59:50
[13:59:56] INATTENTIVE → Emotion: neutral (0.58), Gaze outside calibrated range, Microsaccade detected
State changed: INATTENTIVE 13:59:56
[13:59:57] INATTENTIVE → Emotion: neutral (0.45), Gaze outside calibrated range
[13:59:58] INATTENTIVE → Emotion: neutral (0.83), Microsaccade detected
State changed: ATTENTIVE 13:59:59
[14:00:01] INATTENTIVE → Emotion: neutral (0.71), Microsaccade detected
State changed: INATTENTIVE 14:00:01
State changed: ATTENTIVE 14:00:02
[14:00:15] INATTENTIVE → Emotion: neutral (0.85), Gaze outside calibrated range
State changed: INATTENTIVE 14:00:15
State changed: ATTENTIVE 14:00:16
[14:00:22] INATTENTIVE → Emotion: neutral (0.79), Gaze outside calibrated range
[14:00:23] INATTENTIVE → Emotion: disgust (0.42), Gaze outside calibrated range
State changed: ATTENTIVE 14:00:24
[14:00:38] INATTENTIVE → Emotion: neutral (0.92), Gaze outside calibrated range
State changed: INATTENTIVE 14:00:38
[14:00:39] INATTENTIVE → Head pose off (yaw=38.8, pitch=11.3), Gaze outside calibrated range
[14:00:40] INATTENTIVE → Head pose off (yaw=38.1, pitch=11.7)
State changed: ATTENTIVE 14:00:41
[14:00:44] INATTENTIVE → Head pose off (yaw=-39.2, pitch=11.8), Gaze outside calibrated range
State changed: INATTENTIVE 14:00:44
[14:00:45] INATTENTIVE → Head pose off (yaw=-41.9, pitch=12.1), Gaze outside calibrated range
[14:00:46] INATTENTIVE → Head pose off (yaw=-41.1, pitch=13.3), Gaze outside calibrated range
State changed: ATTENTIVE 14:00:47
[14:00:52] INATTENTIVE → Emotion: disgust (0.53), Gaze outside calibrated range
State changed: ATTENTIVE 14:00:53
[14:00:56] INATTENTIVE → Emotion: anger (0.42), Gaze outside calibrated range
State changed: INATTENTIVE 14:00:56
State changed: ATTENTIVE 14:00:57
```

The results shows ***True Positives*** for all the Inattentive reasons.

The ***False Positives*** are due to microsaccades.

The current code for microsaccades is

```python
delta = sqrt((p1 - p0)^2 + (y1 - y0)^2)
delta_deg = degrees(delta)
if delta_deg > angle_thresh_deg:  # default = 13°
    return True
```

This means:

Any sudden change in predicted gaze angle > 13° within 1 second

Is treated as a microsaccade

But in practice:

- Gaze models are noisy
- Bounding boxes jitter
- Head movement causes small gaze jumps
- Webcam resolution amplifies noise
- SPIGA face crops shift slightly frame‑to‑frame

So your detector is interpreting normal model noise as microsaccades.

##### **The fix: three changes that can make microsaccades stable**

- Increase the angle threshold from 13° to 20° for moderate sensitivity, 25° for stable behavior, 30° for almost no false positives `angle_thresh_deg = 13`

    **Tested Results:** adding 20 instead of 13 is triggering microsaccades very very less times, which seems not a good sign. so not using this approach.

- Reduce the time window. Try reducing from 1 second to 0.3 seconds which makes the detector focus on true rapid jumps, not slow drift `recent_entries = [entry for entry in gaze_history if now - entry[0] <= 0.3]`

- Require multiple consecutive jumps. Instead of one noisy frame require 2–3 consecutive jumps to triggers a microsaccade which eliminates single‑frame noise spikes.

    ```python
    if delta_deg > angle_thresh_deg:
        spike_count += 1
    else:
        spike_count = 0

    if spike_count >= 3:
        return True
    ```

##### **For Gaze: adding buffer to calibrtion value most likely to solve gaze issues.**

```python
BUFFER = 5  # degrees of tolerance

inattentive_flag = not (
    (pitch_range[0] - BUFFER) <= pitch_deg <= (pitch_range[1] + BUFFER) and
    (yaw_range[0] - BUFFER) <= yaw_deg <= (yaw_range[1] + BUFFER)
)
```

**Tested Results:**
It helped in reducing false positive rate of gaze.
Noticed microsaccades is trigggering less no of times for 5 degree buffer. Hence, reduced buffer to 3 buffer. Microcassade code remains same.

noticed closing eye lids didn't work with this or without these changes.

Lawrence Spectating like:
compared to local, in production environemnt - the quiality of the videos are poor and that might cause issues in phone and microscades detection.

Solution (suggestions)

- For phone detection:

    1. Increase phone detection (YOLO) confidence threshold `confidence_threshold = 0.6 or 0.7`
    2. Add smoothing to YOLO bounding boxes: Use a moving average over the last 3–5 frames to stabilize phone boxes.

- For gaze + microsaccades:

    1. Add smoothing to gaze angles `pitch_smoothed = 0.7 * prev_pitch + 0.3 * pitch`
    2. Increase microsaccade threshold: Move from 13° → 25–30° in production.(*must need fix*)
    3. Reduce microsaccade time window: From 1.0s → 0.3s.(*must need    fix*)
    4. Require multiple consecutive spikes: Microsaccade = 3 consecutive jumps, not 1.(*must need fix*)
    5. Consider light smoothing of gaze angles before storing them in gaze_history.
    6. Keep the ±5° buffer around calibrated gaze ranges.

    Suggested Production‑Ready Microsaccade Detector

    ```python
    def detect_microsaccade(
        gaze_history,
        angle_thresh_deg=25,     # Larger threshold to ignore jitter
        window_sec=0.3,          # Shorter window to avoid drift
        required_spikes=3        # Multi-frame confirmation
    ):
        """
        Robust microsaccade detector for real-world video.
        - angle_thresh_deg: minimum angular jump to count as a spike
        - window_sec: time window to consider recent gaze samples
        - required_spikes: number of consecutive spikes required
        """

        if len(gaze_history) < required_spikes:
            return False

        now = time.time()
        recent = [entry for entry in gaze_history if now - entry[0] <= window_sec]

        if len(recent) < required_spikes:
            return False

        spike_count = 0

        for i in range(1, len(recent)):
            _, p0, y0 = recent[i - 1]
            _, p1, y1 = recent[i]

            # Angular jump between consecutive samples
            delta = np.sqrt((p1 - p0)**2 + (y1 - y0)**2)
            delta_deg = np.degrees(delta)

            # Count spikes
            if delta_deg > angle_thresh_deg:
                spike_count += 1
            else:
                spike_count = 0

            # Microsaccade only if multiple consecutive spikes
            if spike_count >= required_spikes:
                return True

        return False
    ```

- For Glasses / blue-light  filters:
    This issue should solve to some extent with the above fixes/tuning. More than that, it’s a computer‑vision challenge. I dont think we can solve that completely right now.

### 12/30/2025 production testing

CV model is stable compared to previous one. Only issue I have seen so far is, it is not identifying inattentiveness when I closed my eyes for more than 30 seconds.

Lawrence mentioned for microsaccades "I wasn't able to trigger it with the new code". Hence I experimented few times with and without the new suggestions. It didn't trigger with original code sometimes. When triggered it was detecting the moicrosaccades for few seconds continuously. Again when I tried with new changes, it trigged microsaccades and the false positives are less comparative to the old version. So good to keep these changes:

------------------------------------------------------------------**Production ready changes**--------------------------------------------------------

gaze.py

```python
BUFFER = 3  # degrees of tolerance

    inattentive_flag = not (
        (pitch_range[0] - BUFFER) <= pitch_deg <= (pitch_range[1] + BUFFER) and
        (yaw_range[0] - BUFFER) <= yaw_deg <= (yaw_range[1] + BUFFER)
    )

if image is None or image.size == 0: 
        # No valid crop → skip gaze estimation 
        return False, False
```

run_demo_test.py

```python
    if abs(yaw) > 35 or abs(pitch) > 35:
```

-------------------------------------------------------------------**Production ready changes ends**----------------------------------------------------------

#### Focusing only on microsaccades and drowsiness/sleep/closed eyelid issue

If anything in the pipeline become unstable, even slightly - getting differnt behaviour for the same code. Realized that, microsaccades trigger is depending on many aspects like:

- lighting changes
- reflections: Camera exposure
- frame timing: Frame rate fluctuations
- bounding‑box stability from SPIGA
- system load: CPU/GPU load spikes
- gaze model noise

 -----------------------------------------------------------------**The below approach didnt work**-----------------------------------------------------------------

Adding closed‑eye inattentiveness to your system.
Step 1 — Compute EAR (Eye Aspect Ratio) : This is the standard, stable EAR formula used in drowsiness detection.

```python
def compute_EAR(eye):
    # eye = list of 6 (x, y) points from SPIGA
    A = np.linalg.norm(eye[1] - eye[5])
    B = np.linalg.norm(eye[2] - eye[4])
    C = np.linalg.norm(eye[0] - eye[3])
    EAR = (A + B) / (2.0 * C)
    return EAR
```

Step 2 — Extract eye landmarks from SPIGA : This matches existing SPIGA landmark usage.

Step 3 — Add the inattentiveness rule

```python
eye_closed_counter = 0 # this will be before loop
# ---- Eye Closure Detection (WFLW 98-point) ----
EYE_CLOSED_THRESH = 0.15      # better for glasses + webcam
EYE_CLOSED_FRAMES = 5         # ~0.15 sec at 30 FPS

lm = face.landmarks

# Correct WFLW eyelid indices
left_eye_idx  = [60, 61, 62, 63, 64, 65]
right_eye_idx = [66, 67, 68, 69, 70, 71]

left_eye  = lm[left_eye_idx]
right_eye = lm[right_eye_idx]

left_EAR  = compute_EAR(left_eye)
right_EAR = compute_EAR(right_eye)
EAR = (left_EAR + right_EAR) / 2.0

# Multi-frame smoothing
if EAR < EYE_CLOSED_THRESH:
    eye_closed_counter += 1
else:
    eye_closed_counter = 0

# Mark inattentive if eyes closed long enough
if eye_closed_counter >= EYE_CLOSED_FRAMES:
    inattentive = True
    print(f"[{time.strftime('%H:%M:%S')}] INATTENTIVE → Eyes closed (EAR={EAR:.3f})")
```

This didn't work beacuse: SPIGA’s 98‑point model does not include eyelid landmarks at all.

------------------------------------------------------------------------------------**end**---------------------------------------------------------------------------------

No, cannot detect closed eyes using the Gaze360 ResNet‑34 gaze‑direction model.  
It was never trained for eyelid state, and it intentionally ignores eyelid motion.

Trying to add new code using gaze degree drop and frames to identify sleepig state.

Microsaccades

- Need short window
- Need history
- Need loop
- Need instant detection

Drowsiness

- Need long window
- Need no history
- Need consecutive frames
- Need sustained detection

***Tested with poor lighting, calibration itself doesnot continue. Need to make sure, is there any rule which abort smoothly if there is no successful calibration***

------------------------------------------------------**FPS Notes**---------------------------------------------------

1. CV pipeline in my laptop is running at **0.54–0.69 FPS**. That means one frame every **~1.5–2 seconds**.
2. For FPS between **15-30**, the current code works perfectly for microsaccades.
3. The realistic FPS ranges between **0.5–2 FPS** for current CV pipeline when running on common AWS **CPU instances**.
4. With the current models: Assuming Realistic FPS in production (AWS CPU): 0.5–2 FPS
    This is enough for:

    - attention state
    - head pose
    - gaze direction
    - microsaccade detection (if you smooth over time)

    But not enough for:

    - blink detection
    - eyelid motion
    - fine‑grained microsaccades
    - smooth gaze tracking

    Options:

    - GPU is the difference between a prototype and a production‑ready system.
        it go from:
        1. 0.5–2 FPS → 15–30 FPS
        2. jittery → smooth
        3. inconsistent → reliable
    - Replacing SPIGA with MediaPipe FaceMesh give 10–20 FPS for cpu

Lawrence laptop - **16FPS**
production **5FPS**- we can increase to **20FPS**, latency/delay of receiving frames to CV model, 3 seconds

-----------------------------------------------------**FPS Notes End**----------------------------------------------

Tesing code in Lawrence laptop: kept original code for microsaccades with two changes

`face.bbox instead of bbox`

and

```python
# prevents loop from running on an empty or single‑entry list
    if len(recent_entries) < 2: 
        return False
```

Added drowsiness code which using delta_deg

Log analysis:

- mocrosaccdes were triggering when the angle is greater than 13
- dowsiness code never triggered

Lawrence question:

1. Micosaccdes are tiny eye movements which are natural. It does not mean the user is inattentive. Instead it can be used to track attentiveness.

    - Normal microsaccades = healthy, focused reading
        During focused reading:
        microsaccades occur 1–2 times per second
        they are small (0.1°–1°)
        they are consistent
        they help maintain fixation
        they refresh the retinal image

    - Inattention changes the pattern, not the presence, of microsaccades
        When someone becomes inattentive, two things happen:
        A. Microsaccade rate drops
            People who zone out show: fewer microsaccades, longer periods of “frozen” gaze, reduced fixation activity, This is called attentional disengagement in neuroscience.
            *So low microsaccade rate is a medium‑strength inattentive signal.*
        B. Gaze jitter increases
            When attention drifts: gaze becomes unstable, small random jumps appear, head pose becomes less steady, This is not a microsaccade — it’s noise from distraction.
            *So high gaze jitter is another medium‑strength inattentive signal.*

        - combining microsaccades with other signals will help to detect inattentiveness

            | Signal                     | Meaning        | Strength   |
            |----------------------------|----------------|------------|
            | Normal microsaccades       | Focused reading| Supportive |
            | Low microsaccade rate      | Zoning out     | Medium     |
            | High gaze jitter           | Distracted     | Medium     |
            | Eyes closed                | Not reading    | Strong     |
            | Head turned away           | Not reading    | Strong     |
            | Gaze outside reading area  | Not reading    | Strong     |

--------------------------------------------------------------------**Future implementation**-------------------------------------------------------------------------

Notes for impelementing Modular Attentive/Inattentive architecture.

1. Separate Gaze Evaluation From Attention Logic
    Right now, gaze detection + attention inference are mixed. In this Option, you split them:
    `evaluate_gaze()`
    Input: frame + bbox
    Output: pitch_deg, yaw_deg, pitch_rad, yaw_rad

    This function does NOT decide inattentiveness. It only extracts gaze.
        - low‑level gaze extraction
        - clean separation of responsibilities
        - reusable gaze signals

2. Maintain Gaze History
    You keep a rolling 1‑second window:
    `update_gaze_history()`
    Stores:
    - timestamp
    - pitch_rad
    - yaw_rad

    This enables:
    - microsaccade detection
    - gaze stability scoring
    - temporal smoothing

3. Microsaccade Logic (Event + Rate)
    Microsaccades are not inattentiveness.
    They are context.
    You need two functions:
    `detect_microsaccade()`: Detects a single event in the last 1 second.
    `microsaccade_rate()`: Counts events in the last 2 seconds.
    Use cases:
    - low microsaccade rate → zoning out
    - single microsaccade → weak evidence

4. Gaze Stability Score
    This is crucial at 5–20 FPS.
    `gaze_stability()`: Compute average angular delta between consecutive gaze samples.
    Use cases:
    - high instability → distraction
    - stable gaze → engaged

5. Gaze‑Range Inattentiveness
    This is existing logic:
    `pitch_deg, yaw_deg within calibrated range?` Keep it, but treat it as a medium‑strength signal, not the final decision.
    - gaze drift detection
    - calibration buffer handling

6. Fusion Layer (The main part)
    This is where everything comes together.
    `fuse_attention_signals()`
    Inputs:gaze range flag, microsaccade event, microsaccade rate, gaze stability, head pose, emotion, phone detection, face missing
    Outputs: final inattentive (True/False), debug_info dict

    Fusion rules:
    - Strong signals (score +3)
        - face missing
        - head pose outside
        - phone detected
    - Medium signals (score +2)
        - gaze outside range
        - low microsaccade rate
        - high gaze instability
        - emotion bored
    - Weak signals (score +1)
        - single microsaccade event

    Final decision: `inattentive = score >= 3` This gives: 
    - smooth attention classification
    - no flickering states
    - production‑ready behavior

7. Main Loop Integration
    main loop becomes:
        1. evaluate_gaze()
        2. update_gaze_history()
        3. detect_microsaccade()
        4. microsaccade_rate()
        5. gaze_stability()
        6. fuse_attention_signals()
    This keeps everything modular and testable.
        - clean pipeline flow
        - easy debugging
        - future extensibility

------------------------------------------------------------------------------**End-Future implemenatation**-------------------------------------------------

Notes:(Lisa)
min 15 seconds wait time for  headpose inattentiveness
closing eyes 30sec
blink data is in cv model spreadsheet, 3rd tab link rate section.
