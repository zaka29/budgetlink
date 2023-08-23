"use client";
import { LabelInput } from "@/components/ui/LabelInput";
import { ChangeEvent, Dispatch, useEffect, useState, useRef } from "react";
import {
  Actions,
  ActionTypes,
} from "@/components/AddToSpreadsheet/AddToSpreadsheet";
import { useGetCellValue } from "@/app/hooks";
import { Cells } from "@/components/AddToSpreadsheet/Cells/types";

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

  const { data, loading } = useGetCellValue(
    `${Cells.sheetId}${Cells.groceries}`,
  );
  const { total } = groceries || {};

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    setExpense(value);
    onChangeFunc(evt);
  };

  useEffect(() => {
    if (total) {
      setDisplayTotal(total);
      setExpense("0.00");
    }
  }, [total]);

  useEffect(() => {
    if (data) {
      const { sheets } = data;
      setDisplayTotal(sheets.title);
      dispatch({
        type: ActionTypes.UPDATE_EXPENSE_TOTAL,
        payload: { name: "groceries", total: sheets.title },
      });
    }
  }, [data]);

  return (
    <LabelInput
      label="Total groceries"
      name="groceries"
      onChangeFn={handleChange}
      defaultValue={displayTotal}
      value={expense}
      loading={loading}
    />
  );
};
