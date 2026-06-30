import { getGmail } from "./google.js";

export async function getHistory(startHistoryId) {

    const gmail = await getGmail();

    const response = await gmail.users.history.list({

        userId: "me",

        startHistoryId,

        historyTypes: [

            "messageAdded"

        ]

    });

    return response.data.history || [];

}