/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2023 Loki - Xer.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Jarvis - Loki-Xer 

For the weebs, by the weebs - Converting media, one magical spell at a time!

------------------------------------------------------------------------------------------------------------------------------------------------------*/

const fs = require('fs');
const ff = require('fluent-ffmpeg');
const { Image } = require("node-webpmux");
const { fromBuffer } = require('file-type');
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { exec } = require("child_process");
const translate = require("translate-google-api");
const axios = require("axios");
const {
    config,
    System,
    isPrivate,
    toAudio,
    toVideo,
    getJson,
    postJson,
    AddMp3Meta,
    sendUrl,
    getBuffer,
    webpToPng,
    webp2mp4,
    setData,
    getData,
    IronMan,
    extractUrlsFromText,
    makeUrl
} = require("../lib/");
const { trim, elevenlabs, removeBg } = require("./client/"); 
const stickerPackNameParts = config.STICKER_PACKNAME.split(";");
const fancy = require('./client/fancy');

// Turning your sticker into a masterpiece
System({
    pattern: "photo",
    fromMe: isPrivate,
    desc: "Transform your sticker into a cool image!",
    type: "converter",
}, async (message) => {
   if (!message.reply_message?.sticker) return await message.reply("_Please reply with a sticker to bring it to life!_");
   if (message.reply_message.isAnimatedSticker) return await message.reply("_Only non-animated stickers are allowed in this transformation!_");
   let buffer = await webpToPng(await message.reply_message.downloadAndSave());
   return await message.send(buffer, {}, "image");
});

// Turn your audio into an epic track with style
System({
    pattern: "mp3",
    fromMe: isPrivate,
    desc: "Transform your audio/video into a cool mp3 track!",
    type: "converter",
}, async (message, match, m) => {
   if (!(message.reply_message.video || message.reply_message.audio))
   return await message.reply("_Reply to an audio or video to work this magic!_");	
   var audioResult = await toAudio(await message.reply_message.download());
   const [firstName, author, image] = config.AUDIO_DATA.split(";");
   const aud = await AddMp3Meta(audioResult, await getBuffer(image), { title: firstName, body: author });
   await message.reply(aud, { mimetype: "audio/mp4" }, "audio");
});

// A jutsu to make your videos private
System({
    pattern: "ptv",
    fromMe: isPrivate,
    desc: "Turn your video into a private viewable jutsu",
    type: "converter",
}, async (message) => {
   if (!message.video && !message.reply_message.video) return message.reply("Reply to a video to turn it into a private one, ninja style!");
   const buff = await message.downloadMediaMessage(message.video ? message.msg : message.quoted ? message.reply_message.msg : null);
   await message.reply(buff, { ptv: true }, "video");
});

// Create a magical wave with your audio transformation
System({
    pattern: "wawe",
    fromMe: isPrivate,
    desc: "Make your audio into a wave form!",
    type: "converter",
}, async (message) => {
   if (!message.quoted || !message.reply_message?.audio && !message.reply_message?.video) return await message.reply("Reply to an audio/video to summon the wave form!");
   let media = await toAudio(await message.reply_message.download());
   return await message.send(media, { mimetype: 'audio/mpeg', ptt: true, quoted: message.data }, "audio");
});

// Turn stickers into an anime video transformation
System({
    pattern: "mp4",
    fromMe: isPrivate,
    desc: "Convert stickers into a breathtaking anime video!",
    type: "converter",
}, async (message) => {
   if (!message.reply_message?.sticker) return await message.reply("Reply with a sticker to convert it into an anime video!");
   if (!message.reply_message.isAnimatedSticker) return await message.reply("Only animated stickers work in this jutsu!");
   let buffer = await webp2mp4(await message.reply_message.download());
   return await message.send(buffer, {}, "video");
});

// Make your stickers even more animated with a GIF transformation
System({
    pattern: "gif",
    fromMe: isPrivate,
    desc: "Give your stickers the power of GIF magic!",
    type: "converter",
}, async (message) => {
   if (!message.reply_message?.sticker) return await message.reply("_Reply with a sticker to give it the GIF treatment!_");
   if (!message.reply_message.isAnimatedSticker) return await message.reply("_Only animated stickers work here!_");
   const buffer = await webp2mp4(await message.reply_message.download());
   return await message.send(buffer, { gifPlayback: true }, "video");
});

// Add a dark vibe with black screen audio
System({
    pattern: 'black',
    fromMe: isPrivate,
    desc: 'Create a mysterious black video with audio',
    type: "converter"
}, async (message) => {
        const ffmpeg = ff();
        if (!message.reply_message?.audio) return await message.send("_Reply to an audio message to unleash the black screen video magic!_");
        const file = './plugins/client/black.jpg';
        const audioFile = './lib/temp/audio.mp3';
        fs.writeFileSync(audioFile, await message.reply_message.download());
        ffmpeg.input(file);
        ffmpeg.input(audioFile);
        ffmpeg.output('./lib/temp/videoMixed.mp4');
        ffmpeg.on('end', async () => {
            await message.send(fs.readFileSync('./lib/temp/videoMixed.mp4'), {}, 'video');
        });
        ffmpeg.on('error', async (err) => {
            console.error('FFmpeg error:', err);
            await message.reply("An error occurred while performing the transformation. Please try again.");
        });
        ffmpeg.run();
});

// Make your sticker magical with a circular cut-out!
System({
    pattern: "round",
    fromMe: isPrivate,
    desc: "Give your photo a round, magical cut!",
    type: "converter",
}, async (msg) => {
   if (!(msg.image || msg.reply_message.sticker || msg.reply_message.image)) return await msg.reply("_Reply with a photo or sticker to perform the magic!_");
   if (msg.reply_message.isAnimatedSticker) return await message.reply("_This spell works only with non-animated stickers!_");
   let media = await msg.downloadMediaMessage(msg.image ? msg : msg.quoted ? msg.reply_message : null);
   let sticker = new Sticker(media, {
        pack: stickerPackNameParts[0], 
        author: stickerPackNameParts[1], 
        type: StickerTypes.ROUNDED ,
        categories: ["🤩", "🎉"], 
        id: "https://github.com/Loki-Xer/jarvis-md",
        quality: 75, 
   });
   const buffer = await sticker.toBuffer();
   await msg.reply(buffer, {}, "sticker");
});

// Cast the circle spell on your photo
System({
    pattern: "circle",
    fromMe: isPrivate,
    desc: "Turn your photo into a circular sticker!",
    type: "converter",
}, async (message) => {
   if (!(message.image || message.reply_message.sticker || message.reply_message.image)) return await message.reply("_Reply with a photo or sticker to transform into a circle!_");
   if (message.reply_message.isAnimatedSticker) return await message.reply("_Only non-animated stickers can be made into a circle!_");
   let media = await message.downloadMediaMessage(message.image ? message : message.quoted ? message.reply_message : null);
   let sticker = new Sticker(media, {
        pack: stickerPackNameParts[0], 
        author: stickerPackNameParts[1], 
        type: StickerTypes.CIRCLE ,
        categories: ["🤩", "🎉"],
        id: "https://github.com/Loki-Xer/jarvis-md", 
        quality: 75,
   });
  const buffer = await sticker.toBuffer();
  await message.reply(buffer, {}, "sticker");
});
