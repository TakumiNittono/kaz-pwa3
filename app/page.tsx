"use client";

import { useEffect, useState } from "react";
import { InstallGuide } from "@/components/InstallGuide";
import { PermissionGate } from "@/components/PermissionGate";
import { FreeSessionButton } from "@/components/FreeSessionButton";
import {
  subscribeToSubscriptionState,
  getSubscriptionState,
} from "@/components/OneSignalInit";

type AppPhase = "install" | "permission" | "unlocked";

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("install");
  const [isStandalone, setIsStandalone] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);

  useEffect(() => {
    // PWAとして起動しているか判定
    const checkStandalone = (): boolean => {
      if (typeof window === "undefined") return false;

      // 方法1: display-mode メディアクエリ（標準的な方法）
      const isStandaloneByDisplayMode = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;

      // 方法2: iOS Safari の navigator.standalone
      const isStandaloneByNavigator =
        (window.navigator as any).standalone === true;

      // 方法3: Android の referrer チェック
      const isStandaloneByReferrer = document.referrer.includes(
        "android-app://"
      );

      return (
        isStandaloneByDisplayMode ||
        isStandaloneByNavigator ||
        isStandaloneByReferrer
      );
    };

    const standalone = checkStandalone();
    setIsStandalone(standalone);

    // ブラウザでのアクセス時（Phase 1）
    if (!standalone) {
      setPhase("install");
      setIsSubscribed(null);
      return;
    }

    // PWA起動時: 購読状態を監視
    const unsubscribe = subscribeToSubscriptionState((subscribed) => {
      setIsSubscribed(subscribed);
      setPhase(subscribed ? "unlocked" : "permission");
    });

    // 初期状態を取得
    const currentState = getSubscriptionState();
    if (currentState !== null) {
      setIsSubscribed(currentState);
      setPhase(currentState ? "unlocked" : "permission");
    } else {
      // まだ初期化されていない場合は、permission画面を表示
      setPhase("permission");
      setIsSubscribed(false);
    }

    return unsubscribe;
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      {phase === "install" && <InstallGuide />}
      {phase === "permission" && <PermissionGate />}
      {phase === "unlocked" && <FreeSessionButton />}
    </main>
  );
}
