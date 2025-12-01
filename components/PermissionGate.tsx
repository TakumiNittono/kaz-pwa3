"use client";

import { useState } from "react";
import OneSignal from "react-onesignal";
import { Bell, BellRing } from "lucide-react";
import { updateSubscriptionState } from "./OneSignalInit";

export function PermissionGate() {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestPermission = async () => {
    setIsRequesting(true);

    try {
      console.log("[PermissionGate] Requesting notification permission...");

      // まず、ブラウザの通知APIを使用して許可をリクエスト
      if ("Notification" in window && Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setIsRequesting(false);
          alert("通知を許可していただく必要があります。設定から通知を有効にしてください。");
          return;
        }
      }

      // OneSignalの通知許可をリクエスト
      await OneSignal.registerForPushNotifications();

      // 少し待ってから購読状態を確認
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const isSubscribed = await OneSignal.isPushNotificationsEnabled();
      console.log("[PermissionGate] Subscription status after request:", isSubscribed);

      if (isSubscribed) {
        updateSubscriptionState(true);
      } else {
        setIsRequesting(false);
        alert("通知を許可していただく必要があります。設定から通知を有効にしてください。");
      }
    } catch (error) {
      console.error("[PermissionGate] Permission request error:", error);
      setIsRequesting(false);
      alert("通知の許可に失敗しました。もう一度お試しください。");
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 text-center">
      <div className="space-y-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
          <Bell className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          特典を受け取る
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          通知を許可すると、最新情報や特典をお届けします
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleRequestPermission}
          disabled={isRequesting}
          className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-5 text-lg font-semibold text-white shadow-lg transition-all hover:from-purple-600 hover:to-pink-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isRequesting ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              処理中...
            </>
          ) : (
            <>
              <BellRing className="h-5 w-5" />
              通知を許可する
            </>
          )}
        </button>

        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Subscribe to our notifications for the latest news
          </p>
        </div>
      </div>
    </div>
  );
}
