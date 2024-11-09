from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from dotenv import load_dotenv
load_dotenv()
import os

TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_NUMBER = os.getenv('TWILIO_NUMBER')


def send_answer(phone_number, question,answer):
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    message = client.messages.create(
        body=f'Hello, you asked : {question} : {answer}',
        from_=TWILIO_NUMBER,  # Replace with your Twilio number
        # to=phone_number
        # ill replace this because i dont have a premium twilio account 🚫🚫🚫🚫🚫
        to='+21656725104'
    )

    return message.sid
