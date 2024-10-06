import { writable, type Writable } from "svelte/store";
import { getToastStore } from "@skeletonlabs/skeleton";
import type { ToastSettings } from "@skeletonlabs/skeleton";
import { browser } from "$app/environment";

type ValidTagName = keyof HTMLElementTagNameMap;

function createElementString(tagName: ValidTagName, content: string, id?: string, className?: string): string {
  const div = document.createElement(tagName);
  div.innerHTML = content;
  if (id) div.id = id;
  if (className) div.className = className;
  return div.outerHTML;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

class TimerToast {
  private timeFull: number;
  public timeLeft: Writable<number>;
  private toastStore = getToastStore();
  private timerId: string;
  private timer?: NodeJS.Timeout;
  private toastId?: string;
  private alarmToastId?: string;
  private unsubscribeTimeLeft: () => void;

  constructor(durationSec: number) {
    this.timeFull = durationSec; // 単位: 秒
    this.timeLeft = writable(this.timeFull);
    this.timerId = "timer";
    this.unsubscribeTimeLeft = this.timeLeft.subscribe((value) => {
      this.updateToast(value);
    });
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
          this.showAlarmToast();
          this.closeToast(this.toastId);
          return 0;
        }
      });
    }, 1000);
    this.showToast();
  }

  public stopTimer() {
    clearInterval(this.timer);
    this.resetTimer();
    this.closeToast(this.toastId);
  }

  private createToastMessage(content: string): string {
    return createElementString("div", content, undefined, "w-32");
  }

  private showToast() {
    const timerString = createElementString("span", formatTime(this.timeFull), this.timerId, undefined);
    const content = `残り時間: ${timerString}`;
    const toastSettings: ToastSettings = {
      message: this.createToastMessage(content),
      background: "bg-green-100 select-none",
      timeout: this.timeFull * 1000,
    };
    this.toastId = this.toastStore.trigger(toastSettings);
  }

  private updateToast(value: number) {
    if (browser) {
      const timerElement = document.getElementById(this.timerId);
      if (timerElement) {
        timerElement.textContent = formatTime(value);
      }
    }
  }

  private closeToast(toastId?: string) {
    if (toastId) this.toastStore.close(toastId);
  }

  private showAlarmToast() {
    const content = "タイムアップ！";
    const toastSettings: ToastSettings = {
      message: this.createToastMessage(content),
      background: "bg-red-100 select-none",
      autohide: false,
    };
    this.alarmToastId = this.toastStore.trigger(toastSettings);
  }

  public destroy() {
    this.stopTimer();
    this.closeToast(this.alarmToastId);
    this.unsubscribeTimeLeft();
  }
}

export default TimerToast;
