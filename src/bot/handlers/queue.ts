import { Composer } from "grammy";
import { escape } from "html-escaper";
import i18n from "../i18n";
import queues from "../../queues";

const composer = new Composer();

export default composer;

composer.command(["now", "ns", "cs", "np", "cp"], (ctx) => {
    const now = queues.getNow(ctx.chat.id);

    if (now) {
        const { title, url, requester } = now;

        return ctx.reply(
            i18n("ns", {
                title,
                titleUrl: url,
                requester: requester.first_name,
                requesterUrl: `tg://user?id=${requester.id}`,
            }),
        );
    }

    return ctx.reply(i18n("not_streaming"));
});

composer.command(["queue", "q"], (ctx) => {
    const now = queues.getNow(ctx.chat.id);
    const fullQueue = queues.getAll(ctx.chat.id);

    if (now) {
        const { title, url, requester } = now;

        let text = `▶ <b>${escape(title)}</> (${requester.first_name})`;

        fullQueue.forEach((queueItem, index) => {
            const { title, url, requester } = queueItem;
            text += `\n${index+1}. <b>${escape(title)}</> (${requester.first_name})`;
        })

        return ctx.reply(text);
    }

    return ctx.reply(i18n("not_streaming"));
})

composer.command(["remove", "rm"], (ctx) => {
    const index = Number.parseInt( ctx.message?.text.split(/\s/)[1] ?? "" );
    if (isNaN(index) || index < 1) {
        return ctx.reply(i18n("invalid_remove"));
    }

    const now = queues.getNow(ctx.chat.id);
    const fullQueue = queues.getAll(ctx.chat.id);

    if (now) {
        if (fullQueue.length === 0) {
            return ctx.reply(i18n("queue_empty"));
        }

        if (index > fullQueue.length) {
            return ctx.reply(i18n("invalid_remove"));
        }

        const [removedItem] = fullQueue.splice(index - 1, 1);

        return ctx.reply(
            i18n("removed", {
                title: removedItem.title,
            }),
        );
    }

    return ctx.reply(i18n("not_streaming"));
})
