import json

import requests
import random
from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

# Twilio credentials (set these as environment variables in production!)
ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE = os.getenv("TWILIO_PHONE_NUMBER")

# Your local API endpoint
API_URL = "http://127.0.0.1:5001/data/users"

# List of motivational messages
motivationalMessages = [
    "🌟 You're doing great! Keep practicing!",
    "🚀 Every word you learn is progress!",
    "💪 Your hard work is paying off!",
    "🎯 Focus and patience - you've got this!",
    "⭐ Reading champion in the making!",
]

def send_motivational_sms(user):
    # Step 1: Get user data from API
    try:
        response = requests.get(f'{API_URL}?user={user}')
        response.raise_for_status()
        users = response.json()
    except Exception as e:
        print(f"Error fetching user data: {e}")
        return

    print(json.loads(response.text)['number'])
    phone_number = "1"+json.loads(response.text)['number']

    message_text = f"{random.choice(motivationalMessages)} 📚 Open the app to start learning!"

    # Step 4: Send the message with Twilio
    try:
        client = Client(ACCOUNT_SID, AUTH_TOKEN)
        message = client.messages.create(
            body=message_text,
            from_=TWILIO_PHONE,
            to=phone_number
        )
        print(f"✅ Sent message to {phone_number}: {message.sid}")
    except Exception as e:
        print(f"❌ Failed to send message to {phone_number}: {e}")

if __name__ == "__main__":
    send_motivational_sms('myusername')
    # send_motivational_sms('veer')