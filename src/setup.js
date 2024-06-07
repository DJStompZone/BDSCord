const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const ENV_PATH = path.resolve(__dirname, '.env');

async function generateEnvFile(config) {
  const envContent = `
MINECRAFT_HOST=${config.MINECRAFT_HOST}
MINECRAFT_PORT=${config.MINECRAFT_PORT}
MINECRAFT_USERNAME=${config.MINECRAFT_USERNAME}
WEBSOCKET_PORT=${config.WEBSOCKET_PORT}
DISCORD_TOKEN=${config.DISCORD_TOKEN}
WEBSOCKET_SECRET=${config.WEBSOCKET_SECRET}
`.trim();

  fs.writeFileSync(ENV_PATH, envContent);
}

async function displayConfig(config) {
  const chalk = (await import('chalk')).default;
  console.log('\nReview your configuration:');
  for (const [key, value] of Object.entries(config)) {
    if (value && value?.length > 0) {
      console.log(`${chalk.green(key)}: ${value}`);
    } else {
      console.log(`${chalk.red(key)}: Not set`);
    }
  }
}

async function getConfig() {
  const inquirer = (await import('inquirer')).default;
  const chalk = (await import('chalk')).default;
  const generatedSecret = uuidv4();
  
  // Load current .env values if they exist
  const currentConfig = dotenv.config().parsed || {};

  const questions = [
    {
      type: 'input',
      name: 'MINECRAFT_HOST',
      message: `Enter the ${chalk.yellow("Minecraft server's IP")}:`,
      default: currentConfig.MINECRAFT_HOST || '127.0.0.1'
    },
    {
      type: 'input',
      name: 'MINECRAFT_PORT',
      message: `Enter the ${chalk.yellow("Minecraft server's port")}:`,
      default: currentConfig.MINECRAFT_PORT || '19132'
    },
    {
      type: 'input',
      name: 'MINECRAFT_USERNAME',
      message: `Enter your ${chalk.yellow("Minecraft username")} or ${chalk.yellow("Xbox Gamertag")}:`,
      default: currentConfig.MINECRAFT_USERNAME || 'BDSCord'
    },
    {
      type: 'password',
      name: 'DISCORD_TOKEN',
      message: `Enter your ${chalk.blue("Discord bot token")}:`,
      default: currentConfig.DISCORD_TOKEN
    },
    {
      type: 'input',
      name: 'WEBSOCKET_PORT',
      message: `Enter your custom ${chalk.magenta("WebSocket port")}:\n(${chalk.red("Don't change this unless you know what you're doing!")})`,
      default: currentConfig.WEBSOCKET_PORT || '19421'
    },
    {
      type: 'password',
      name: 'WEBSOCKET_SECRET',
      message: `Press Enter to use the ${currentConfig?.WEBSOCKET_SECRET ? "current":"generated"} ${chalk.magenta("WebSocket secret")}...\n`,
      default: currentConfig.WEBSOCKET_SECRET || generatedSecret
    }
  ];

  const answers = await inquirer.prompt(questions);
  return answers;
}

async function main() {
  const inquirer = (await import('inquirer')).default;

  if (fs.existsSync(ENV_PATH)) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: '.env file already exists. What would you like to do?',
        choices: [
          { name: 'Start over and create a new configuration', value: 'startOver' },
          { name: 'Update missing/blank values in the existing configuration', value: 'update' },
          { name: 'Exit', value: 'exit' }
        ]
      }
    ]);

    if (action === 'exit') {
      console.log('Exiting without changes.');
      return;
    }

    if (action === 'startOver') {
      fs.unlinkSync(ENV_PATH);
    }
  }

  const config = await getConfig();
  await generateEnvFile(config);
  await displayConfig(config);

  console.log('\nConfiguration saved to .env file.');
}

main();
