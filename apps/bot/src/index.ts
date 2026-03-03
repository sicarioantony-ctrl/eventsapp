import { Telegraf } from "telegraf";

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN is required");
}

const bot = new Telegraf(token);

bot.start((ctx) => ctx.reply("Eventsapp bot is online."));
bot.command("ping", (ctx) => ctx.reply("pong"));

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

