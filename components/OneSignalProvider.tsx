"use client";

import { useEffect, useState } from "react";
import OneSignal from "react-onesignal";

interface OneSignalProviderProps {
  children: React.ReactNode;
  onInitialized?: () => void;
}

// グローバルに初期化状態を追跡
let isOneSignalInitializing = false;
let isOneSignalInitialized = false;

export function OneSignalProvider({ children, onInitialized }: OneSignalProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeOneSignal = async () => {
      // 既に初期化済みまたは初期化中の場合はスキップ
      if (isOneSignalInitialized || isOneSignalInitializing) {
        console.log("[OneSignal] Already initialized or initializing, skipping...");
        if (isOneSignalInitialized) {
          setIsReady(true);
          onInitialized?.();
        }
        return;
      }

      if (typeof window === "undefined") {
        console.log("[OneSignal] Window not available, skipping initialization");
        return;
      }

      const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "";
      if (!appId) {
        console.warn("[OneSignal] App ID not found in environment variables");
        setIsReady(true);
        return;
      }

      isOneSignalInitializing = true;
      console.log("[OneSignal] Starting initialization...", { appId });

      // 最大3回まで再試行
      const maxRetries = 3;
      let retryCount = 0;

      const attemptInitialization = async (): Promise<boolean> => {
        try {
          // OneSignal SDKが読み込まれるまで待機
          if (typeof (window as any).OneSignal === "undefined") {
            console.log(`[OneSignal] SDK not loaded yet, waiting... (attempt ${retryCount + 1}/${maxRetries})`);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            if (retryCount < maxRetries - 1) {
              retryCount++;
              return attemptInitialization();
            } else {
              console.error("[OneSignal] SDK failed to load after retries");
              return false;
            }
          }

          // 初期化を実行
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

          // 初期化が完了するまで少し待機
          await new Promise((resolve) => setTimeout(resolve, 500));

          isOneSignalInitialized = true;
          isOneSignalInitializing = false;
          console.log("[OneSignal] Initialization completed successfully");
          setIsReady(true);
          onInitialized?.();
          return true;
        } catch (error) {
          console.error("[OneSignal] Initialization error:", error);
          
          if (retryCount < maxRetries - 1) {
            retryCount++;
            console.log(`[OneSignal] Retrying initialization... (${retryCount}/${maxRetries})`);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return attemptInitialization();
          } else {
            isOneSignalInitializing = false;
            console.error("[OneSignal] Initialization failed after all retries");
            setIsReady(true); // エラーでも続行
            return false;
          }
        }
      };

      await attemptInitialization();
    };

    initializeOneSignal();
  }, [onInitialized]);

  return <>{children}</>;
}

// 初期化状態をリセットする関数（テスト用）
export function resetOneSignalState() {
  isOneSignalInitialized = false;
  isOneSignalInitializing = false;
}

