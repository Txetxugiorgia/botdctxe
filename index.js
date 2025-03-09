require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const translate = require('@vitalets/google-translate-api');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const PREFIX = '!';
const TRANSLATED_MESSAGES = new Set(); // Para evitar loops de traducción

client.on('ready', () => {
    console.log(`✅ Bot activo como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return; // Ignorar bots
    if (TRANSLATED_MESSAGES.has(message.id)) return; // Evitar bucles de traducción

    try {
        let lang = 'it'; // Idioma destino por defecto
        if (/\p{Script=Latin}/u.test(message.content)) {
            lang = 'it'; // Español a italiano
        } else {
            lang = 'es'; // Italiano a español
        }
        
        const translation = await translate(message.content, { to: lang });
        if (translation.text !== message.content) {
            const reply = `**${message.author.username} dijo:**\n${translation.text}`;
            TRANSLATED_MESSAGES.add(message.id); // Evitar loop
            message.channel.send(reply);
        }
    } catch (error) {
        console.error('Error en la traducción:', error);
    }
});

client.login(process.env.TOKEN);