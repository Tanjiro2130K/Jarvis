/*------------------------------------------------------------------------------------------------------------------------------------------------------

Copyright (C) 2023 Loki - Xer.
Licensed under the GPL-3.0 License;
you may not use this file except in compliance with the License.
Jarvis - Loki-Xer 

------------------------------------------------------------------------------------------------------------------------------------------------------*/

const { System, IronMan, isPrivate, getJson, getBuffer } = require("../lib/");

System({ 
    pattern: "waifu", 
    fromMe: isPrivate, 
    desc: "Send a waifu image", 
    type: "anime" 
}, async (message) => {
    const response = await getJson(await IronMan("ironman/waifu"));
    if (!response.status) return await message.send("Unable to summon the waifu image.");
    await message.send(response.ironman.url, { caption: "Your waifu is here, enjoy!", quoted: message.data }, "image");
});

System({ 
    pattern: "neko", 
    fromMe: isPrivate, 
    desc: "Send neko images", 
    type: "anime" 
}, async (message) => {
    const response = await getJson(await IronMan("ironman/neko"));
    if (!response.status) return await message.send("The neko image couldn't be fetched.");
    await message.send(response.ironman.url, { caption: "Here’s your cute neko!", quoted: message.data }, "image");
});

System({
    pattern: 'anime (.*)',
    fromMe: isPrivate,
    desc: 'Get details of an anime',
    type: 'anime',
}, async (message, match) => {
    if (!match) return await message.send("Please provide the name of an anime.\nExample: .anime Attack on Titan");
    const anime = encodeURI(match);
    const res = await fetch(IronMan(`ironman/s/anime?anime=${anime}`));
    if (!res.ok) return await message.send("Anime not found. Double-check the name and try again.");
    const data = await res.json();
    const {
        "English Title": Etitle,
        Romaji,
        Japanese,
        Summary,
        Released,
        Ended,
        Popularity,
        Rating,
        "Age Rating": AgeRating,
        Subtype,
        Status,
        Poster,
        Episodes,
        "Episode Length": EpisodeLength,
        "Total Length": TotalLength,
        "Show Type": ShowType,
        NSFW,
        Low_Cover: Cover,
        YouTube
    } = data;
    const pimage = await getBuffer(Cover);
    const link = "https://github.com/yudataguy/Awesome-Japanese";
    const caption = `➥ *Title:* ${Romaji}\n✰ *Type:* ${ShowType}\n✰ *Subtype:* ${Subtype}\n✰ *Status:* ${Status}\n✰ *Released:* ${Released}\n✰ *Ended:* ${Ended}\n✰ *Episodes:* ${Episodes}\n✰ *Total Duration:* ${TotalLength}\n✰ *Episode Duration:* ${EpisodeLength}\n✰ *Age Rating:* ${AgeRating}\n✰ *Popularity:* ${Popularity}\n✰ *Rating:* ${Rating}\n✰ *NSFW:* ${NSFW}\n✰ *Summary:* ${Summary}\n➥ *Trailer:* https://youtube.com/watch?v=${YouTube}`;
    const linkPreview = { title: Etitle, body: Japanese, thumbnail: pimage, mediaType: 1, mediaUrl: link, sourceUrl: link, showAdAttribution: false, renderLargerThumbnail: true };
    await message.client.sendMessage(message.chat, { image: { url: Poster }, caption, contextInfo: { externalAdReply: linkPreview } }, { quoted: message });
});

System({
    pattern: 'aquote ?(.*)',
    fromMe: isPrivate,
    desc: 'Get a random anime quote',
    type: 'anime',
}, async (message) => {
    const data = await getJson(IronMan('api/aquote'));
    if (!data || !data.result || data.result.length === 0) return await message.reply("No quotes found in the anime universe.");
    const randomIndex = Math.floor(Math.random() * data.result.length);
    const { english: quote, character, anime } = data.result[randomIndex];
    await message.send(`➭ *Quote:* "${quote}"\n➭ *Character:* ${character}\n➭ *Anime:* ${anime}`);
});
