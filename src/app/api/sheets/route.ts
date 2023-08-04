import { NextResponse } from "next/server";
import { getSheets } from "@/app/page";

export async function POST(request: Request) {
  const range = `15jul-15Aug'23!M4`;

  try {
    const res = await request.text();
    const sheets = await getSheets();
    await sheets.spreadsheets.values.update({
      valueInputOption: "RAW",
      spreadsheetId: process.env.SHEET_ID,
      range,
      requestBody: {
        values: [[res]],
      },
    });
  } catch (e) {
    throw new Error(`could not update sheets: ${e}`);
  }

  return NextResponse.json({ test: "success" });
}

export async function GET(request: Request) {
  return NextResponse.json({ test: "hellow" });
}
