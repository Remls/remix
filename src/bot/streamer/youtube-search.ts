const ytSearch = require("youtube-search-api");
import youtube from "./youtube";
import { User } from "@grammyjs/types";

export default async (
    chatId: number,
    requester: User,
    searchTerm: string
) => {
    const results = await ytSearch.GetListByKeyword(searchTerm);

    if (results.items && results.items.length > 0) {
        return youtube(chatId, requester, results.items[0].id);
    }

    throw new Error("No results found.");
};
