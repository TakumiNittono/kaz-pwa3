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
      OneSignal.initialize(appId, {
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: false, // カスタムUIを使用するため無効化
        },
      });
    }
  }, []);

  return <>{children}</>;
}

