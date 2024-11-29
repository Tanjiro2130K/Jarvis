System({
    pattern: "ts ?(.*)",
    fromMe: isPrivate,
    type: "download",
    alias: ['tg'],
    desc: "Download Sticker From Telegram 🐾"
}, async (message, match, client) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("_Please provide a Telegram sticker URL 🐾_\nExample: https://t.me/addstickers/Vc_me_dance_pack_by_fStikBot\n⚠️ Frequent use may result in a ban_");
    let packid = match.split("/addstickers/")[1];
    let { result } = await getJson(`https://api.telegram.org/${config.TGTOKEN}/getStickerSet?name=${encodeURIComponent(packid)}`);
    if (result.is_animated) return message.reply("_Animated stickers are not supported 💫_");
    message.reply(`*Total stickers:* ${result.stickers.length}\n*Estimated time:* ${result.stickers.length * 1.5} seconds ⏳\n⚠️ Frequent use may result in a ban`.trim());
    for (let sticker of result.stickers) {
        let file_path = await getJson(`https://api.telegram.org/${config.TGTOKEN}/getFile?file_id=${sticker.file_id}`);
        const buff = `https://api.telegram.org/file/${config.TGTOKEN}/${file_path.result.file_path}`;
        const stickerPackNameParts = config.STICKER_PACKNAME.split(";");
        const packname = stickerPackNameParts[0];
        const author = stickerPackNameParts[1];
        await message.send(buff, { packname, author, webp: true }, "sticker");
        await sleep(5500);
    }
    return await message.reply('Done 💫');
});

System({
  pattern: 'apk ?(.*)',
  fromMe: isPrivate,
  type: 'download',
  alias: ['app'],
  desc: 'Download Android App 🍥'
}, async (message, match, m) => {
  let appId = match || m.reply_message.text;
  if (!appId) return await message.reply('*Need an app name 🍥*\nExample: ꜰʀᴇᴇ ꜰɪʀᴇ');
  const { result: appInfo } = await getJson(api + "download/aptoide?id=" + appId);
  await message.reply({ url: appInfo.link }, { mimetype: 'application/vnd.android.package-archive', fileName: appInfo.appname, caption: `*App Name:* ${appInfo.appname}\n*Developer:* ${appInfo.developer}`, quoted: message.data }, "document");
});

System({
    pattern: 'fb ?(.*)',
    fromMe: isPrivate,
    type: 'download',
    alias: ['facebook'],
    desc: 'Download Facebook Video 📹'
}, async (message, text) => {
    let match = (await extractUrlsFromText(text || message.reply_message.text))[0];
    if (!match) return await message.reply("*Need a Facebook public media link 📹*\nExample: .fb\n*NOTE: ONLY VIDEO LINK*");       
    const { result } = await getJson(api + "download/facebook?url=" + match);
    await message.sendFromUrl(result.hd, { quoted: message.data });
});

System({
    pattern: 'insta ?(.*)',
    fromMe: isPrivate,
    type: 'download',
    desc: 'Instagram Downloader 📸',
}, async (message, match) => {
    const url = (await extractUrlsFromText(match || message.reply_message.text))[0];
    if (!url) return await message.reply('Please provide an Instagram *url* 📸'); 
    if (!isUrl(url)) return await message.reply("Please provide a valid Instagram *url* 📸");
    if (!url.includes("instagram.com")) return await message.reply("*Provide a valid Instagram url 📸*");
    const data = await instaDL(url);
    if (!data || data.length === 0) return await message.reply("*No content found at the provided URL 📸*");
    for (const imageUrl of data) {
        if (imageUrl) await message.sendFromUrl(imageUrl.url, { quoted: message.data });
    }
});

System({
  pattern: "story",
  fromMe: isPrivate,
  type: "download",
  desc: "Download Instagram Story 🎥",
}, async (message, match) => {
  match = match || message.reply_message.text;
  if (!isUrl(match)) {
    const { media: result } = await getJson(IronMan("ironman/ig/story?user=" + match));
    if (!result) return await message.reply("*Example: .story username/link 🎥*");
    if(result.length === 1) return await message.sendFromUrl(result[0], { caption: "*done ♥️*", quoted: message });
    const options = result.map((u, index) => ({ displayText:`${index + 1}/${result.length}`, id: `sendurl ${u}` }));
    if(message.isGroup) return await message.send("\n*Story Downloader 🎥*\n", { values: options, withPrefix: true, participates: [message.sender] }, "poll");
    for (const media of result) {
      await message.sendFromUrl(media, { quoted: message.data });
    }
  }
  const url = (await extractUrlsFromText(match))[0];
  if (!url.includes("instagram.com")) return message.reply("_Provide a valid Instagram story URL 🎥_");
  const result = await instaDL(url);
  if (!result || result.length === 0) return await message.reply("*Example: .story username/link 🎥*");
  if(result.length === 1) return await message.sendFromUrl(result[0].url, { caption: "*done ♥️*", quoted: message });
  const options = result.map((u, index) => ({ displayText:`${index + 1}/${result.length}`, id: `sendurl ${u.url}` }));
  if(message.isGroup) return await message.send("\n*Story Downloader 🎥*\n", { values: options, withPrefix: true, participates: [message.sender] }, "poll");
  for (const media of result) {
    await message.sendFromUrl(media.url, { quoted: message.data });
  }
});
