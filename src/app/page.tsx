import { google } from "googleapis";
import { AddToSpreadsheet } from "@/components/AddToSpreadsheet";

export const dynamic = "force-dynamic";
export async function getSheets() {
  try {
    const auth = await google.auth.getClient({
      credentials: {
        type: "service_account",
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDDui0Qbk9RcU8n\noev0efPBLeM37xAxjZgJEQ+zaqXmmV8JFTM/6ZcqgoKUNhyc+QFIdhxghYkwc6UF\nqCIAP/QhrZsBX+2Rb4B3LlZ0BklVGAs1H1+EYA8C0YuivIhLrJ4VskKHQyX1dFDW\nE4x0yfXF11gl7Hh3vN+in1KR6B1lFH9+0lhfq35AVh6Ke08DrmGNOUT1YhPjxEGI\ndJFsZUrXDm6Ic8DKxFKXLkyW3NPpQkFjwN97GoJcRmFollVLCBn6YF5A3DMOek0N\nSlLMKW91H1g9B7hgfEQwkGyo6kK3SKDLnsKysDIQL5IY91R3jbIt3bzEhdCI5kwz\nUd2MjQ5bAgMBAAECggEAVOE3S8nawgH2hsR0tCfy6pLA1+/nwOWbykrI2VDls1RN\n331/JTdi4/+HK0kwLW7a/JakBcPDU+zC4uogHKWfdL952iXEu+5z8rt4qIZVZP6x\nVY9Od/TEbb97484I+XBZeiU9LrWTD5gqujvuDHPNDsgtpPyg3aReA4M+ZqIXpU50\nXDj0xKNIfwhbpLFy1VkfLRZSiQK8lQ1XKitf951NAKZmaL506Ul+t0Wfn4wtsYyx\numpIWMLaifCsGU+wUQeXcfv6iWCjM2/4aqgqcNiWH3JmG3DNjuJfKXFWb7nufPhA\nf1GYVaTBRWrvgNxCupnTjUHqWDWFTDDai9nzBQFwWQKBgQD2Ac9E3qqiXs6Skc4b\nsracxInyGjIXTQxs3MN1lNv7q0Tz5z3n4kaDR4Q26wVxmNm+q98sY1jxV9+A53QL\nRBljZmdClW5rJ4R4+wBrU1pOOe1PjZFB8vKSdwfyOwCszGXGvwhRKVs7x8Fwum2M\nR7UcVd5mxaI6gIWolSJ9U2IlhQKBgQDLrYOfCFbliLoCX58gSRGY5dr8bU2txpNC\nNuDyKii3k5gOBFRJV1VJDsD7gxyPEw4gq+bTswPplswxLx+N5DyYmun63ISJlEL1\n1anZsw9TdNH7lw2t47BaiyY+jnGmW2HX3T5qxQzgW3hT1Knn+bA7DqHZ+Kg2rHkv\nzZh+YW06XwKBgQCIlxCiSI+tf75qmxI5Rs0l1epRxkGxtlIDz7+m9XP/FGVAl1BE\nA9rq4TaD15I6NIgR2hQb7T1hI00xoVFJQBJool8LFTUtwc9H7PWaobkuXfNpjEzu\ntRoCQJzk3eXOC98mrsLLbY7+bjb1hE126gmhJfxKS8l7egi8RbHUrAt+kQKBgCTV\ngFQmYfCoxVrgiBqCnFgWWYAFFGM04jS7T/r7fNmWK419YvDQhm/r5yKVF3kYbRmj\nfN8UJMT9rHfImeBDQmImweHIN3/Z/DIRLeJc64ygN8lUC/lCkAYP3B68C/mV1SAA\ntuUANc/tOtmOQBvfn+tOPh75RRJ+JnxqpgVVATfpAoGBAMMDbDDZNzpAV+wEaGg5\ndWUE9Q2dV9HjalbQMT89K50/RFsHgMlNgbA+/alveEEjPMxRp1qJkLyiZ1kiiFym\nduePEIo6TvTZ3nhoNifw6g8MU3tV5ZlkTfeTydYgGh2UlxTVL2G2f13jtBjepEJ5\nH2IdJzDl8iRuns7485qgL9Hc\n-----END PRIVATE KEY-----\n",
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

export default async function Page() {
  const {
    sheets: { title },
  } = await getExpenseTotal();

  return (
    <main className="mx-auto max-w-7xl py-6 px-6 h-screen relative">
      <div className="mb-16 p-5 font-antonio text-center text-4xl text-main-pink">
        BUDGETLINK
      </div>
      <div>
        <AddToSpreadsheet total={title} />
      </div>
    </main>
  );
}
