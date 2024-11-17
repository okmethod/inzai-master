import type { ModalComponent, ModalSettings, ModalStore } from "@skeletonlabs/skeleton";
import SubmitModal from "$lib/components/modals/SubmitModal.svelte";

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
    backdropClasses: "cModalStandardBackdrop",
  };
  modalStore.trigger(modal);
}

export default showSubmitExamModal;
