"use client";
import { ChangeEvent, useMemo, useReducer } from "react";
import Decimal from "decimal.js";
import { Groceries } from "@/components/AddToSpreadsheet/Cells/Groceries";
import { CoffeeTea } from "@/components/AddToSpreadsheet/Cells/CoffeeTea";
import { Cells } from "@/components/AddToSpreadsheet/Cells/types";
import { Payload, usePostCellData } from "@/app/hooks";

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
  payload: State;
};

export type Actions =
  | UpdateCellValueAction
  | UpdateTotalAction
  | PostExpensesAction;

const reducer = (state: State, action: Actions) => {
  const { type, payload } = action;
  switch (type) {
    case ActionTypes.POST_EXPENSES:
      return { ...state, ...payload };
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

const defaultState: State = {
  coffeetea: { total: null, expense: "0.00" },
  groceries: { total: null, expense: "0.00" },
};

const preparePayload = (state: State): Payload => {
  const validValues = Object.entries(state).filter(
    ([cellKey, cellValues]) => cellValues.total && cellValues.expense,
  );

  const cr = validValues.map(([k]) => Cells[k as keyof typeof Cells]).join(":");

  const values = validValues.map(([cellKey, cellValue]) => [
    `=${cellValue.total && cellValue.total.replace("$", "")}+${
      cellValue.expense && cellValue.expense.replace("$", "")
    }`,
  ]);

  return {
    range: `${Cells.sheetId + cr}`,
    values,
  };
};

const addTotals = (state: State): State => {
  const entries = Object.entries(state);
  return entries.reduce<State>((acm, cell) => {
    const [key, value] = cell;
    if (value && value.total && value.expense) {
      let t = value.total.replace("$", "");
      let e = value.expense.replace("$", "");
      acm[key] = { total: `$${Decimal.add(t, e)}`, expense: "0.00" };
    }
    return acm;
  }, {});
};

export const AddToSpreadsheet = () => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const payload = useMemo<Payload>(() => preparePayload(state), [state]);
  const { runPost, loading } = usePostCellData(payload);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = evt.target;
    dispatch({
      type: ActionTypes.UPDATE_EXPENSE_VALUE,
      payload: { name, expense: value },
    });
  };

  const handlePostData = async () => {
    await runPost();
    // todo find better way
    dispatch({
      type: ActionTypes.POST_EXPENSES,
      payload: addTotals(state),
    });
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
            onClick={handlePostData}
            className="rounded h-[56px] bg-[#497236] hover:bg-[#4B952A] active:bg-[#4B952A] text-[#EDEDED] absolute bottom-40 left-6 right-6"
          >
            {loading ? "Adding" : "Add"} expense
          </button>
        </div>
      </div>
    </form>
  );
};
