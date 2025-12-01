"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

interface OneSignalProviderProps {
  children: React.ReactNode;
}

export function OneSignalProvider({ children }: OneSignalProviderProps) {
  useEffect(() => {
    // OneSignalの初期化
    // 注意: 実際のアプリIDは環境変数から取得してください
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "";

    if (typeof window !== "undefined" && appId) {
      try {
        // react-onesignalは自動的にService Workerを管理するため、
        // serviceWorkerPathの指定は不要です
        // OneSignal.initialize()はvoidを返すため、.catch()は使用できません
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
      } catch (error) {
        console.warn('OneSignal initialization error:', error);
        // エラーを無視して続行（Service Workerが利用できない場合でも動作するように）
      }
    }
  }, []);

  return <>{children}</>;
}

