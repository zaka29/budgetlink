import React from "react";

import { Spinner } from "@/components/ui/Spinner";

export const Loading = () => {
  return (
    <main className="mx-auto max-w-7xl py-6 px-6 h-screen relative">
      <div className="m-auto w-8 h-8 mt-40">
        <Spinner loading lg />
      </div>
    </main>
  );
};

export default Loading;
