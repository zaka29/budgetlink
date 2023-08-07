import { google } from "googleapis";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { AddToSpreadsheet } from "@/components/AddToSpreadsheet";

export async function getSheets() {
  try {
    const auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return google.sheets({ version: "v4", auth });
  } catch (e) {
    throw new Error(`Something went wrong ${e}`);
  }
}

export async function getTotalExpenseCellData() {
  // Auth
  const sheets = await getSheets();
  const range = `15jul-15Aug'23!M4`;
  // ("https://docs.google.com/spreadsheets/d/130GzlQ4vn3ZCAmgPVn0dLCbgBqYaLU5lU6DCDXPdO4c/edit#gid=1859685028&range=L4");
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });
  // @ts-ignore
  const [title, content] = response?.data?.values[0];
  console.log(title, content);

  return {
    sheets: {
      title,
      content,
    },
  };
}

export default async function Page() {
  const {
    sheets: { title },
  } = await getTotalExpenseCellData();

  return (
    <main className="mx-auto max-w-7xl py-6 px-6 h-screen relative">
      <div className="mb-16 p-5 bg-cyan-950 border rounded border-cyan-700 font-bold">
        BUDGETLINK
      </div>
      <div>
        <AddToSpreadsheet total={title} />
      </div>
    </main>
  );
}
