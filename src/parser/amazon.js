/**
 * =====================================================
 * Discord Delivery Notifier
 * amazon.js
 * =====================================================
 * Amazonメール解析
 * =====================================================
 */

"use strict";

/**
 * Amazonメール判定
 *
 * @param {object} message
 * @returns {boolean}
 */
export function isAmazon(message) {

    const from = message.from.toLowerCase();

    return (

        from.includes("amazon.co.jp")

        ||

        from.includes("amazon.co")

    );

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

    const subject = message.subject;

    let type = "unknown";

    if (subject.includes("発送")) {

        type = "shipped";

    }

    else if (

        subject.includes("配達")

        ||

        subject.includes("お届け")

    ) {

        type = "delivered";

    }

    return {

        shop: "amazon",

        type,

        subject,

        from: message.from,

        date: message.date,

        body: message.body

    };

}