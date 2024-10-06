import { writable, type Writable } from "svelte/store";
import { getToastStore } from "@skeletonlabs/skeleton";
import type { ToastSettings } from "@skeletonlabs/skeleton";

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
  private timer?: NodeJS.Timeout;
  private toastId?: string;
  private timerId = "timer";

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
          this.showAlarmToast();
          this.closeToast();
          return 0;
        }
      });
      this.updateToast();
    }, 1000);
    this.showToast();
  }

  public stopTimer() {
    clearInterval(this.timer);
    this.closeToast();
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
      timeout: this.timeFull * 1000, // duration秒間表示
    };
    this.toastId = this.toastStore.trigger(toastSettings);
  }

  private updateToast() {
    const timerElement = document.getElementById(this.timerId);
    if (timerElement) {
      this.timeLeft.subscribe((value) => {
        timerElement.textContent = formatTime(value);
      })();
    }
  }

  private closeToast() {
    if (this.toastId) this.toastStore.close(this.toastId);
  }

  private showAlarmToast() {
    const content = "タイムアップ！";
    const toastSettings: ToastSettings = {
      message: this.createToastMessage(content),
      background: "bg-red-100 select-none",
      autohide: false,
    };
    this.toastStore.trigger(toastSettings);
  }
}

export default TimerToast;
