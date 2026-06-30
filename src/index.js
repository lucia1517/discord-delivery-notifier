/**
 * =====================================================
 * Discord Delivery Notifier
 * index.js
 * =====================================================
 */

"use strict";

import express from "express";

import { CONFIG } from "./config.js";

import * as logger from "./utils/logger.js";

const app = express();

app.get("/", (req, res) => {

    res.json({

        name: CONFIG.app.name,

        version: CONFIG.app.version,

        status: "running"

    });

});

app.listen(

    CONFIG.server.port,

    "0.0.0.0",

    () => {

        logger.info(
            `Server started on port ${CONFIG.server.port}.`
        );

    }

);