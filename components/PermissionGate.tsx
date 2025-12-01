"use client";

import { useState } from "react";
import OneSignal from "react-onesignal";

interface PermissionGateProps {
  onPermissionGranted: () => void;
}

export function PermissionGate({ onPermissionGranted }: PermissionGateProps) {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestPermission = async () => {
    setIsRequesting(true);

    try {
      // OneSignalの通知許可をリクエスト
      await OneSignal.registerForPushNotifications();
      
      // 購読状態を確認
      const isSubscribed = await OneSignal.isPushNotificationsEnabled();
      
      if (isSubscribed) {
        onPermissionGranted();
      } else {
        // ユーザーが拒否した場合
        alert("通知を許可していただく必要があります。設定から通知を有効にしてください。");
      }
    } catch (error) {
      console.error("Permission request error:", error);
      alert("通知の許可に失敗しました。もう一度お試しください。");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 text-center">
      <div className="space-y-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
          <svg
            className="h-10 w-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          通知を受け取って
          <br />
          特典をアンロック
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          通知を許可すると、Free Sessionへのアクセス権が得られます
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleRequestPermission}
          disabled={isRequesting}
          className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-5 text-lg font-semibold text-white shadow-lg transition-all hover:from-purple-600 hover:to-pink-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRequesting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              処理中...
            </span>
          ) : (
            "通知を許可する"
          )}
        </button>

        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            💡 通知を許可することで、最新情報や特典をお届けします
          </p>
        </div>
      </div>
    </div>
  );
}

