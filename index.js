// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require("node:path");
const dotenv = require('dotenv');



dotenv.config();
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

//pegando o caminho da pasta que estão os comandos
const commandsPath = path.join(__dirname, "commands");
//devolvendo um array de strings com os comandos que foram encontrados
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();


for (const file of commandsFiles) {
    //caminho do arquivo
    const filePath = path.join(commandsPath, file);
    //importando o comando
    const command = require(filePath)

    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`Esse comando em ${filePath} está com "data" ou "execute" ausente`);
    }

}

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(TOKEN);


//Listener de interações com o bot
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand) {
        return;
    }
    const command = interaction.client.commands.get(interaction.commandName);

    if(!command){
        console.error("Comando não encontrado");
        return;
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error);
        // await interaction.reply("houve um erro ao executar o comando 😊");
    }
});


