import base64
from services.model.dbHandler import createUserTableDB,addUserDB,deleteUserDB,getUserDB
from flask import Flask,jsonify,request
from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy
from utils.ut import getFrameFromUrl
from services.model.model import saveModel, load_and_prep_image, predict
import sched, time
import cv2
from flask_cors import CORS


# importing time and sched module

app = Flask(__name__)
testVar = 0
CORS(app, origins="http://localhost:3000", supports_credentials=True, methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# Configure the database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost:5432/fire_detection_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


# Initialize the database connection
db = SQLAlchemy(app)

# Define textes table model
class user(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    email = db.Column(db.String(255))



# Download Model
resNetModel = saveModel("./services/model/model/fire-detection-model.h5")
streamUrl = None

@app.route('/api/create-user-table')
def createUserTable():
    createUserTableDB(db,user)
    return '<h2>Table user succeffully</h2>'

@app.route('/api/add-user', methods=['POST'])
def addUser():
    body = request.get_json()
    name = body["name"]
    email = body["email"]
    addUserDB(db,user,name,email)
    return '<h2>User added successfully </h2>'

@app.route('/api/delete-user', methods=['POST'])
def deleteUser():
    body = request.get_json()
    userId = body["userId"]
    deleteUserDB(db,user,userId)
    return '<h2>User deleted successfully </h2>'

@app.route('/api/get-users', methods=['GET'])
def getUser():
    usersList = []
    users = getUserDB(db,user)
    for userItem in users:
        item = {}
        item["name"] = userItem.name
        item["email"] =  userItem.email 
        usersList.append(item)
        # print(userItem.name," ",userItem.email)
    # print(usersList)
    return jsonify(users = usersList)


@app.route("/api/test", methods=['GET'])
def test():
    
    return {"message" : "Api started successfully + "}


@app.route("/api/check-stream-url", methods=['GET'])
def chackStreamUrl():
    global streamUrl
    return {"streamUrl":streamUrl}


@app.route("/api/set-strem-url", methods=['POST'])
def setStreamUrl():
    global streamUrl
    body = request.get_json()
    streamUrl = "https://www.youtube.com/watch?v="+body["streamUrl"]
    return {"message": "ok"}

@app.route("/api/check-fire", methods=['GET'])
def checkFire():
    global resNetModel
    global streamUrl

    if(streamUrl):
        fire = False
        frameToSend = False
        frameRGB, frameFire = getFrameFromUrl(streamUrl)
        predicted = predict(resNetModel, frameRGB)
        if(predicted == "Fire"):
            fire = True
            frameToSend = frameFire
        # Convert the NumPy array to a byte stream
        print("#################")
        print(frameToSend)
        print("#################")
        base64_encoded = ""
        if(type(frameToSend) != bool):
            print(frameToSend[10:])
            image_bytes = cv2.imencode('.jpg', frameToSend)[1].tobytes()
            # Encode the byte stream to base64
            base64_encoded = base64.b64encode(image_bytes).decode('utf-8')
            base64_encoded = 'data:image/jpeg;base64,'+base64_encoded
        print("request done.")
        return {"fire" : fire,"frameFire": base64_encoded}
    else :
        return {"error":400, "message" : "Stream url has not been set"}



if __name__ == "__main__" :
    app.run(debug=True)

