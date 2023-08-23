import { google } from "googleapis";

export async function getSheets() {
  try {
    const key =
      process.env.KEY && process.env.KEY.split(String.raw`\n`).join("\n");
    const auth = await google.auth.getClient({
      credentials: {
        type: "service_account",
        private_key: key,
        client_email:
          "firebase-adminsdk-2ac9r@budget-link-393406.iam.gserviceaccount.com",
        client_id: "115205288808408466047",
        universe_domain: "googleapis.com",
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return google.sheets({ version: "v4", auth });
  } catch (e) {
    throw new Error(`Something went wrong ${e}`);
  }
}

export async function getExpenseTotal() {
  const base = process.env.API_BASE;
  const path = "/api/sheets";
  try {
    const response = await fetch(`${base}${path}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (result.message.includes("Error")) {
      throw new Error(result.message);
    }
    return result;
  } catch (e) {
    throw new Error(`something did not work: ${e}`);
  }
}
