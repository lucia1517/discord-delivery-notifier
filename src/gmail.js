/**
 * =====================================================
 * Discord Delivery Notifier
 * gmail.js
 * =====================================================
 * Version : 3.0.0
 * Author  : Lucia
 * Development Support : OpenAI ChatGPT "Rinne"
 * =====================================================
 */

"use strict";

import { google } from "googleapis";

import { authorize } from "./auth.js";

let gmail = null;

export async function getGmailClient() {

    if (gmail) {

        return gmail;

    }

    const auth = await authorize();

    gmail = google.gmail({

        version: "v1",

        auth

    });

    return gmail;

}

export async function listMessages(maxResults = 10) {

    const gmail = await getGmailClient();

    const response = await gmail.users.messages.list({

        userId: "me",

        maxResults

    });

    return response.data.messages ?? [];

}

/**
 * メール取得
 *
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function getMessage(id) {

    const gmail = await getGmailClient();

    const response = await gmail.users.messages.get({

        userId: "me",

        id,

        format: "full"

    });

    return response.data;

}

/**
 * ヘッダー取得
 *
 * @param {object} message
 * @param {string} name
 * @returns {string}
 */
export function getHeader(message, name) {

    const headers = message.payload?.headers ?? [];

    const header = headers.find(

        (header) => header.name === name

    );

    return header?.value ?? "";

}

/**
 * 本文取得
 *
 * @param {object} message
 * @returns {string}
 */
export function getBody(message) {

    function decode(data) {

        if (!data) {

            return "";

        }

        return Buffer

            .from(

                data.replace(/-/g, "+")

                    .replace(/_/g, "/"),

                "base64"

            )

            .toString("utf8");

    }

    if (message.payload?.body?.data) {

        return decode(

             message.payload.body.data

        )

        .replace(/\\r\\n/g, "\n")
        .replace(/\\n/g, "\n")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .trim();


    }

    for (const part of message.payload?.parts ?? []) {

        if (

            part.mimeType === "text/plain"

            &&

            part.body?.data

        ) {

            return decode(

                part.body.data

            )

            .replace(/\\r\\n/g, "\n")
            .replace(/\\n/g, "\n")
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .trim();

        }

    }

    return "";

}