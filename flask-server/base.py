from flask import Flask, request
from helper import helper
from flask_cors import CORS, cross_origin

api= Flask(__name__)

cors = CORS(api)
api.config['CORS_HEADERS'] = 'Content-Type'

@api.route('/imageToText', methods=["POST"])
def imageToText():
    
    text = helper()
    image_file = request.files.get('image')
    print(image_file.name)
    return text

    



if __name__ == "__main__":
    api.run(port=5000)