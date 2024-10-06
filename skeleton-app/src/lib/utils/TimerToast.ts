import { writable, type Writable } from "svelte/store";
import { getToastStore } from "@skeletonlabs/skeleton";
import type { ToastSettings } from "@skeletonlabs/skeleton";

class TimerToast {
  private timeFull: number;
  public timeLeft: Writable<number>;
  private toastStore = getToastStore();
  private timer?: NodeJS.Timeout;
  private toastId?: string;

  constructor(durationSec: number) {
    this.timeFull = durationSec; // 単位: 秒
    this.timeLeft = writable(this.timeFull);
  }

  public resetTimer() {
    this.timeLeft.set(this.timeFull);
  }

  public startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft.update((current) => {
        if (current > 0) {
          return current - 1;
        } else {
          clearInterval(this.timer);
          this.closeToast();
          return 0;
        }
      });
      this.updateToast();
    }, 1000);
    this.showToast();
  }

  private showToast() {
    const toastSettings: ToastSettings = {
      message: `<div class="w-20">残り時間: <span id="timer">${this.formatTime(this.timeFull)}</span></div>`,
      timeout: this.timeFull * 1000, // duration秒間表示
      background: "bg-green-100 select-none",
    };
    this.toastId = this.toastStore.trigger(toastSettings);
  }

  private updateToast() {
    const timerElement = document.getElementById("timer");
    if (timerElement) {
      this.timeLeft.subscribe((value) => {
        timerElement.textContent = this.formatTime(value);
      })();
    }
  }

  private closeToast() {
    if (this.toastId) this.toastStore.close(this.toastId);
  }

  private formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  public stopTimer() {
    clearInterval(this.timer);
    this.closeToast();
  }
}

export default TimerToast;
