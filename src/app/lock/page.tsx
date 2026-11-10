"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Unlock,
  Fingerprint,
  Delete,
  AlertTriangle,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Check,
} from "lucide-react";
import {
  verifyAppPinAction,
  biometricUnlockAction,
  logoutAction,
} from "@/server/actions/auth";

function LockScreenContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const [pinLength, setPinLength] = useState<4 | 6>(4);
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Lockout state
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(3);

  // Biometric animation state
  const [isScanningBiometric, setIsScanningBiometric] = useState(false);

  // Countdown timer for lockout
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLockedOut && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsLockedOut(false);
            setError(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLockedOut, countdown]);

  const handleVerify = useCallback(
    async (codeToVerify: string) => {
      if (isLockedOut || isVerifying) return;
      setIsVerifying(true);
      setError(null);

      try {
        const res = await verifyAppPinAction(codeToVerify);
        if (res.success) {
          setIsSuccess(true);
          setTimeout(() => {
            router.push(returnUrl);
            router.refresh();
          }, 400);
        } else {
          setPin("");
          if (res.locked && res.secondsRemaining) {
            setIsLockedOut(true);
            setCountdown(res.secondsRemaining);
            setError(res.error || "Device locked due to multiple failed attempts.");
          } else {
            if (typeof res.attemptsRemaining === "number") {
              setAttemptsLeft(res.attemptsRemaining);
            }
            setError(res.error || "Incorrect PIN code. Please retry.");
          }
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Verification error");
        setPin("");
      } finally {
        setIsVerifying(false);
      }
    },
    [isLockedOut, isVerifying, returnUrl, router]
  );

  // Auto-verify when all digits are typed
  useEffect(() => {
    if (pin.length === pinLength) {
      handleVerify(pin);
    }
  }, [pin, pinLength, handleVerify]);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLockedOut || isVerifying || isSuccess) return;

      if (/^[0-9]$/.test(e.key)) {
        if (pin.length < pinLength) {
          setPin((prev) => prev + e.key);
        }
      } else if (e.key === "Backspace") {
        setPin((prev) => prev.slice(0, -1));
      } else if (e.key === "Escape") {
        setPin("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, pinLength, isLockedOut, isVerifying, isSuccess]);

  const handleDigitClick = (digit: string) => {
    if (isLockedOut || isVerifying || isSuccess) return;
    if (pin.length < pinLength) {
      setPin((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    if (isLockedOut || isVerifying || isSuccess) return;
    setPin((prev) => prev.slice(0, -1));
  };

  const handleBiometricSimulation = async () => {
    if (isLockedOut || isVerifying || isSuccess) return;
    setIsScanningBiometric(true);
    setError(null);

    // Simulate biometric scan delay (800ms)
    setTimeout(async () => {
      try {
        const res = await biometricUnlockAction();
        if (res.success) {
          setIsSuccess(true);
          setTimeout(() => {
            router.push(returnUrl);
            router.refresh();
          }, 300);
        }
      } catch (err) {
        console.error(err);
        setError("Biometric validation failed.");
      } finally {
        setIsScanningBiometric(false);
      }
    }, 800);
  };

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#080D0B] text-[#F3F7F4] flex flex-col justify-center items-center p-4 select-none relative overflow-hidden">
      {/* Background emerald blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#10B981]/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Lock Card */}
      <div className="w-full max-w-sm glass-card rounded-3xl p-6 sm:p-8 border border-[#25352C] shadow-2xl relative z-10 emerald-glow flex flex-col items-center">
        {/* Lock Icon */}
        <div
          className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-4 transition-all duration-300 ${
            isSuccess
              ? "bg-[#10B981] border-[#10B981] text-[#080D0B] scale-105"
              : isLockedOut
              ? "bg-[#EF4444]/15 border-[#EF4444]/40 text-[#EF4444]"
              : "bg-[#101915] border-[#25352C] text-[#10B981] emerald-glow-sm"
          }`}
        >
          {isSuccess ? (
            <Unlock className="w-8 h-8 animate-in zoom-in" />
          ) : isLockedOut ? (
            <ShieldAlert className="w-8 h-8" />
          ) : (
            <Lock className="w-8 h-8" />
          )}
        </div>

        <h1 className="text-xl font-bold tracking-tight text-[#F3F7F4] text-center">
          {isSuccess
            ? "Access Granted"
            : isLockedOut
            ? "Passcode Locked"
            : "XASAN OS Passcode"}
        </h1>
        <p className="text-xs text-[#98A69D] text-center mt-1">
          {isLockedOut
            ? `Security lockout active for ${countdown}s`
            : "Enter 4-digit PIN (Default: 1234) or Biometrics"}
        </p>

        {/* PIN Dots Indicator */}
        <div className="flex items-center justify-center gap-4 my-6">
          {Array.from({ length: pinLength }).map((_, index) => {
            const isFilled = index < pin.length;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                  isFilled
                    ? "bg-[#10B981] border-[#10B981] shadow-lg shadow-[#10B981]/50 scale-110"
                    : "bg-[#101915] border-[#25352C]"
                }`}
              />
            );
          })}
        </div>

        {/* Error / Lockout Banner */}
        {error && (
          <div className="w-full mb-4 p-2.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] text-xs text-center flex items-center justify-center gap-1.5 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={isLockedOut || isVerifying || isSuccess}
              onClick={() => handleDigitClick(digit)}
              className="h-14 rounded-2xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/50 hover:bg-[#142019] active:scale-95 text-lg font-bold text-[#F3F7F4] transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center shadow-inner"
            >
              {digit}
            </button>
          ))}

          {/* Biometric Scan Trigger */}
          <button
            type="button"
            disabled={isLockedOut || isVerifying || isSuccess}
            onClick={handleBiometricSimulation}
            title="Biometric Simulation (TouchID / FaceID)"
            className={`h-14 rounded-2xl border transition-all active:scale-95 disabled:opacity-40 cursor-pointer flex items-center justify-center ${
              isScanningBiometric
                ? "bg-[#10B981]/20 border-[#10B981] text-[#10B981] animate-pulse"
                : "bg-[#101915] border-[#25352C] text-[#10B981] hover:border-[#10B981]/50 hover:bg-[#142019]"
            }`}
          >
            <Fingerprint className="w-6 h-6" />
          </button>

          {/* Digit 0 */}
          <button
            type="button"
            disabled={isLockedOut || isVerifying || isSuccess}
            onClick={() => handleDigitClick("0")}
            className="h-14 rounded-2xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/50 hover:bg-[#142019] active:scale-95 text-lg font-bold text-[#F3F7F4] transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center shadow-inner"
          >
            0
          </button>

          {/* Delete / Backspace */}
          <button
            type="button"
            disabled={isLockedOut || isVerifying || isSuccess || pin.length === 0}
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-[#101915] border border-[#25352C] hover:border-[#EF4444]/50 hover:bg-[#142019] active:scale-95 text-sm font-semibold text-[#98A69D] hover:text-[#EF4444] transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center shadow-inner"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Actions */}
        <div className="w-full mt-6 pt-4 border-t border-[#25352C] flex items-center justify-between text-xs text-[#98A69D]">
          <button
            onClick={() => setPinLength(pinLength === 4 ? 6 : 4)}
            className="hover:text-[#10B981] transition-colors cursor-pointer"
          >
            Switch to {pinLength === 4 ? "6-digit" : "4-digit"}
          </button>
          <button
            onClick={handleLogout}
            className="hover:text-[#EF4444] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch User</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LockPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080D0B] flex items-center justify-center text-xs text-[#98A69D]">
          Loading Passcode Engine...
        </div>
      }
    >
      <LockScreenContent />
    </Suspense>
  );
}
