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
    backdropClasses: "cModalStandardBackdrop",
  };
  modalStore.trigger(m);
}

export default showThemeSwitchModal;
