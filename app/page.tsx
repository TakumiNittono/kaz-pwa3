"use client";

import { useEffect, useState } from "react";
import { InstallGuide } from "@/components/InstallGuide";
import { PermissionGate } from "@/components/PermissionGate";
import { FreeSessionButton } from "@/components/FreeSessionButton";
import OneSignal from "react-onesignal";

type AppPhase = "install" | "permission" | "unlocked";

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("install");
  const [isStandalone, setIsStandalone] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // PWAとして起動しているか判定
    const checkStandalone = () => {
      if (typeof window !== "undefined") {
        const isStandaloneMode =
          window.matchMedia("(display-mode: standalone)").matches ||
          (window.navigator as any).standalone === true ||
          document.referrer.includes("android-app://");
        setIsStandalone(isStandaloneMode);
      }
    };

    checkStandalone();

    // OneSignalの購読状態を確認
    const checkSubscription = async () => {
      try {
        const subscription = await OneSignal.isPushNotificationsEnabled();
        setIsSubscribed(subscription);
      } catch (error) {
        console.error("OneSignal subscription check error:", error);
        setIsSubscribed(false);
      } finally {
        setIsLoading(false);
      }
    };

    // OneSignalの初期化を待つ
    const timer = setTimeout(() => {
      checkSubscription();
    }, 1000);

    // 定期的に購読状態をチェック（5秒ごと）
    // OneSignal.on()は使用できないため、定期的なチェックで対応
    const intervalId = setInterval(() => {
      checkSubscription();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    // フェーズの決定
    if (isLoading) return;

    if (!isStandalone) {
      // Phase 1: ブラウザでのアクセス時（未インストール状態）
      setPhase("install");
    } else if (isStandalone && !isSubscribed) {
      // Phase 2: PWA起動時 & 通知未許可
      setPhase("permission");
    } else if (isStandalone && isSubscribed) {
      // Phase 3: PWA起動時 & 通知許可済み
      setPhase("unlocked");
    }
  }, [isStandalone, isSubscribed, isLoading]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      {phase === "install" && <InstallGuide />}
      {phase === "permission" && (
        <PermissionGate
          onPermissionGranted={async () => {
            // 購読状態を再確認
            try {
              const subscription = await OneSignal.isPushNotificationsEnabled();
              setIsSubscribed(subscription);
            } catch (error) {
              console.error("Subscription check error:", error);
            }
          }}
        />
      )}
      {phase === "unlocked" && <FreeSessionButton />}
    </main>
  );
}

