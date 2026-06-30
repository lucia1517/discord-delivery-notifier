/**
 * =====================================================
 * Discord Delivery Notifier
 * discord.js
 * =====================================================
 */

"use strict";

import { CONFIG } from "../config.js";


/**
 * Discord通知
 *
 * @param {string} title
 * @param {string} message
 */
export async function sendDiscordNotification(title, message) {

    if (!CONFIG.discord.webhookUrl) {

        throw new Error("Discord Webhook URL is not configured.");

    }

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