/**
 * =====================================================
 * Discord Delivery Notifier
 * discord.js
 * =====================================================
 * Version : 3.0.0
 * Author  : Lucia
 * Development Support : OpenAI ChatGPT "Rinne"
 * =====================================================
 */

"use strict";

import { CONFIG } from "../config.js";


/**
 * Discord通知
 *
 * @param {Object} notification
 */
export async function sendDiscordNotification(notification) {

    if (!CONFIG.discord.webhookUrl) {

        throw new Error("Discord Webhook URL is not configured.");

    }

    const {

        title,

        message

    } = notification;

    const response = await fetch(

        CONFIG.discord.webhookUrl,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                embeds: [

                    {

                        title,

                        description: message,

                        color: 0x5865F2

                    }

                ]

            })

        }

    );

    if (!response.ok) {

        throw new Error(

            `Discord API Error: ${response.status}`

        );

    }

}