"use client";
import { LabelInput } from "@/components/ui/LabelInput";
import { ChangeEvent, useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

export const Groceries = ({
  onChangeFunc,
}: {
  onChangeFunc: (evt: ChangeEvent<HTMLInputElement>) => void;
}) => {
  // const currentTotal = total || "0.00";
  const [total, setTotal] = useState("0.00");
  const [expense, setExpense] = useState("0.00");
  const [loading, setLoading] = useState(false);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    setExpense(value);
    onChangeFunc(evt);
  };

  const getExpenseTotal = async (): Promise<{
    message: string;
    sheets: { title: string };
  }> => {
    const path = "/api/sheets";
    setLoading(true);
    try {
      const response = await fetch(path, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      console.log("getExpenseTotal result ", result);
      if (result.message.includes("Error")) {
        throw new Error(result.message);
      }
      return result;
    } catch (e) {
      throw new Error(`something did not work: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const result = await getExpenseTotal();
      const { sheets } = result;
      setTotal(sheets.title);
    })();
  }, []);

  return (
    <LabelInput
      label="Total groceries 2"
      name="addtototal"
      onChangeFn={handleChange}
      defaultValue={total}
      value={expense}
      loading={loading}
    />
  );
};