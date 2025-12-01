"use client";

import { Gift } from "lucide-react";

export function FreeSessionButton() {
  const handleClick = () => {
    window.location.href = "https://utage-system.com/p/zwvVkDBzc2wb";
  };

  return (
    <div className="w-full max-w-md space-y-8 text-center">
      <div className="space-y-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
          <Gift className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Free Session
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          特典にアクセスする準備ができました
        </p>
      </div>

      <button
        onClick={handleClick}
        className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-5 text-lg font-semibold text-white shadow-lg transition-all hover:from-yellow-500 hover:to-orange-600 active:scale-95 flex items-center justify-center gap-2"
      >
        <Gift className="h-5 w-5" />
        Free Session Start
      </button>
    </div>
  );
}

