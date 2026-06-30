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

    await sendDiscordNotification(notification);

    res.json({

        success: true,

        notification

    });

});

app.get("/gmail/messages", async (req, res) => {

    try {

        const messages = await listMessages(10);

        res.json({

            success: true,

            count: messages.length,

            messages

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

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

        res.json(parsed);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});