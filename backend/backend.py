from dateutil.relativedelta import relativedelta
import google.generativeai as genai
import os
from dotenv import load_dotenv
import requests
from google.cloud import firestore, texttospeech
import json
import random
import re
import string
import base64
from datetime import datetime, date, timedelta
from pydantic import BaseModel

load_dotenv()

import google.generativeai as genai

genai.configure(api_key="AIzaSyAhZW9160t_09GR1MwSZsAYzFkQroFfey8")

model = genai.GenerativeModel("gemini-pro")
db = firestore.Client()

def remove_special_chars(text):
    allowed = string.ascii_letters + string.digits + string.punctuation + " "
    return ''.join(ch for ch in text if ch in allowed)

def keep_only_numbers(s):
    return re.sub(r"[^0-9]", "", s)

from flask import Flask, jsonify, request

app = Flask(__name__)

from flask_cors import CORS
CORS(app)

@app.route('/generate', methods=['POST'])
def generate():
    query = request.args.get('q')

    if query is None:
        return {"error": "No query provided"}, 404

    data = request.get_json(silent=True)

    if(query == "paragraph"):
        response = model.generate_content(
            "Write a short 2–3 sentence reading passage designed to help 2nd–4th graders with dyslexia improve their reading skills. Use simple words and farm themes."
        )
        return {"text": remove_special_chars(response.text)}, 200

    elif(query == "sentence"):
        if data is None or "words" not in data:
            return {"error": "No words provided"}, 400

        words = data["words"]

        response = model.generate_content(
            f"Create one simple sentence using these words: {words}"
        )
        return {"text": remove_special_chars(response.text)}, 200

    elif(query == "word"):
        if data is None or "words" not in data:
            return {"error": "No words provided"}, 400

        return {"text": remove_special_chars(random.choice(words))}, 200

    else:
        return {"error": "Invalid query"}, 404


    audio_file = request.files["file"]

    data = request.form.get("json")

    try:
        data = json.loads(data)
    except:
        data = {"generated": data}

    if "generated" not in data:
        return {"error": "No generation provided"}, 400

    generated = data["generated"]


    response = model.generate_content(
        f"""
        Compare:
        Generated: {generated}
        Transcribed: {transcript.text}

        Return only incorrect words as JSON list.
        """
    )

    return response.text, 200


# ---------------- FIRESTORE ROUTES (UNCHANGED) ----------------

@app.route('/data/users', methods=['GET'])
def get_users():
    user = request.args.get('user')

    if user is None:
        return {"error": "No user provided"}, 404

    doc = db.collection("users").document(user.lower()).get()

    if doc.exists:
        return {"user": user, "number": doc.to_dict()["number"]}, 200
    else:
        return {"error": "User not found"}, 404


@app.route('/data/users', methods=['POST'])
def add_user():
    data = request.get_json()

    try:
        user = data["user"].lower()
        name = data["name"].title()
        password = data["password"]
        grade = int(data["grade"])
        number = keep_only_numbers(data["number"])
    except:
        return {"error": "Missing data"}, 400

    db.collection("users").document(user).set({
        "user": user,
        "name": name,
        "password": password,
        "grade": grade,
        "number": number
    })

    return {"message": "User added"}, 200


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001)