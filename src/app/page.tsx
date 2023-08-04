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
    <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div className="pb-8">
        <p className="pb-4">Total groceries:</p>
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <code className="font-mono font-bold"> {title ? title : "n/a"}</code>
        </p>
      </div>
      <div>
        <AddToSpreadsheet total={title} />
      </div>
    </main>
  );
}
