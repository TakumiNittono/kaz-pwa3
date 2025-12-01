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
  const [oneSignalReady, setOneSignalReady] = useState(false);

  // OneSignal初期化完了時のコールバック
  const handleOneSignalInitialized = () => {
    console.log("[App] OneSignal initialized callback received");
    setOneSignalReady(true);
  };

  useEffect(() => {
    // PWAとして起動しているか判定（より堅牢な判定）
    const checkStandalone = (): boolean => {
      if (typeof window === "undefined") {
        console.log("[Phase Check] Window not available");
        return false;
      }

      // 方法1: display-mode メディアクエリ（標準的な方法）
      const isStandaloneByDisplayMode = window.matchMedia("(display-mode: standalone)").matches;
      
      // 方法2: iOS Safari の navigator.standalone
      const isStandaloneByNavigator = (window.navigator as any).standalone === true;
      
      // 方法3: Android の referrer チェック
      const isStandaloneByReferrer = document.referrer.includes("android-app://");
      
      // 方法4: URLパラメータやその他の指標
      const isStandaloneByOther = 
        window.location.search.includes("standalone=true") ||
        localStorage.getItem("pwa-installed") === "true";

      const isStandaloneMode = 
        isStandaloneByDisplayMode || 
        isStandaloneByNavigator || 
        isStandaloneByReferrer ||
        isStandaloneByOther;

      console.log("[Phase Check] Standalone detection:", {
        displayMode: isStandaloneByDisplayMode,
        navigator: isStandaloneByNavigator,
        referrer: isStandaloneByReferrer,
        other: isStandaloneByOther,
        final: isStandaloneMode,
        userAgent: navigator.userAgent,
      });

      setIsStandalone(isStandaloneMode);
      return isStandaloneMode;
    };

    const isStandaloneMode = checkStandalone();

    // ブラウザでのアクセス時はOneSignalのチェックをスキップして即座に表示
    if (!isStandaloneMode) {
      console.log("[Phase Check] Browser mode detected, showing install guide");
      setIsLoading(false);
      setPhase("install");
      return;
    }

    console.log("[Phase Check] PWA mode detected, waiting for OneSignal initialization...");

    // PWA起動時はOneSignalの初期化を待つ
    const checkOneSignalAndSubscription = async () => {
      let attempts = 0;
      const maxAttempts = 10; // 最大10秒待機

      // OneSignalが利用可能になるまで待機
      while (attempts < maxAttempts) {
        try {
          // OneSignal SDKが読み込まれているか確認
          if (typeof (window as any).OneSignal !== "undefined") {
            console.log("[OneSignal] SDK detected, checking subscription status...");
            
            // 購読状態を確認
            const subscription = await OneSignal.isPushNotificationsEnabled();
            console.log("[OneSignal] Subscription status:", subscription);
            setIsSubscribed(subscription);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.warn("[OneSignal] Error checking subscription:", error);
        }

        attempts++;
        console.log(`[OneSignal] Waiting for SDK... (${attempts}/${maxAttempts})`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // タイムアウトした場合でも画面を表示
      console.warn("[OneSignal] Timeout waiting for SDK, showing permission screen");
      setIsSubscribed(false);
      setIsLoading(false);
    };

    // OneSignal初期化完了を待つか、タイムアウトするまで待機
    if (oneSignalReady) {
      checkOneSignalAndSubscription();
    } else {
      // OneSignal初期化を待つ（最大5秒）
      const timeout = setTimeout(() => {
        console.warn("[App] OneSignal initialization timeout, proceeding anyway");
        checkOneSignalAndSubscription();
      }, 5000);

      // OneSignalが準備できたら即座にチェック
      const checkInterval = setInterval(() => {
        if (oneSignalReady) {
          clearTimeout(timeout);
          clearInterval(checkInterval);
          checkOneSignalAndSubscription();
        }
      }, 100);

      return () => {
        clearTimeout(timeout);
        clearInterval(checkInterval);
      };
    }
  }, [oneSignalReady]);

  useEffect(() => {
    // フェーズの決定
    if (isLoading) {
      console.log("[Phase] Still loading...");
      return;
    }

    console.log("[Phase] Determining phase:", {
      isStandalone,
      isSubscribed,
      isLoading,
    });

    if (!isStandalone) {
      // Phase 1: ブラウザでのアクセス時（未インストール状態）
      console.log("[Phase] Setting to: install");
      setPhase("install");
    } else if (isStandalone && !isSubscribed) {
      // Phase 2: PWA起動時 & 通知未許可
      console.log("[Phase] Setting to: permission");
      setPhase("permission");
    } else if (isStandalone && isSubscribed) {
      // Phase 3: PWA起動時 & 通知許可済み
      console.log("[Phase] Setting to: unlocked");
      setPhase("unlocked");
    }
  }, [isStandalone, isSubscribed, isLoading]);

  // 購読状態の変更を監視（PWA起動時のみ）
  useEffect(() => {
    if (!isStandalone || !oneSignalReady) return;

    console.log("[Subscription] Setting up subscription monitoring...");

    // 定期的に購読状態をチェック（許可されていない場合のみ、3秒ごと）
    const intervalId = setInterval(async () => {
      try {
        if (typeof (window as any).OneSignal !== "undefined") {
          const enabled = await OneSignal.isPushNotificationsEnabled();
          if (enabled !== isSubscribed) {
            console.log("[Subscription] Status changed:", enabled);
            setIsSubscribed(enabled);
          }
        }
      } catch (error) {
        console.warn("[Subscription] Error checking status:", error);
      }
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isStandalone, oneSignalReady, isSubscribed]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <OneSignalProvider onInitialized={handleOneSignalInitialized}>
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        {phase === "install" && <InstallGuide />}
        {phase === "permission" && (
          <PermissionGate
            onPermissionGranted={async () => {
              console.log("[PermissionGate] Permission granted, checking subscription...");
              // 購読状態を再確認
              try {
                // 少し待ってから確認（OneSignalの処理が完了するまで）
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const subscription = await OneSignal.isPushNotificationsEnabled();
                console.log("[PermissionGate] Subscription status after grant:", subscription);
                setIsSubscribed(subscription);
              } catch (error) {
                console.error("[PermissionGate] Subscription check error:", error);
              }
            }}
          />
        )}
        {phase === "unlocked" && <FreeSessionButton />}
      </main>
    </OneSignalProvider>
  );
}

