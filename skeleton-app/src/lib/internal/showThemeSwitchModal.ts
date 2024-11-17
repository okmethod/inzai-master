import type { ModalComponent, ModalSettings, ModalStore } from "@skeletonlabs/skeleton";
import ThemeSwitchModal from "$lib/components/modals/ThemeSwitchModal.svelte";

function showThemeSwitchModal(modalStore: ModalStore): void {
  const modalComponent: ModalComponent = {
    ref: ThemeSwitchModal,
    props: {},
  };
  const m: ModalSettings = {
    type: "component",
    component: modalComponent,
    backdropClasses: "fixed inset-0 !bg-gray-300/90",
  };
  modalStore.trigger(m);
}

export default showThemeSwitchModal;
