import type { ModalComponent, ModalSettings, ModalStore, ToastStore } from "@skeletonlabs/skeleton";
import { updateRewardPoints, showRewardToast } from "$lib/internal/reward";
import SubmitModal from "$lib/components/modals/SubmitModal.svelte";
import InputModal from "$lib/components/modals/InputModal.svelte";

export function showSubmitExamModal(modalStore: ModalStore, startExamCallback: () => void): void {
  const modalComponent: ModalComponent = {
    ref: SubmitModal,
    props: { title: "検定に挑戦しますか？" },
    slot: "(挑戦できるのは1日に1回までです)",
  };
  const modal: ModalSettings = {
    type: "component",
    component: modalComponent,
    response: (isConfirm: boolean) => {
      if (isConfirm) {
        startExamCallback();
      }
    },
  };
  modalStore.trigger(modal);
}

export function showInputScoreModal(
  modalStore: ModalStore,
  toastStore: ToastStore,
  numOfQuestions: number,
  passThreshold: number,
  passExamRewardKey: string,
  participateRewardKey: string,
  sub: string | null,
  updateRewardCallback: () => void,
): void {
  if (!sub) return;
  const modalComponent: ModalComponent = {
    ref: InputModal,
    props: {
      title: `${numOfQuestions}問中、何問正解できた？`,
      min: 0,
      max: numOfQuestions,
    },
    slot: "(自己採点して、正解した問題を数えてね)",
  };
  const modal: ModalSettings = {
    type: "component",
    component: modalComponent,
    response: async (res: { isConfirm: boolean; inputValue: number }) => {
      if (res.isConfirm) {
        const key = res.inputValue < passThreshold ? participateRewardKey : passExamRewardKey;
        await updateRewardPoints(sub, key);
        showRewardToast(toastStore, key);
        updateRewardCallback();
      }
    },
  };
  modalStore.trigger(modal);
}
