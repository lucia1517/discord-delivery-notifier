/**
 * =====================================================
 * Discord Delivery Notifier
 * discord.js
 * =====================================================
 */

"use strict";

export async function sendDiscordNotification(options) {

    const webhook = process.env.DISCORD_WEBHOOK_URL;

    if (!webhook) {

        throw new Error(

            "DISCORD_WEBHOOK_URL is not set."

        );

    }

    const payload = {};

    if (options.message) {

        payload.content = options.message;

    }

    if (options.embeds) {

        payload.embeds = options.embeds;

    }

    console.log("========== Payload ==========");

    console.log(

        JSON.stringify(

            payload,

            null,

            4

        )

    );

    const response = await fetch(

        webhook,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(

                payload

            )

        }

    );

    const body = await response.text();

    console.log(

        "Discord Status:",

        response.status

    );

    console.log(

        "Discord Response:",

        body

    );

    if (!response.ok) {

        throw new Error(

            `Discord API Error ${response.status}`

        );

    }

}