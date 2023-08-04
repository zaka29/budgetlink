"use client";
import { LabelInput } from "@/components/ui/LabelInput";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSheets, getTotalExpenseCellData } from "@/app/page";
import { redirect } from "next/navigation";
import { RedirectType } from "next/dist/client/components/redirect";
import { json } from "stream/consumers";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const total = searchParams.total || 0;
  const router = useRouter();
  const [expense, setExpense] = useState("");
  const [loading, setLoading] = useState(false);

  const postData = async () => {
    console.log("post total ", Number(total) + Number(expense));
    const path = "/api/sheets";
    if (Number.isNaN(expense)) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: `${Number(total) + Number(expense)}`,
      });
      const result = await response.json();
      console.log("post result", result);
    } catch (e) {
      throw new Error("something did not work");
    } finally {
      setLoading(false);
      router.push("/");
    }
  };

  return (
    <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <form>
        <div>
          <LabelInput
            label="Add expense"
            name="addtototal"
            onChangeFn={setExpense}
          />
          <div className="mt-2">
            <button
              disabled={loading}
              type="button"
              onClick={postData}
              className="rounded border border-blue-700 p-2 bg-blue-950 hover:bg-blue-900 text-sm text-blue-500"
            >
              {loading ? "Adding" : "Add"} expense
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
