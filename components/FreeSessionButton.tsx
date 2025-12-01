"use client";

const FREE_SESSION_URL = "https://utage-system.com/p/zwvVkDBzc2wb";

export function FreeSessionButton() {
  const handleClick = () => {
    window.open(FREE_SESSION_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full max-w-md space-y-8 text-center">
      <div className="space-y-4">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-xl">
          <svg
            className="h-12 w-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          おめでとうございます！
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Free Sessionにアクセスできます
        </p>
      </div>

      <button
        onClick={handleClick}
        className="w-full rounded-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 px-8 py-6 text-xl font-bold text-white shadow-2xl transition-all hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 active:scale-95"
      >
        🎁 Free Session を開始する
      </button>

      <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
        <p className="text-sm text-green-800 dark:text-green-300">
          ✅ 通知が有効になっています。最新情報をお届けします！
        </p>
      </div>
    </div>
  );
}

