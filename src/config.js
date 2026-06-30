/**
 * =====================================================
 * Discord Delivery Notifier
 * config.js
 * =====================================================
 * Version : 3.0.0
 * Author  : Lucia
 * Development Support : OpenAI ChatGPT "Rinne"
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

    google: {

        projectId:

            process.env.GOOGLE_CLOUD_PROJECT ||

            "discord-delivery-notifier",

        topic:

            process.env.PUBSUB_TOPIC ||

            "gmail-push"

    },

    gmail: {

        userId: "me",

        historyTypes: [

            "messageAdded"

        ]

    },

    notifications: {

        discord: {

            enabled: true,

            webhook:

                process.env.DISCORD_WEBHOOK_URL ||

                ""

        },

        line: {

            enabled:

                process.env.LINE_ENABLED === "true",

            channelAccessToken:

                process.env.LINE_CHANNEL_ACCESS_TOKEN ||

                "",

            userId:

                process.env.LINE_USER_ID ||

                ""

        }

    },

    priority: {

        normal: [

            "discord"

        ],

        critical: [

            "discord",

            "line"

        ]

    },

    embed: {

        colors: {

            amazon: 0xF59E0B,

            rakuten: 0xBF5AF2,

            success: 0x57F287,

            warning: 0xFEE75C,

            error: 0xED4245

        },

        footer:

            "Discord Delivery Notifier"

    }

};