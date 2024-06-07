# BDSCord

BDSCord is a tool for integrating Minecraft Bedrock server chat with a Python component via WebSockets, using `bedrock-protocol` for Minecraft and `websocket-client` for Python.

## Setup

To set up the project, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/bdscord.git
    cd bdscord
    ```

2. Install the required npm packages:
    ```sh
    npm install
    ```

3. Run the setup script to configure the project:
    ```sh
    npm run setup
    ```

    The setup script will prompt you for configuration values and generate a `.env` file.

## Configuration

The `.env` file contains the following configuration variables:

- `MINECRAFT_HOST`: The host of the Minecraft server (default: `127.0.0.1`)
- `MINECRAFT_PORT`: The port of the Minecraft server (default: `19132`)
- `MINECRAFT_USERNAME`: The username for the Minecraft bot (default: `BDSCord`)
- `WEBSOCKET_PORT`: The port for the WebSocket server (default: `19421`)
- `DISCORD_TOKEN`: The token for the Discord bot
- `WEBSOCKET_SECRET`: A secret key for authenticating WebSocket connections

## Running the Project

After setting up the configuration, you can start the project by running:

```sh
npm start
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.