// index.js
// Telegram Recongnition Notification Server ve Express

import express from 'express';
import TelegramBot from 'node-telegram-bot-api';

// --- Konfiguratsiya (alohida .env fayl o'rniga shu yerda) ---
const BOT_TOKEN = '7440125833:AAFrWVjkQTTMO991fbR9uWmeEzh7BFR8rE0';
const ADMIN_CHAT_ID = ['1847596793' , '363452247'];
const PORT = 6000;
// -----------------------------------------------------------

// Telegram botni initsializatsiya qilamiz (polling yo'q)
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

const app = express();
app.use(express.json());

/**
 * Frontenddan /api/recognize endpoint'iga yuboriladigan ma'lumotni qabul qiladi
 * Kutilgan JSON: { name: string, recognizedAt?: string }
 */
app.post('/api/recognize', async (req, res) => {
  const { name, recognizedAt } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Field `name` is required' });
  }

  const timestamp = recognizedAt || new Date().toLocaleString();
  const message = `✅ User *${name}* recognized at ${timestamp}!`;

  try {
    await bot.sendMessage(ADMIN_CHAT_ID, message, { parse_mode: 'Markdown' });
    return res.json({ success: true });
  } catch (err) {
    console.error('❌ Telegram API Error:', err.message);
    return res.status(500).json({ error: 'Failed to send Telegram message' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
