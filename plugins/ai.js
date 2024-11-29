/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2023 Loki - Xer.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Jarvis - Loki-Xer 


------------------------------------------------------------------------------------------------------------------------------------------------------*/


const {
    System,
    IronMan,
    postJson,
    isPrivate,
    interactWithAi,
    makeUrl,
    gemini
} = require("../lib/");
const config = require("../config.js");

async function readMore() {
  const readmore = String.fromCharCode(8206).repeat(4001);
  return readmore;
};

System({
    pattern: "thinkany", 
    fromMe: isPrivate,
    desc: "✨ Unleash your thoughts with AI ✨", 
    type: "ai",
}, async (message, match, m) => {
    match = match || m.reply_message.text;
    if(match && m.quoted) match = match + m.reply_message.text;
    if(!match) return m.reply("_*Oh no, Senpai! I need a query! 🌀*_\n\n_*Example:* .thinkany who is the strongest ninja?_");
    const { result } = await interactWithAi("thinkany", match);
    await m.send(result + "\n\n💭 *From the depths of AI!* 🌸");
});

System({
    pattern: "aoyo", 
    fromMe: isPrivate,
    desc: "🌀 Ask the all-knowing AI", 
    type: "ai",
}, async (message, match, m) => {
    match = match || m.reply_message.text;
    if(match && m.quoted) match = match + m.reply_message.text;
    if(!match) return m.reply("_*Senpai, please give me a question!* 🐉_\n\n_*Example:* .aoyo who is the hero of Konoha?_");
    const { result } = await interactWithAi("aoyo", match);
    await m.send(result + "\n\n🌟 *Your answer is here, Senpai!* 🌸");
});

System({
    pattern: "prodia", 
    fromMe: isPrivate,
    desc: "🎨 Generate beautiful AI art", 
    type: "ai",
}, async (message, match, m) => {
    match = match || m.reply_message.text;
    if(match && m.quoted) match = match + m.reply_message.text;
    if(!match) return m.reply("_*Senpai, please give me a prompt!* 🎴_\n\n_*Example:* .prodia a warrior under cherry blossoms*_");
    await m.reply("*🌸 Please wait, painting your masterpiece...*");
    const img = await interactWithAi("prodia", match);
    await m.sendFromUrl(img, { caption: "✨ *Your Prodia art is ready!* ✨" });
});

System({
    pattern: "dalle", 
    fromMe: isPrivate,
    desc: "🌌 Create AI-generated art with DALLE", 
    type: "ai",
}, async (message, match, m) => {
    match = match || m.reply_message.text;
    if(match && m.quoted) match = match + m.reply_message.text;
    if(!match) return m.reply("_*Senpai, what image do you want? 🖌️*_ \n\n_*Example:* .dalle a samurai gazing at the moon*_");
    await m.reply("*🌙 Generating your vision, please wait...*");
    const img = await interactWithAi("dalle", match);
    await m.sendFromUrl(img, { caption: "🌠 *Here’s your DALLE creation, Senpai!* 🎨" });
});

System({
    pattern: "lepton", 
    fromMe: isPrivate,
    desc: "🧠 Enlighten your mind with AI", 
    type: "ai",
}, async (message, match, m) => {
    match = match || m.reply_message.text;
    if(match && m.quoted) match = match + m.reply_message.text;
    if(!match) return m.reply("_*Senpai, I need a question to answer!* 💭_\n\n_*Example:* .lepton who is the Hokage?_");
    const { result } = await interactWithAi("lepton", match);
    await m.send(result.replace(/[^]*|[^)]*|<[^>]*>/g, '') + "\n\n💡 *Knowledge delivered by Lepton AI!* 🌸");
});

System({
    pattern: "chatgpt", 
    fromMe: isPrivate,
    desc: "🌟 Chat with the smartest AI", 
    type: "ai",
}, async (message, match, m) => {
    match = match || m.reply_message.text;
    if(match && m.quoted) match = match + m.reply_message.text;
    if(!match) return m.reply("_*Senpai, let me know your question! 🌀_\n\n_*Example:* .chatgpt who is the greatest swordsman?*_");
    const response = await interactWithAi("chatgpt", match);
    await m.send(response + "\n\n🌀 *ChatGPT is always here for you, Senpai!* 🌸");
});

System({
    pattern: 'upscale ?(.*)',
    fromMe: isPrivate,
    desc: '✨ Enhance your images with AI ✨',
    type: 'ai',
}, async (message, match) => {
    if (!message.quoted || !message.reply_message.image) return await message.send("🌸 _Please reply to an image, Senpai!_");
    const img = await message.reply_message.downloadAndSave();
    const upscale = await interactWithAi("upscale", img);
    await message.send(upscale, { caption: "✨ _Your upscaled masterpiece is here!_ 🌸" }, "img");
});

System({
    pattern: 'gemini ?(.*)',
    fromMe: isPrivate,
    desc: '🌌 Chat with the celestial Gemini AI',
    type: 'ai',
}, async (message, match, m) => {
    if (match && message.reply_message?.image) {
        try {
            const path = await message.reply_message.downloadAndSaveMedia();
            const res = await gemini(match, path);
            if (!res) {
                return m.reply("🌸 _Sorry, Gemini couldn’t process this!_ 🌌");
            }
            await m.send(res + "\n\n🌟 *Gemini AI has spoken!* 🌀");
        } catch (error) {
            console.error("Error processing image:", error);
            m.reply("💔 *Failed to process the image, Senpai. Please try again!*");
        }
    } else if (match) {
        const res = await gemini(match);
        if (!res) {
            return m.reply("🌸 _Sorry, Gemini couldn’t process this!_ 🌌");
        }
        await m.send(res + "\n\n🌌 *Gemini AI has spoken!* 🌀");
    } else {
        m.reply("_*Senpai, give me a prompt! 🌟*_\n\n_*Example:* .gemini describe this scene*_");
    }
});
