"use client";
import { ChangeEvent, useState, useReducer, useTransition } from "react";
import { useRouter } from "next/navigation";
import Decimal from "decimal.js";
import { Groceries } from "@/components/AddToSpreadsheet/Cells/Groceries";
import { CoffeeTea } from "@/components/AddToSpreadsheet/Cells/CoffeeTea";

interface State {
  [key: string]: { total: string | null; expense: string | null };
}

export enum ActionTypes {
  POST_EXPENSES = "POST_EXPENSES",
  UPDATE_EXPENSE_VALUE = "UPDATE_EXPENSE_VALUE",
  UPDATE_EXPENSE_TOTAL = "UPDATE_EXPENSE_TOTAL",
}

export type UpdateCellValueAction = {
  type: ActionTypes.UPDATE_EXPENSE_VALUE;
  payload: { name: string; expense: string };
};

export type UpdateTotalAction = {
  type: ActionTypes.UPDATE_EXPENSE_TOTAL;
  payload: { name: string; total: string };
};

export type PostExpensesAction = {
  type: ActionTypes.POST_EXPENSES;
  payload: string;
};

export type Actions =
  | UpdateCellValueAction
  | UpdateTotalAction
  | PostExpensesAction;

const reducer = (state: State, action: Actions) => {
  const { type, payload } = action;
  switch (type) {
    case ActionTypes.POST_EXPENSES:
      return { ...state };
    case ActionTypes.UPDATE_EXPENSE_VALUE:
      return {
        ...state,
        [payload.name]: { ...state[payload.name], expense: payload.expense },
      };
    case ActionTypes.UPDATE_EXPENSE_TOTAL:
      return {
        ...state,
        [payload.name]: { ...state[payload.name], total: payload.total },
      };
    default:
      return state;
  }
};

export const AddToSpreadsheet = () => {
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    groceries: { total: null, expense: null },
    coffeetea: { total: null, expense: null },
  });

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = evt.target;
    dispatch({
      type: ActionTypes.UPDATE_EXPENSE_VALUE,
      payload: { name, expense: value },
    });
  };

  const postData = async () => {
    // todo: will need to pass the name
    const path = "/api/sheets";
    // just groceries for the start
    // todo: move to hooks
    const {
      groceries: { total, expense },
    } = state;
    const t = total && total.length && total.replace("$", "");
    const e = expense && expense.length && expense.replace("$", "");
    console.log("t, e ", t, e);
    if (
      t === null ||
      e === null ||
      Number.isNaN(Number(t)) ||
      Number.isNaN(Number(e))
    ) {
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
      dispatch({
        type: ActionTypes.UPDATE_EXPENSE_TOTAL,
        payload: { name: "groceries", total: `$${Decimal.add(t, e)}` },
      });
    } catch (e) {
      throw new Error(`something did not work: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form>
      <div>
        <Groceries
          groceries={state.groceries}
          dispatch={dispatch}
          onChangeFunc={handleChange}
        />
        <CoffeeTea
          coffeetea={state.coffeetea}
          dispatch={dispatch}
          onChangeFunc={handleChange}
        />
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
