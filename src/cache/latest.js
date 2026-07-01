"use strict";

import fs from "node:fs/promises";
import path from "node:path";

const FILE = path.join(

    process.cwd(),

    "src",

    "cache",

    "latest.json"

);

export async function getLastMessageId() {

    try {

        const data = JSON.parse(

            await fs.readFile(

                FILE,

                "utf8"

            )

        );

        return data.lastMessageId ?? "";

    }

    catch {

        return "";

    }

}

export async function saveLastMessageId(id) {

    console.log("保存先:", FILE);

    console.log("保存するID:", id);

    await fs.writeFile(

        FILE,

        JSON.stringify(

            {

                lastMessageId: id

            },

            null,

            4

        ),

        "utf8"

    );

    console.log("保存完了");

}