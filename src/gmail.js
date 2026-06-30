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