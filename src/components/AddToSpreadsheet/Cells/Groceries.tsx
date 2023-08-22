"use client";
import { LabelInput } from "@/components/ui/LabelInput";
import { ChangeEvent, Dispatch, useEffect, useState } from "react";
import {
  Actions,
  ActionTypes,
} from "@/components/AddToSpreadsheet/AddToSpreadsheet";

export const Groceries = ({
  onChangeFunc,
  dispatch,
  groceries,
}: {
  onChangeFunc: (evt: ChangeEvent<HTMLInputElement>) => void;
  dispatch: Dispatch<Actions>;
  groceries?: { total: string | null; expense: string | null };
}) => {
  const [displayTotal, setDisplayTotal] = useState("0.00");
  const [expense, setExpense] = useState("0.00");
  const [loading, setLoading] = useState(false);
  const { total } = groceries || {};

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
    if (total) {
      setDisplayTotal(total);
      setExpense("0.00");
      return;
    }

    (async () => {
      const result = await getExpenseTotal();
      const { sheets } = result;
      setDisplayTotal(sheets.title);
      dispatch({
        type: ActionTypes.UPDATE_EXPENSE_TOTAL,
        payload: { name: "groceries", total: sheets.title },
      });
    })();
  }, [total]);

  return (
    <LabelInput
      label="Total groceries 2"
      name="groceries"
      onChangeFn={handleChange}
      defaultValue={displayTotal}
      value={expense}
      loading={loading}
    />
  );
};
