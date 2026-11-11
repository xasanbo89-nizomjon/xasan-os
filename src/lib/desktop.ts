"use client";

/**
 * XASAN OS Ultimate - Desktop Integration Helper (Tauri v2)
 * Supports native desktop notifications, system tray updates, and window controls.
 */

export function isTauriApp(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean((window as any).__TAURI__ || (window as any).__TAURI_INTERNALS__);
}

export async function sendDesktopNotification(title: string, body: string) {
  if (typeof window === "undefined") return;

  // 1. Try Tauri native notification plugin if in Tauri environment
  if (isTauriApp()) {
    try {
      const { sendNotification, isPermissionGranted, requestPermission } = (window as any).__TAURI__.notification;
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === "granted";
      }
      if (permissionGranted) {
        sendNotification({ title, body, icon: "/icon-192.svg" });
        return;
      }
    } catch (e) {
      console.warn("Tauri notification fallback to Web Notification:", e);
    }
  }

  // 2. Web Notification API fallback
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/icon-192.svg" });
    } else if (Notification.permission !== "denied") {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        new Notification(title, { body, icon: "/icon-192.svg" });
      }
    }
  }
}

export async function minimizeDesktopWindow() {
  if (!isTauriApp()) return;
  try {
    const { getCurrentWindow } = (window as any).__TAURI__.window;
    await getCurrentWindow().minimize();
  } catch (e) {
    console.warn("Tauri window minimize error:", e);
  }
}

export async function toggleMaximizeDesktopWindow() {
  if (!isTauriApp()) return;
  try {
    const { getCurrentWindow } = (window as any).__TAURI__.window;
    await getCurrentWindow().toggleMaximize();
  } catch (e) {
    console.warn("Tauri window maximize error:", e);
  }
}
