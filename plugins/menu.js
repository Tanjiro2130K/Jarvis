const plugins = require("../lib/system");
const { System, isPrivate, isUrl, config } = require("../lib");
const { BOT_INFO, MEDIA_DATA, MENU_FONT } = require("../config");
const fancy = require('./client/fancy');

async function readMore() {
    const readmore = String.fromCharCode(8206).repeat(4001);
    return readmore;
};

System({
    pattern: 'menu ?(.*)',
    fromMe: isPrivate,
    desc: 'Summons the sacred scroll of commands!',
    type: 'info',
    dontAddCommandList: true,
}, async (message, match) => {
    let menu = `🌸 *Konnichiwa, ${message.pushName.replace(/[\r\n]+/gm, "")}-senpai!* 🌸\n\n🍂 Welcome to *${BOT_INFO.split(';')[0]}*, your kawai bot companion! \n\n🌟 *Command List:* 🌟\n\n`;

    let cmnd = [], category = [];
    for (const command of plugins.commands) {
        const cmd = command.pattern?.toString().match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)?.[2];
        if (!command.dontAddCommandList && cmd) {
            const type = (command.type || "misc").toUpperCase();
            cmnd.push({ cmd, type });
            if (!category.includes(type)) category.push(type);
        }
    }

    const [typFont, ptrnFont] = MENU_FONT.split(';').map(font => isNaN(font) || parseInt(font) > 35 ? null : font);
    cmnd.sort();
    for (const cmmd of category.sort()) {
        let typ;
        if (typFont && typFont !== '0') {
            typ = await fancy.apply(fancy[parseInt(typFont) - 1], cmmd);
        } else {
            typ = cmmd.toUpperCase();
        }

        menu += `\n🍥 *Category:* 「 ${typ} 」\n${cmnd.filter(({ type }) => type === cmmd)
            .map(({ cmd }) => `• ${cmd}`)
            .join('\n')}\n`;
    }
    menu += `\n✨ *Usage Notes:* ✨\n• Use *${this.client.config.prefix}help <command>* to see more details about a command.\n• Examples: *${this.client.config.prefix}help profile*\n\n💖 Made with love by ${BOT_INFO.split(';')[1]} 💖`;

    const url = BOT_INFO.split(';')[2];
    if (isUrl(url)) await message.sendFromUrl(url, { caption: menu });
    else await message.send(menu);
});

System({
    pattern: "list",
    fromMe: isPrivate,
    desc: "Reveals all hidden techniques!",
    type: "info"
}, async (message, match) => {
    if (match === "cmd") return;
    let menu = "✨ *Summon List* ✨\n\n";
    let cmnd = plugins.commands.filter(command => !command.dontAddCommandList && command.pattern);
    cmnd = cmnd.map(command => ({
        cmd: command.pattern.toString().match(/(\W*)([A-Za-züşiğ öç1234567890]*)/)[2],
        desc: command.desc || false
    }));
    cmnd.sort((a, b) => a.cmd.localeCompare(b.cmd));
    cmnd.forEach(({ cmd, desc }, num) => {
        menu += `• *${(num + 1)}. ${cmd.trim()}*\n${desc ? `‣ *Description:* ${desc}\n` : ''}\n`;
    });
    if (MEDIA_DATA) {
        const [title, body, thumbnail] = MEDIA_DATA.split(";");
        await message.client.sendMessage(message.jid, {
            text: menu,
            contextInfo: {
                externalAdReply: {
                    title,
                    body,
                    thumbnailUrl: thumbnail,
                    renderLargerThumbnail: true,
                    mediaType: 1,
                    mediaUrl: '',
                    sourceUrl: "https://github.com/rutgerfarry/markhub_notes/blob/master/Japanese%20Culture%20Notes.md",
                    showAdAttribution: true
                }
            }
        });
    } else {
        await message.send(menu);
    }
});
