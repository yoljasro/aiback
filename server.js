// index.js
import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config(); // .env fayldan o‘qish

// --- Konfiguratsiya ---
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_IDS = process.env.ADMIN_CHAT_IDS?.split(',') || [];
const PORT = process.env.PORT || 6000;
// ----------------------

// Telegram botni initsializatsiya qilamiz
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

const app = express();
app.use(express.json());

app.post('/api/recognize', async (req, res) => {
  const { name, recognizedAt } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Field `name` is required' });
  }

  const timestamp = recognizedAt || new Date().toLocaleString();
  const message = `✅ User *${name}* recognized at ${timestamp}!`;

  try {
    for (const chatId of ADMIN_CHAT_IDS) {
      await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }
    return res.json({ success: true });
  } catch (err) {
    console.error('❌ Telegram API Error:', err.message);
    return res.status(500).json({ error: 'Failed to send Telegram message' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
