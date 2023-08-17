"use client";
import { LabelInput } from "@/components/ui/LabelInput";
import { ChangeEvent, useState, useReducer, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Groceries } from "@/components/AddToSpreadsheet/Cells/Groceries";

interface State {
  [key: string]: string | null;
}

enum ActionTypes {
  POST_EXPENSES = "POST_EXPENSES",
  UPDATE_EXPENSE_VALUE = "UPDATE_EXPENSE_VALUE",
}

type UpdateCellValueAction = {
  type: ActionTypes.UPDATE_EXPENSE_VALUE;
  payload: { name: string; value: string; current: string };
};

type PostExpensesAction = {
  type: ActionTypes.POST_EXPENSES;
  payload: string;
};

export type Actions = UpdateCellValueAction | PostExpensesAction;

const reducer = (state: State, action: Actions) => {
  const { type, payload } = action;
  switch (type) {
    case ActionTypes.POST_EXPENSES:
      return { ...state };
    case ActionTypes.UPDATE_EXPENSE_VALUE:
      return { ...state, [payload.name]: payload.value };
    default:
      return state;
  }
};

export const AddToSpreadsheet = ({ total }: { total?: string }) => {
  const currentTotal = total || "0.00";
  const router = useRouter();
  const [expense, setExpense] = useState("0.00");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [state, dispatch] = useReducer(reducer, { groceries: null });

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = evt.target;
    setExpense(value);
    dispatch({
      type: ActionTypes.UPDATE_EXPENSE_VALUE,
      payload: { name, value },
    });
  };

  const postData = async () => {
    const path = "/api/sheets";
    const t = total && total.length && total.replace("$", "");
    const e = expense && expense.length && expense.replace("$", "");
    console.log("t, e ", t, e);
    if (Number.isNaN(t) || Number.isNaN(e)) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: `=${t}+${e}`,
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
        <Groceries dispatch={dispatch} onChangeFunc={handleChange} />
        <div className="mt-2">
          <button
            disabled={loading}
            type="button"
            onClick={postData}
            className="rounded h-[56px] bg-[#497236] hover:bg-[#4B952A] active:bg-[#4B952A] text-[#EDEDED] absolute bottom-40 left-6 right-6"
          >
            {loading ? "Adding" : "Add"} expense
          </button>
        </div>
      </div>
    </form>
  );
};
