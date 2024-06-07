const bedrock = require('bedrock-protocol');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const {
  MINECRAFT_HOST,
  MINECRAFT_PORT,
  MINECRAFT_USERNAME,
  WEBSOCKET_PORT,
  WEBSOCKET_SECRET
} = process.env;

/**
 * Create a Bedrock client and connect to the Minecraft server.
 * @returns {object} - The Bedrock client instance.
 */
function createClient() {
  return bedrock.createClient({
    host: MINECRAFT_HOST,
    port: MINECRAFT_PORT,
    username: MINECRAFT_USERNAME,
    offline: true
  });
}

/**
 * Set up the WebSocket server and handle communication with the Bedrock client.
 * @param {object} client - The Bedrock client instance.
 */
function setupWebSocket(client) {
  const ws = new WebSocket.Server({ port: WEBSOCKET_PORT });

  ws.on('connection', (socket, req) => {
    const params = new URLSearchParams(req.url.split('?')[1]);
    if (params.get('secret') !== WEBSOCKET_SECRET) {
      socket.close();
      console.log('Unauthorized connection attempt');
      return;
    }

    console.log('Python connected');

    client.on('text', (packet) => {
      if (packet.source_name != client.username) {
        const messageData = {
          source_name: packet.source_name,
          message: packet.message,
          timestamp: new Date().toLocaleString()
        };
        socket.send(JSON.stringify(messageData));
      }
    });

    socket.on('message', (message) => {
      const data = JSON.parse(message);
      client.queue('text', {
        type: 'chat', needs_translation: false, source_name: client.username, xuid: '', platform_chat_id: '',
        message: `${data.source_name} said: ${data.message} on ${new Date().toLocaleString()}`
      });
    });

    socket.on('close', () => {
      console.log('Python disconnected');
    });
  });
}

const client = createClient();
setupWebSocket(client);

client.on('join', () => console.log('Player has joined!'));
client.on('spawn', () => console.log('Player has spawned!'));
client.on('text', (packet) => console.log('Client got text packet', packet));
client.on('add_player', (packet) => {
  client.queue('text', {
    type: 'chat', needs_translation: false, source_name: client.username, xuid: '', platform_chat_id: '',
    message: `Hey, ${packet.username} just joined!`
  });
});
