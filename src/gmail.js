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


let gmail = null;


/**
 * Gmail API Client
 *
 * @returns {Promise<import("googleapis").gmail_v1.Gmail>}
 */
export async function getGmailClient() {

    if (gmail) {

        return gmail;

    }

    const auth = new google.auth.GoogleAuth({

        scopes: [

            "https://www.googleapis.com/auth/gmail.readonly"

        ]

    });

    gmail = google.gmail({

        version: "v1",

        auth

    });

    return gmail;

}

/**
 * メール一覧取得
 *
 * @param {number} maxResults
 * @returns {Promise<object[]>}
 */
export async function listMessages(maxResults = 10) {

    const gmail = await getGmailClient();

    const response = await gmail.users.messages.list({

        userId: "me",

        maxResults

    });

    return response.data.messages ?? [];

}