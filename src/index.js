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

import {

    getLastMessageId,

    saveLastMessageId

} from "./cache/latest.js";

import {

    checkAmazonLatest

} from "./amazon-checker.js";


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

checkAmazonLatest().catch(

    error => {

        console.error(

            error

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

        const messages = await listMessages(5);

        const lastMessageId = await getLastMessageId();

        const result = [];


        for (const mail of messages) {

            if (

                messages[0].id

            ) {

                continue;

            }

            if (

                  messages[0].id

            ) {

                return res.json({

                    success: true,

                    message: "新しいメールはありません。"

                });

            }

            const gmailMessage = await getMessage(

                messages[0].id

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

        const result = await checkAmazonLatest();

        res.json(

            result ?? {

                success: true,

                message: "新しいAmazonメールはありません。"

            }

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

/**
 * =====================================================
 * 1分ごとにAmazonメールチェック
 * =====================================================
 */

setInterval(

    async () => {

        try {

            await checkAmazonLatest();

        }

        catch (error) {

            console.error(

                "Scheduler Error:",

                error.message

            );

        }

    },

    60 * 1000

);