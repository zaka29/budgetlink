import { NextRequest, NextResponse } from "next/server";
import { getSheets } from "@/app/page";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const range = `15jul-15Aug'23!M4`;
  let error = null;

  try {
    const res = await request.text();
    const sheets = await getSheets();
    await sheets.spreadsheets.values.update({
      valueInputOption: "USER_ENTERED",
      spreadsheetId: process.env.SHEET_ID,
      range,
      requestBody: {
        values: [[res]],
      },
    });
  } catch (e) {
    return NextResponse.json({
      message: `Error updating spread sheet: ${error}`,
    });
  }

  return NextResponse.json({ message: "success" });
}

export async function GET(request: NextRequest) {
  const range = `15jul-15Aug'23!M4`;
  let response = null;
  try {
    // Auth
    const sheets = await getSheets();
    response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range,
    });
  } catch (e) {
    throw new Error(`could not fetch sheets: ${e}`);
  }

  if (!response || !response.data.values) {
    return NextResponse.json(
      { message: "Error in spreadsheet" },
      { status: 400 },
    );
  }

  const [title, content] = response.data.values[0];

  return NextResponse.json({
    message: "Success",
    sheets: {
      title,
      content,
    },
  });
}
