/**
 * =====================================================
 * Discord Delivery Notifier
 * config.js
 * =====================================================
 */

"use strict";

import "dotenv/config";

export const CONFIG = {

    app: {

        name: "Discord Delivery Notifier",

        version: "3.0.0"

    },

    server: {

        port: Number(process.env.PORT) || 8080

    },

    gmail: {

        userId: "me",

        topicName: process.env.GMAIL_TOPIC_NAME ?? "",

        historyTypes: [

            "messageAdded"

        ]

    },

    discord: {

        webhookUrl: process.env.DISCORD_WEBHOOK_URL ?? ""

    },

    line: {

        channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN ?? "",

        userId: process.env.LINE_USER_ID ?? ""

    }

};