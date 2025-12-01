"use client";

import { useEffect, useState } from "react";

type OS = "ios" | "android" | "other";

export function InstallGuide() {
  const [os, setOS] = useState<OS>("other");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // OS判定
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setOS("ios");
    } else if (/android/i.test(userAgent)) {
      setOS("android");
    } else {
      setOS("other");
    }

    // Androidのインストールプロンプトをキャッチ
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleAndroidInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-8 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          ホーム画面に追加して
          <br />
          特典をアンロック
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          アプリをホーム画面に追加すると、Free Sessionにアクセスできます
        </p>
      </div>

      {os === "ios" && (
        <div className="mx-auto max-w-md space-y-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              iOSでの追加方法
            </h2>
            <div className="space-y-6 text-left">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    画面下部の共有ボタンをタップ
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Safariの下部にある共有アイコン（□↑）をタップしてください
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    「ホーム画面に追加」を選択
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    スクロールして「ホーム画面に追加」をタップしてください
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    ホーム画面から起動
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    ホーム画面に追加されたアイコンからアプリを起動してください
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white/80 p-4 dark:bg-gray-800/80">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <svg
                className="h-6 w-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span className="font-medium">共有ボタン → ホーム画面に追加</span>
            </div>
          </div>
        </div>
      )}

      {os === "android" && (
        <div className="mx-auto max-w-md space-y-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Androidでの追加方法
            </h2>
            
            {deferredPrompt ? (
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  下のボタンをタップして、アプリをインストールしてください
                </p>
                <button
                  onClick={handleAndroidInstall}
                  className="w-full rounded-lg bg-green-500 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-green-600 active:scale-95"
                >
                  アプリをインストール
                </button>
              </div>
            ) : (
              <div className="space-y-6 text-left">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      メニューボタンをタップ
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      ブラウザの右上にある「⋮」メニューをタップしてください
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      「ホーム画面に追加」を選択
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      メニューから「ホーム画面に追加」または「アプリをインストール」を選択してください
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      ホーム画面から起動
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      ホーム画面に追加されたアイコンからアプリを起動してください
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {os === "other" && (
        <div className="mx-auto max-w-md space-y-4 rounded-2xl bg-gray-50 p-8 dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            モバイルデバイスからアクセスしてください
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            このアプリはモバイルデバイス（iOS/Android）での使用を推奨しています
          </p>
        </div>
      )}
    </div>
  );
}

