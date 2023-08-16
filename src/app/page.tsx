import { google } from "googleapis";
import { AddToSpreadsheet } from "@/components/AddToSpreadsheet";
import { getExpenseTotal } from "@/app/actions";

export const dynamic = "force-dynamic";

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
