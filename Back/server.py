import base64
from services.model.dbHandler import createImageTableDB, createUserTableDB,addUserDB,deleteUserDB,getUserDB
from flask import Flask,jsonify,request,render_template_string
from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy
from utils.ut import getFrameFromUrl, read_image
from services.model.model import saveModel, load_and_prep_image, predict
import sched, time
import cv2
from flask_cors import CORS
from flask_mail import Mail,Message
import os
from datetime import datetime
from sqlalchemy.orm import joinedload
import base64


# importing time and sched module

app = Flask(__name__)
testVar = 0
CORS(app)

# Configure the database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost:5432/fire_detection_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


# Initialize the database connection
db = SQLAlchemy(app)

# Define user table model
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    email = db.Column(db.String(255))

# Define Image table model
class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.LargeBinary)
    user_id = db.Column(db.Integer, nullable=True)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)


# # Download Model
resNetModel = saveModel("./services/model/model/fire-detection-model.h5")
streamUrl = None


app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'detectionfire00@gmail.com'
app.config['MAIL_PASSWORD'] = 'cmrtwhqjidwxyels'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)


@app.route("/api/save-image", methods=['POST'])
def test():
    body = request.get_json()
    user_id = body.get('user_id', None)
    file_path = './capture/frame.jpg'
    image_data = read_image(file_path)
    new_image = Image(data=image_data, user_id=user_id)
    db.session.add(new_image)
    db.session.commit()
    return {"message" : "Image saved successffully "}


@app.route('/api/get-images', methods=['GET'])
def get_images():
    images = (
        db.session.query(Image, User)
        .outerjoin(User, Image.user_id == User.id)
        .all()
    )

    image_list = []
    for image, user in images:
        user_info = {
            'id': user.id,
            'name': user.name,
            'email': user.email
        } if user else None  # Si user est None, user_info est None

        print(image.data)
        image_list.append({
            'id': image.id,
            'data': base64.b64encode(image.data).decode('utf-8'),
            'created_date': image.created_date.strftime('%Y-%m-%d %H:%M:%S'),
            'user': user_info
        })

    return jsonify({'images': image_list})



@app.route('/api/send-mail',methods=['POST'])
def sendMail():
    body = request.get_json()
    email = body["email"]
    # msg = Message("Hey", sender="noreply@demo.com", recipients=[email])     

    # Create a message instance
    msg = Message('Emergency Alert: Fire Detected', sender="FireDetection@demo.com",recipients=[email])

    # Define the HTML content
    html_content = """
        <p>🔥 <strong>Emergency Alert: Fire Detected at Home</strong> 🔥</p>
        <p>Dear Client </p>
        <p>We regret to inform you that our fire detection system has identified a potential fire at your home. Your safety is our top priority, and immediate action is crucial.</p>
        <ul>
            <li><strong>Stay Calm:</strong> It's essential to remain calm. Take a deep breath.</li>
            <li><strong>Evacuate Immediately:</strong> Exit the premises as quickly and safely as possible.</li>
            <li><strong>Do Not Delay:</strong> Leave belongings behind; focus on your safety.</li>
            <li><strong>Call Emergency Services:</strong> Dial your local emergency number (firefighter :18) to report the fire.</li>
            <li><strong>Inform Neighbors:</strong> Alert nearby neighbors about the situation.</li>
        </ul>
        <p>Remember, your life is irreplaceable, and your safety is paramount. Our support team is coordinating with emergency services to address the situation.</p>
        <p>Please stay safe,<br>{organization_name}</p>
    """.format(organization_name='Fire Detection Team')

        # Set the HTML content for the email
    msg.html = render_template_string(html_content)

      # Attach the image
    with app.open_resource('capture/frame.jpg') as fp:
        msg.attach('image.jpg', 'image/jpeg', fp.read(), 'inline', headers=[('Content-ID', '<image>')])
    mail.send(msg)
    return '<h2>Mail sended successffully</h2>'


@app.route('/api/create-image-table')
def createImageTable():
    createImageTableDB(db,Image)
    return '<h2>Table image created succeffully</h2>'


@app.route('/api/create-user-table')
def createUserTable():
    createUserTableDB(db,User)
    return '<h2>Table user succeffully</h2>'


@app.route('/api/add-user', methods=['POST'])
def addUser():
    body = request.get_json()
    name = body["name"]
    email = body["email"]
    addUserDB(db,User,name,email)
    return '<h2>User added successfully </h2>'

@app.route('/api/delete-user', methods=['POST'])
def deleteUser():
    body = request.get_json()
    userId = body["userId"]
    deleteUserDB(db,User,userId)
    return '<h2>User deleted successfully </h2>'

@app.route('/api/get-users', methods=['GET'])
def getUser():
    usersList = []
    users = getUserDB(db,User)
    for userItem in users:
        item = {}
        item["id"] = userItem.id
        item["name"] = userItem.name
        item["email"] =  userItem.email 
        usersList.append(item)
        # print(userItem.name," ",userItem.email)
    # print(usersList)
    return jsonify(users = usersList)





@app.route("/api/check-stream-url", methods=['GET'])
def chackStreamUrl():
    global streamUrl
    return {"streamUrl":streamUrl}


@app.route("/api/set-strem-url", methods=['POST'])
def setStreamUrl():
    global streamUrl
    body = request.get_json()
    # streamUrl = "https://www.youtube.com/watch?v="+body["streamUrl"]
    streamUrl = body["streamUrl"]
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

