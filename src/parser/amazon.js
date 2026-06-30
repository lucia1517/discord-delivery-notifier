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
 *
 * @param {object} message
 * @returns {boolean}
 */
export function isAmazon(message) {

    return message.from
        .toLowerCase()
        .includes("amazon.co.jp");

}

/**
 * 無視するメールか判定
 *
 * @param {string} subject
 * @returns {boolean}
 */
function isIgnoredMail(subject) {

    return IGNORE_KEYWORDS.some(

        keyword => subject.includes(keyword)

    );

}

/**
 * 配送通知メールか判定
 *
 * @param {string} subject
 * @returns {boolean}
 */
function isDeliveryMail(subject) {

    return DELIVERY_KEYWORDS.some(

        keyword => subject.includes(keyword)

    );

}

/**
 * イベント判定
 *
 * @param {string} subject
 * @returns {string}
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

    if (

        subject.includes("キャンセル")

    ) {

        return "cancelled";

    }

    return "unknown";

}

/**
 * Amazonメール解析
 *
 * @param {object} message
 * @returns {object|null}
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

    return {

        provider: "amazon",

        event,

        subject: message.subject,

        from: message.from,

        date: message.date,

        raw: message

    };

}

