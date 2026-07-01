"use strict";

import { messagingApi } from "@line/bot-sdk";
import { CONFIG } from "../config.js";

const client = new messagingApi.MessagingApiClient({

    channelAccessToken: CONFIG.line.channelAccessToken

});

console.log(
    process.env.LINE_CHANNEL_ACCESS_TOKEN?.slice(0, 20)
);

export async function sendLineNotification(notification) {

    console.log("LINE送信開始");

    if (

        !process.env.LINE_CHANNEL_ACCESS_TOKEN ||

        !process.env.LINE_USER_ID

    ) {

        throw new Error(

            "LINE environment variables are not configured."

        );

    }

    console.log("LINE API呼び出し");

    const response = await client.pushMessage({

        to: process.env.LINE_USER_ID,

        messages: [

            {

                type: "text",

                text: notification.message

            }

        ]

    });

    console.log("LINE送信成功");

    console.log(response);

}