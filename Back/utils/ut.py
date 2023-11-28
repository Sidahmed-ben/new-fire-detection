import cv2
import pafy



def getFrameFromUrl(streamUrl):
    # Use pafy to get the video stream url
    video = pafy.new(streamUrl)
    # Have a look at available streams
    print("Streams : " + str(video.allstreams))
    # But for now get best stream
    best = video.getbest(preftype="mp4")
    # Initialise OpenCV Video Capture Object with URL
    capture = cv2.VideoCapture(best.url)
    ret, frameToSave = capture.read()
    frameRGB = cv2.cvtColor(frameToSave, cv2.COLOR_BGR2RGB)
    if ret == True:
        # save frame as JPEG file
        cv2.imwrite("./capture/frame.jpg", frameToSave)     
    return frameRGB,frameToSave


# saveFrameFromUrl("https://youtu.be/vHOv3sJWkUs")