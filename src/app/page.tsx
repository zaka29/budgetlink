import {google} from "googleapis";
import { revalidatePath } from "next/cache";

async function getSheets () {
  try {
    const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
    return google.sheets({version: 'v4', auth})
  } catch (e) {
    throw new Error(`Something went wrong ${e}`)
  }
}
async function getData() {
  // Auth
  const sheets = await getSheets();
  const range = `15jul-15Aug'23!M4`; 'https://docs.google.com/spreadsheets/d/130GzlQ4vn3ZCAmgPVn0dLCbgBqYaLU5lU6DCDXPdO4c/edit#gid=1859685028&range=L4'
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });
  // @ts-ignore
  const [title, content] = response?.data?.values[0];
  console.log(title, content)

  return {
    sheets: {
      title,
      content
    }
  }
}

async function updateCell(value: string) {
  const sheets = await getSheets();
  const range = `15jul-15Aug'23!M4`
  try {
    return await sheets.spreadsheets.values.update({
      valueInputOption: 'RAW',
      spreadsheetId: process.env.SHEET_ID,
      range,
      requestBody: {
        values: [[value]],
      },
    })
  } catch (e) {
    throw new Error(`could not update sheets: ${e}`)
  }
}

export default async function Page() {

  const { sheets: { title } } = await getData();
  async function addToTotal(data: FormData) {
    'use server'

    const sheets = await getSheets();
    const range = `15jul-15Aug'23!M4`
    const expense = data.get('addtototal');
    const result = Number(title)+Number(expense);
    try {
      await sheets.spreadsheets.values.update({
        valueInputOption: 'RAW',
        spreadsheetId: process.env.SHEET_ID,
        range,
        requestBody: {
          values: [[result]],
        },
      })
      revalidatePath('/');
    } catch (e) {
      throw new Error(`could not update sheets: ${e}`)
    }
  }

  return (
    <main className="flex min-h-screen mx-auto w-1/4 flex-col items-start justify-center">
      <form action={addToTotal}>
        <div className="pb-8">
          <p className="pb-4">Total groceries:</p>
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            <code className="font-mono font-bold"> {title ? title : 'n/a'}</code>
          </p>
        </div>
        <div>
          <label htmlFor="addtototal" className="pb-4">
            Add total
          </label>
          <div className="mt-2 pb-4">
            <input type="number" name="addtototal" className="rounded border border-gray-800 p-3 bg-gray-500 text-sm text-gray-900" />
          </div>
          <div className="mt-2">
            <button
                type="submit"
                className="rounded border border-blue-700 p-2 bg-blue-950 hover:bg-blue-900 text-sm text-blue-500"
            >
              Add expense
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}
