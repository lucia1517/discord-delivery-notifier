"use strict";

import {

    listMessages,

    getMessage,

    getHeader,

    getBody

} from "./gmail.js";

import {

    parseAmazon

} from "./parser/amazon.js";

import {

    sendDiscordNotification

} from "./notifications/discord.js";

import {

    sendLineNotification

} from "./notifications/line.js";

import {

    getLastMessageId,

    saveLastMessageId

} from "./cache/latest.js";

export async function checkAmazonLatest() {

    const messages = await listMessages(5);

    if (messages.length === 0) {

        return null;

    }

    const lastMessageId = await getLastMessageId();

    const newMessages = [];

    for (const mail of messages) {

        if (mail.id === lastMessageId) {

            break;

        }

        newMessages.push(mail);

    }

    if (newMessages.length === 0) {

        return null;

    }

    newMessages.reverse();

    for (const mail of newMessages) {

        const gmailMessage = await getMessage(

            mail.id

        );

        const message = {

            id: gmailMessage.id,

            threadId: gmailMessage.threadId,

            subject: getHeader(

                gmailMessage,

                "Subject"

            ),

            from: getHeader(

                gmailMessage,

                "From"

            ),

            date: getHeader(

                gmailMessage,

                "Date"

            ),

            body: getBody(

                gmailMessage

            )

        };

        const parsed = parseAmazon(

            message

        );

        if (!parsed) {

            continue;

        }

        let title = "📦 Amazon通知";

        let color = 0xff9900;

        switch (parsed.event) {

            case "shipped":

                title = "📦 Amazon 発送通知";
                color = 0xffa500;
                break;

            case "delivered":

                title = "📬 Amazon 配達完了";
                color = 0x2ecc71;
                break;

            case "order_updated":

                title = "🛒 Amazon 注文更新";
                color = 0x3498db;
                break;

            case "cancelled":

                title = "❌ Amazon キャンセル";
                color = 0xe74c3c;
                break;

        }

        const fields = [];

        if (parsed.hasItems) {

            fields.push({

                name: "🛍️ 商品",

                value: parsed.items

                    .map(

                        item => `• ${item.name}`

                    )

                    .join("\n"),

                inline: false

            });

        }

        fields.push(

            {

                name: "📋 注文番号",

                value: parsed.orderId ?? "不明",

                inline: true

            },

            {

                name: "📅 配送予定",

                value: parsed.estimatedDate ?? "未定",

                inline: true

            },

            {

                name: "📝 件名",

                value: parsed.subject,

                inline: false

            },

            {

                name: "🔗 Amazon",

                value: "[注文履歴を開く](https://www.amazon.co.jp/gp/css/order-history)",

                inline: false

            }

        );

        const embed = {

            title,

            color,

            fields,

            footer: {

                text: "Discord Delivery Notifier"

            },

            timestamp: new Date().toISOString()

        };

        await sendDiscordNotification({

            embeds: [

                embed

            ]

        });

        await sendLineNotification({

message: `${title}

${parsed.subject}

配送予定：${parsed.estimatedDate ?? "未定"}

注文番号：${parsed.orderId ?? "不明"}

https://www.amazon.co.jp/gp/css/order-history`

        });

    }

   await saveLastMessageId(

        newMessages[

        newMessages.length - 1

        ].id

    );

    return {

        success: true,

        count: newMessages.length

    };

}