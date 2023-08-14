"use client";
import { LabelInput } from "@/components/ui/LabelInput";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export const AddToSpreadsheet = ({ total }: { total?: string }) => {
  const currentTotal = total || "0.00";
  const router = useRouter();
  const [expense, setExpense] = useState("0.00");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const getExpenseTotal = async () => {
    const base = "http://localhost:3000";
    const path = "/api/sheets";
    try {
      const response = await fetch(path, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      console.log("result ", result);
      if (result.message.includes("Error")) {
        throw new Error(result.message);
      }
      return result;
    } catch (e) {
      throw new Error(`something did not work: ${e}`);
    }
  };

  const postData = async () => {
    const path = "/api/sheets";
    if (Number.isNaN(expense)) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: `=${total}+${expense}`,
      });
      const result = await response.json();
      if (result.message.includes("Error")) {
        throw new Error(result.message);
      }
    } catch (e) {
      throw new Error(`something did not work: ${e}`);
    } finally {
      setLoading(false);
      setExpense("0.00");
      startTransition(() => {
        router.refresh();
      });
    }
  };

  return (
    <form>
      <div>
        <LabelInput
          label="Add expense"
          name="addtototal"
          onChangeFn={setExpense}
          defaultValue={currentTotal}
          value={expense}
          loading={loading}
        />
        <div className="mt-2">
          <button
            disabled={loading}
            type="button"
            onClick={postData}
            className="rounded h-[56px] bg-[#497236] hover:bg-[#4B952A] active:bg-[#4B952A] text-[#EDEDED] absolute bottom-20 left-6 right-6"
          >
            {loading ? "Adding" : "Add"} expense
          </button>
        </div>
      </div>
    </form>
  );
};
