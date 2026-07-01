/**
 * =====================================================
 * Discord Delivery Notifier
 * amazon.js
 * =====================================================
 * Amazon Mail Parser
 * =====================================================
 */

"use strict";

import {

    DELIVERY_KEYWORDS,

    IGNORE_KEYWORDS

} from "./amazon-rules.js";

import {

    saveOrder,

    getOrder,

    deleteOrder,

    cleanupOrders

} from "../cache/orders.js";

/**
 * Amazonメール判定
 */
export function isAmazon(message) {

    return message.from
        .toLowerCase()
        .includes("amazon.co.jp");

}

/**
 * 無視メール判定
 */
function isIgnoredMail(subject) {

    return IGNORE_KEYWORDS.some(

        keyword => subject.includes(keyword)

    );

}

/**
 * 配送通知判定
 */
function isDeliveryMail(subject) {

    return DELIVERY_KEYWORDS.some(

        keyword => subject.includes(keyword)

    );

}

/**
 * イベント判定
 */
function getEvent(subject) {

    if (subject.includes("発送")) {

        return "shipped";

    }

    if (

        subject.includes("配達")

        ||

        subject.includes("お届け")

    ) {

        return "delivered";

    }

    if (

        subject.includes("注文")

        ||

        subject.includes("更新")

    ) {

        return "order_updated";

    }

    if (subject.includes("キャンセル")) {

        return "cancelled";

    }

    return "unknown";

}

/**
 * 注文番号取得
 */
function getOrderId(body) {

    const match = body.match(

        /\d{3}-\d{7}-\d{7}/

    );

    return match?.[0] ?? null;

}

/**
 * 配送予定日取得
 */
function getEstimatedDate(body) {

    const match = body.match(

        /\d{4}年\d{1,2}月\d{1,2}日/

    );

    return match?.[0] ?? null;

}

/**
 * 商品一覧取得
 *
 * @param {string} body
 * @returns {Array}
 */
function getItems(body) {

    const items = [];

    const lines = body.split("\n");

    for (const line of lines) {

        const text = line.trim();

        if (

            text.startsWith("* ")

        ) {

            items.push({

                name: text.substring(2)

            });

        }

    }

    return items;

}

/**
 * 追跡URL取得
 **/

function getTrackingUrl(body) {

    const match = body.match(

        /https:\/\/www\.amazon\.co\.jp\/progress-tracker\/\S+/

    );

    return match?.[0] ?? null;

}

/**
 * Amazonメール解析
 */
export function parseAmazon(message) {

    if (!isAmazon(message)) {

        return null;

    }

    cleanupOrders();

    if (isIgnoredMail(message.subject)) {

        return null;

    }

    if (!isDeliveryMail(message.subject)) {

        return null;

    }

    const event = getEvent(

        message.subject

    );

    const orderId = getOrderId(

        message.body

    );

    const estimatedDate = getEstimatedDate(

        message.body

    );

    const items = getItems(

        message.body

    );

    const trackingUrl = getTrackingUrl(

        message.body

    );

    if (

        event === "shipped"

        &&

        orderId

    ) {

        saveOrder({

            provider: "amazon",

            orderId,

            items,

            estimatedDate

        });

    }

    const cache = orderId

        ? getOrder(orderId)

        : null;

    if (

        event === "delivered"

        &&

        orderId

    ) {

        deleteOrder(orderId);

    }

    return {

        provider: "amazon",

        event,

        orderId,

        estimatedDate,

        items: cache?.items ?? items,

        hasItems: (cache?.items ?? items).length > 0,

        trackingUrl,

        subject: message.subject,

        from: message.from,

        date: message.date,

        raw: message

    };

}