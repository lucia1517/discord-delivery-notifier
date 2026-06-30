/**
 * =====================================================
 * Discord Delivery Notifier
 * logger.js
 * =====================================================
 */

"use strict";

function write(level, message, data = null) {

    const log = {

        timestamp: new Date().toISOString(),

        level,

        message

    };

    if (data !== null) {

        log.data = data;

    }

    console.log(JSON.stringify(log));

}

export function info(message, data) {

    write("INFO", message, data);

}

export function warn(message, data) {

    write("WARN", message, data);

}

export function error(message, data) {

    write("ERROR", message, data);

}