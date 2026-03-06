import { Telegraf } from "telegraf";

const token = process.env.BOT_TOKEN;
if (!token || token === "your-telegram-bot-token-or-placeholder") {
  console.warn("[bot] BOT_TOKEN is not set or is a placeholder — skipping launch. Set a valid token in .env and restart.");
  process.exit(0);
}

const bot = new Telegraf(token);

bot.start((ctx) =>
  ctx.reply(
    `Добро пожаловать в EventsApp Bot!\n\nВаш Chat ID: ${ctx.chat.id}\n\nДобавьте этот ID в переменную NOTIFY_CHAT_ID в файле .env, чтобы получать уведомления о новых заявках.`,
  ),
);

bot.command("chatid", (ctx) =>
  ctx.reply(`Ваш Chat ID: ${ctx.chat.id}`),
);

bot.command("ping", (ctx) => ctx.reply("pong"));

bot.catch((err) => {
  console.error("[bot] Unhandled error:", err);
});

async function main() {
  try {
    const me = await bot.telegram.getMe();
    console.log(`[bot] Authenticated as @${me.username}`);
    await bot.launch();
    console.log("[bot] Bot is running");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("401") || message.includes("Unauthorized")) {
      console.error("[bot] Invalid BOT_TOKEN (401 Unauthorized). Get a new token from @BotFather and update .env");
      process.exit(1);
    }
    console.error("[bot] Failed to launch:", message);
    process.exit(1);
  }
}

main();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
