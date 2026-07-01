/**
 * =====================================================
 * Discord Delivery Notifier
 * index.js
 * =====================================================
 */

"use strict";

import express from "express";
import { CONFIG } from "./config.js";
import * as logger from "./utils/logger.js";
import { sendDiscordNotification } from "./notifications/discord.js";

import {

    listMessages,
    
    getMessage,

    getHeader,

    getBody,

    getGmailClient

} from "./gmail.js";

import {

    parseAmazon

} from "./parser/amazon.js";


const app = express();

app.get("/", (req, res) => {

    res.json({

        name: CONFIG.app.name,

        version: CONFIG.app.version,

        status: "running"

    });

});

app.listen(

    CONFIG.server.port,

    "0.0.0.0",

    () => {

        logger.info(
            `Server started on port ${CONFIG.server.port}.`
        );

    }

);



app.get("/test", async (req, res) => {

    const notification = {

        title: "🚚 テスト通知",

        message: "Discord Delivery Notifier が正常に動作しています。"

    };
    console.log("① sendDiscordNotification 開始");
    
    await sendDiscordNotification(notification);

    res.json({

        success: true,

        notification

    });

});


app.get("/gmail", async (req, res) => {

    try {

        await getGmailClient();

        res.json({

            success: true,

            message: "Gmail client initialized."

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});

app.get("/gmail/messages", async (req, res) => {

    try {

        const messages = await listMessages(50);

        const result = [];

        for (const mail of messages) {

            const gmailMessage = await getMessage(

                mail.id

            );

            result.push({

                id: gmailMessage.id,

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

                )

            });

        }

        res.json({

            success: true,

            count: result.length,

            messages: result

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});

app.get("/gmail/message/:id", async (req, res) => {

    try {

        const message = await getMessage(

            req.params.id

        );

       res.json({

            id: message.id,

            threadId: message.threadId,

            subject: getHeader(message, "Subject"),

            from: getHeader(message, "From"),

            date: getHeader(message, "Date"),

            body: getBody(message)

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});

app.get("/parser/amazon/latest", async (req, res) => {

    try {

        const messages = await listMessages(20);

        for (const mail of messages) {

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

                    name: "📦 商品",

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

                }

            );

            fields.push({

                name: "🔗 注文履歴",

                value: "[Amazonの注文履歴を開く](https://www.amazon.co.jp/gp/css/order-history)",

                inline: false

            });

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

            return res.json(

                parsed

            );

        }

        res.status(404).json({

            success: false,

            error: "Amazonメールが見つかりません。"

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});

app.get("/parser/amazon/:id", async (req, res) => {

    try {

        const gmailMessage = await getMessage(

            req.params.id

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

        res.json(

            parsed

        );

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});

