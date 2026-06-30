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




import { sendDiscordNotification } from "./notifications/discord.js";

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

import { 
    
    getGmailClient,
    listMessages

 } from "./gmail.js";

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

        const messages = await listMessages();

        res.json(messages);

    } catch (error) {

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});