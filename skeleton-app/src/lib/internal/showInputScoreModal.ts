import type { ModalComponent, ModalSettings, ModalStore, ToastStore } from "@skeletonlabs/skeleton";
import { addRewardPoints, showRewardToast } from "$lib/internal/reward";
import InputModal from "$lib/components/modals/InputModal.svelte";

function showInputScoreModal(
  modalStore: ModalStore,
  toastStore: ToastStore,
  numOfQuestions: number,
  passThreshold: number,
  passExamRewardKey: string,
  participateRewardKey: string,
  updateRewardCallback: () => void,
): void {
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
        await addRewardPoints(key);
        showRewardToast(toastStore, key);
        updateRewardCallback();
      }
    },
  };
  modalStore.trigger(modal);
}

export default showInputScoreModal;
