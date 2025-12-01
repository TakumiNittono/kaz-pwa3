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
          // react-onesignalのinitializeを呼び出すと、内部的にSDKを読み込む
          // 直接window.OneSignalをチェックするのではなく、initializeを呼び出してから待機
          console.log(`[OneSignal] Attempting initialization... (attempt ${retryCount + 1}/${maxRetries})`);
          
          // 初期化を実行（SDKがまだ読み込まれていなくても、react-onesignalが内部で処理する）
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

          // SDKが読み込まれるまで待機（最大10秒）
          let waitCount = 0;
          const maxWait = 10;
          while (waitCount < maxWait) {
            // react-onesignalがSDKを読み込んだか確認
            // getOneSignalInstance()を使用して確認
            try {
              const instance = OneSignal.getOneSignalInstance();
              if (instance) {
                console.log("[OneSignal] SDK instance found");
                break;
              }
            } catch (e) {
              // まだ読み込まれていない
            }
            
            // window.OneSignalも確認（フォールバック）
            if (typeof (window as any).OneSignal !== "undefined") {
              console.log("[OneSignal] window.OneSignal found");
              break;
            }
            
            waitCount++;
            console.log(`[OneSignal] Waiting for SDK to load... (${waitCount}/${maxWait})`);
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          if (waitCount >= maxWait && retryCount < maxRetries - 1) {
            retryCount++;
            console.log(`[OneSignal] SDK not loaded, retrying... (${retryCount}/${maxRetries})`);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return attemptInitialization();
          }

          // 初期化が完了するまで少し待機
          await new Promise((resolve) => setTimeout(resolve, 500));

          isOneSignalInitialized = true;
          isOneSignalInitializing = false;
          console.log("[OneSignal] Initialization completed successfully");
          setIsReady(true);
          onInitialized?.();
          
          // グローバルイベントを発火（他のコンポーネントが監視できるように）
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("onesignal-initialized"));
          }
          
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

