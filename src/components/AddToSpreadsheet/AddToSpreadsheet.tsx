"use client";
import { LabelInput } from "@/components/ui/LabelInput";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const AddToSpreadsheet = ({ total }: { total?: string }) => {
  const currentTotal = total || 0;
  const router = useRouter();
  const [expense, setExpense] = useState("");
  const [loading, setLoading] = useState(false);

  const postData = async () => {
    console.log("post total ", Number(currentTotal) + Number(expense));
    const path = "/api/sheets";
    if (Number.isNaN(expense)) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: `${Number(currentTotal) + Number(expense)}`,
      });
      const result = await response.json();
      console.log("post result", result);
    } catch (e) {
      throw new Error("something did not work");
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return (
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
  );
};
