import websocket
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

DISCORD_TOKEN = os.getenv('DISCORD_TOKEN')
WEBSOCKET_SECRET = os.getenv('WEBSOCKET_SECRET')
WEBSOCKET_URL = f"ws://localhost:{os.getenv('WEBSOCKET_PORT')}?secret={WEBSOCKET_SECRET}"

def on_message(ws, message):
    """
    Called when a message is received from the WebSocket server.

    Args:
        ws (WebSocket): The WebSocket instance.
        message (str): The received message in JSON format.
    """
    data = json.loads(message)
    print(f"{data['source_name']} said: {data['message']} on {data['timestamp']}")

    # Example of sending a message back to Minecraft
    response = {
        'source_name': 'PythonBot',
        'message': 'Hello from Python!'
    }
    ws.send(json.dumps(response))

def on_error(ws, error):
    """
    Called when an error occurs with the WebSocket connection.

    Args:
        ws (WebSocket): The WebSocket instance.
        error (str): The error message.
    """
    print(f"Error: {error}")

def on_close(ws):
    """
    Called when the WebSocket connection is closed.

    Args:
        ws (WebSocket): The WebSocket instance.
    """
    print("### closed ###")

def on_open(ws):
    """
    Called when the WebSocket connection is opened.

    Args:
        ws (WebSocket): The WebSocket instance.
    """
    print("### connected ###")

if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp(WEBSOCKET_URL,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()
