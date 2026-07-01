"use strict";

import { messagingApi } from "@line/bot-sdk";
import { CONFIG } from "../config.js";

const client = new messagingApi.MessagingApiClient({

    channelAccessToken: CONFIG.line.channelAccessToken

});

export async function sendLineNotification(notification) {

    if (

        !CONFIG.line.channelAccessToken ||

        !CONFIG.line.userId

    ) {

        throw new Error(

            "LINE environment variables are not configured."

        );

    }

    const color = (() => {

        switch (notification.event) {

            case "shipped":

                return "#F59E0B";

            case "delivered":

                return "#22C55E";

            case "order_updated":

                return "#3B82F6";

            case "cancelled":

                return "#EF4444";

            default:

                return "#6B7280";

        }

    })();

    const flex = {

        type: "flex",

        altText: notification.title,

        contents: {

            type: "bubble",

            hero: {

                type: "box",

                layout: "vertical",

                backgroundColor: color,

                paddingAll: "16px",

                contents: [

                    {

                        type: "text",

                        text: notification.title,

                        color: "#FFFFFF",

                        weight: "bold",

                        size: "lg"

                    }

                ]

            },

            body: {

                type: "box",

                layout: "vertical",

                spacing: "md",

                contents: [

                    {

                        type: "text",

                        text: notification.subject,

                        wrap: true,

                        weight: "bold",

                        size: "md"

                    },

                    {

                        type: "separator"

                    },

                    {

                        type: "box",

                        layout: "baseline",

                        contents: [

                            {

                                type: "text",

                                text: "📅",

                                flex: 0

                            },

                            {

                                type: "text",

                                text: notification.estimatedDate ?? "未定",

                                wrap: true

                            }

                        ]

                    },

                    {

                        type: "box",

                        layout: "baseline",

                        contents: [

                            {

                                type: "text",

                                text: "📋",

                                flex: 0

                            },

                            {

                                type: "text",

                                text: notification.orderId ?? "不明",

                                wrap: true

                            }

                        ]

                    }

                ]

            },

            footer: {

                type: "box",

                layout: "vertical",

                contents: [

                    {

                        type: "button",

                        style: "primary",

                        color: color,

                        action: {

                            type: "uri",

                            label: "🛒 注文履歴を開く",

                            uri: "https://www.amazon.co.jp/gp/css/order-history"

                        }

                    }

                ]

            }

        }

    };

    await client.pushMessage({

        to: CONFIG.line.userId,

        messages: [

            flex

        ]

    });

}