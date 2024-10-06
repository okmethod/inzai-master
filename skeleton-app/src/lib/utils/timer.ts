import { writable } from "svelte/store";
import { getToastStore } from "@skeletonlabs/skeleton";
import type { ToastSettings } from "@skeletonlabs/skeleton";

export function useTimerToast(duration: number) {
  const timeFull = duration;
  const timeLeft = writable(timeFull);
  const toastStore = getToastStore();
  let timer: NodeJS.Timeout;
  let toastId: string;

  function resetTimer() {
    timeLeft.set(timeFull);
  }

  function startTimer() {
    timer = setInterval(() => {
      timeLeft.update((current) => {
        if (current > 0) {
          return current - 1;
        } else {
          clearInterval(timer);
          toastStore.close(toastId);
          return 0;
        }
      });
      updateToast();
    }, 1000);
    showToast();
  }

  function showToast() {
    const toastSettings: ToastSettings = {
      message: `<div class="w-20">残り時間: <span id="timer">${formatTime(duration)}</span></div>`,
      timeout: duration * 1000, // duration秒間表示
      background: "bg-green-100 select-none",
    };
    toastId = toastStore.trigger(toastSettings);
  }

  function updateToast() {
    const timerElement = document.getElementById("timer");
    if (timerElement) {
      timeLeft.subscribe((value) => {
        timerElement.textContent = formatTime(value);
      })();
    }
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  function stopTimer() {
    clearInterval(timer);
    toastStore.close(toastId);
  }

  return {
    startTimer,
    stopTimer,
    resetTimer,
    timeLeft,
  };
}
