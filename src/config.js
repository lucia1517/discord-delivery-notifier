/**
 * =====================================================
 * Discord Delivery Notifier
 * config.js
 * =====================================================
 */

"use strict";

import "dotenv/config";

export const CONFIG = {

    app: {

        name: "Discord Delivery Notifier",

        version: "3.0.0"

    },

    server: {

        port: Number(process.env.PORT) || 8080

    }

};