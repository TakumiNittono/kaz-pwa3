"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

// グローバルな購読状態を管理
let subscriptionState: boolean | null = null;
let subscriptionListeners: Array<(subscribed: boolean) => void> = [];

// 購読状態を更新する関数
export function updateSubscriptionState(subscribed: boolean) {
  if (subscriptionState !== subscribed) {
    subscriptionState = subscribed;
    subscriptionListeners.forEach((listener) => listener(subscribed));
  }
}

// 購読状態のリスナーを登録する関数
export function subscribeToSubscriptionState(
  listener: (subscribed: boolean) => void
) {
  subscriptionListeners.push(listener);
  // 現在の状態を即座に通知
  if (subscriptionState !== null) {
    listener(subscriptionState);
  }
  // クリーンアップ関数を返す
  return () => {
    subscriptionListeners = subscriptionListeners.filter((l) => l !== listener);
  };
}

// 現在の購読状態を取得する関数
export function getSubscriptionState(): boolean | null {
  return subscriptionState;
}

export function OneSignalInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "";
    if (!appId) {
      console.warn("[OneSignal] App ID not found in environment variables");
      return;
    }

    const initializeOneSignal = async () => {
      try {
        console.log("[OneSignal] Initializing...", { appId });

        // OneSignalを初期化
        OneSignal.initialize(appId, {
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: false, // カスタムUIを使用するため無効化
          },
          promptOptions: {
            slidedown: {
              enabled: false, // カスタムUIを使用するため無効化
            },
          },
        } as any);

        console.log("[OneSignal] Initialization called");

        // 初期化が完了するまで少し待機
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 購読状態を確認
        try {
          const isSubscribed = await OneSignal.isPushNotificationsEnabled();
          console.log("[OneSignal] Initial subscription status:", isSubscribed);
          updateSubscriptionState(isSubscribed);
        } catch (error) {
          console.warn("[OneSignal] Error checking initial subscription:", error);
          updateSubscriptionState(false);
        }

        // 定期的に購読状態をチェック（3秒ごと）
        const checkInterval = setInterval(async () => {
          try {
            const isSubscribed = await OneSignal.isPushNotificationsEnabled();
            updateSubscriptionState(isSubscribed);
          } catch (error) {
            console.warn("[OneSignal] Error checking subscription:", error);
          }
        }, 3000);

        return () => {
          clearInterval(checkInterval);
        };
      } catch (error) {
        console.error("[OneSignal] Initialization error:", error);
        updateSubscriptionState(false);
      }
    };

    initializeOneSignal();
  }, []);

  return null; // このコンポーネントはUIを表示しない
}

