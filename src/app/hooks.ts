import { useEffect, useRef, useState } from "react";

export type CellData = {
  sheets: { title: string };
};

export const useGetCellValue = (range?: string) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CellData | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const cancel = useRef(false);

  const getData = async (
    range: string,
  ): Promise<{
    message: string;
    sheets: { title: string };
  }> => {
    const path = "/api/sheets";
    const params = `?range=${range}`;
    setLoading(true);
    try {
      const response = await fetch(`${path + params}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (result.message.includes("Error")) {
        throw new Error(result.message);
      }
      return result;
    } catch (e) {
      setError(`Error: something did not work: ${e}`);
      throw new Error(`something did not work: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (range) {
      (async () => {
        const d = await getData(range);
        if (!cancel.current) {
          setData(d);
        }
      })();
    }
    return () => {
      cancel.current = true;
    };
  }, [range]);

  return { data, loading, error };
};
