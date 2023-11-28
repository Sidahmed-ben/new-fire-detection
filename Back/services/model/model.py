
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
import tensorflow as tf
import numpy as np
import torch



def saveModel(modelPath):
    # Downloading our best model that was picked up by Model-Checkpoint
    best_model = tf.keras.models.load_model(modelPath)
    return best_model

# Funtion to read image and transform image to tensor 
def load_and_prep_image(imageArray, img_shape = 300):
    numpy_array = np.array(imageArray, dtype=np.uint8)
    tensorflow_tensor = tf.convert_to_tensor(numpy_array, dtype=tf.uint8)
    img = tf.image.resize(tensorflow_tensor, size = [img_shape, img_shape]) # resize the image
    return img


def predict(model, imageArray):
    # predefining class names so not to confuse with the output 
    class_names = ['Not-Fire','Fire']
    # Import the target image and preprocess it
    img = load_and_prep_image(imageArray)
    # Make a prediction
    pred = model.predict(tf.expand_dims(img, axis=0))
    if len(pred[0]) > 1: # check for multi-class
        pred_class = class_names[pred.argmax()] # if more than one output, take the max
    else:
        pred_class = class_names[int(tf.round(pred)[0][0])] # if only one output, round
    
    return pred_class