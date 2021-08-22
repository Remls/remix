import ytdl from "ytdl-core";
import { Composer } from "grammy";
import i18n from "../i18n";
import { audio, custom, youtube, youtubeSearch } from "../streamer";

const composer = new Composer();

export default composer;

composer.command(["stream", "s", "play", "p"], async (ctx) => {
    const input =
        ctx.message?.reply_to_message?.audio ||
        ctx.message?.reply_to_message?.voice ||
        ctx.message?.reply_to_message?.text ||
        ctx.message?.text.split(/\s/)[1];

    if (!input) {
        await ctx.reply(i18n("no_input"));
        return;
    }

    let result;
    if (typeof input === "string") {
        if (ytdl.validateURL(input)) {
            result = await youtube(ctx.chat.id, ctx.from!, input);
        } else {
            const customKeywords = ["-c", "-custom"];
            let inputWords = ctx.message!.text.split(/\s/);
            inputWords.shift();     // Remove command
            if (customKeywords.includes(inputWords[0].toLowerCase())) {
                result = await custom(inputWords[1], ctx.message!);
            } else {
                result = await youtubeSearch(ctx.chat.id, ctx.from!, inputWords.join(" "));
            }
        }
    } else {
        result = await audio(ctx.message?.reply_to_message!);
    }

    if (result == null) {
        await ctx.reply(i18n("streaming"));
        return;
    }

    await ctx.reply(i18n("queued_at", { position: String(result) }));
});
