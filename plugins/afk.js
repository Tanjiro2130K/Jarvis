/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2023 Loki - Xer.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Jarvis - Loki-Xer 


------------------------------------------------------------------------------------------------------------------------------------------------------*/

const { System } = require('../lib/');
const { secondsToHms } = require("./client/"); 

let AFK = {
	isAfk: false,
	reason: false,
	lastseen: 0
};

System({
	on: 'all',
	fromMe: false
}, async (message, match) => {
	if (message.isBot) return;
	if (message.fromMe) return;
	if (!AFK.isAfk) return;
	if (!message.mention.isBotNumber && !message.quoted && message.isGroup) return;

	const afkReply = `🌸 *Konnichiwa, Senpai!* 🌸\n\n⚠️ *I’m currently away!* \n${
		AFK.reason !== false ? `🎀 *Reason:* ${AFK.reason}\n` : ''
	}${AFK.lastseen !== 0 ? `⏳ *Last Seen:* ${secondsToHms(Math.round((new Date()).getTime() / 1000) - AFK.lastseen)} ago\n` : ''}\n🌀 *Leave a message and I’ll get back to you!*`;

	if (message.mention.isBotNumber && message.isGroup) {
		await message.send(afkReply, { quoted: message.data });
	} else if (message.isGroup && message.reply_message.sender === message.user.jid) {
		await message.send(afkReply, { quoted: message.data });
	} else if (!message.isGroup) {
		await message.send(afkReply, { quoted: message.data });
	}
});

System({
	on: 'text',
	fromMe: true
}, async (message, match) => {
	if (message.isBot) return;
	if (message.sender !== message.user.jid) return;
	if (!AFK.isAfk) return;

	AFK.lastseen = 0;
	AFK.reason = false;
	AFK.isAfk = false;
	await message.send('🌟 *I’m back now, Senpai!* 🌟\n\n💖 *Thanks for waiting!*');
});

System({
	pattern: 'afk ?(.*)',
	fromMe: true,
	desc: 'Become temporarily unavailable (AFK)',
}, async (message, match) => {
	if (AFK.isAfk) return;
	if (message.isBot) return;

	AFK.lastseen = Math.round((new Date()).getTime() / 1000);
	if (match !== '') AFK.reason = match;
	AFK.isAfk = true;

	await message.send(
		AFK.reason
			? `🌸 *I’m going AFK now, Senpai!* 🌸\n🎀 *Reason:* ${AFK.reason}\n\n💤 *Ping me if you need anything, and I’ll respond once I’m back!*`
			: `🌸 *I’m going AFK now, Senpai!* 🌸\n\n💤 *Ping me if you need anything, and I’ll respond once I’m back!*`
	);
});
