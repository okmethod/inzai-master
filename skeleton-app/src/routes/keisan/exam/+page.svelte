<script lang="ts">
  import { onDestroy } from "svelte";
  import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
  import type { KeisanTemplate, KeisanPortfolio } from "$lib/types/keisan";
  import { getUser } from "$lib/stores/user";
  import { isEligibleForDailyReward } from "$lib/internal/reward";
  import KeisanCard from "$lib/components/cards/KeisanCard.svelte";
  import { showSubmitExamModal, showInputScoreModal } from "$lib/internal/showModal";
  import TimerToast from "$lib/utils/TimerToast";

  export let data: {
    keisanTemplates: KeisanTemplate[];
    gradePortfolios: KeisanPortfolio[];
  };

  const userData = getUser();

  const modalStore = getModalStore();
  const toastStore = getToastStore();
  const timerToast = new TimerToast(600); // 10分

  let selectedIndex = 0;
  function selectContent(event: Event) {
    selectedIndex = parseInt((event.target as HTMLSelectElement).value, 10);
  }

  function pickKeisanTemplates(keisanTemplates: KeisanTemplate[], gradePortfolio: KeisanPortfolio) {
    const selectedTemplates: KeisanTemplate[] = [];
    gradePortfolio.portfolio.forEach((config) => {
      const templates = keisanTemplates.filter((template) => template.label === config.label);
      for (let i = 0; i < config.count; i++) {
        const randomIndex = Math.floor(Math.random() * templates.length);
        selectedTemplates.push(templates[randomIndex]);
      }
    });
    return selectedTemplates;
  }

  let addedReward = userData ? !isEligibleForDailyReward(userData, "KEISAN_EXAM_PARTICIPATION") : false;
  let selectedKeisanTemplates: KeisanTemplate[] = [];
  let isTrialInProgress = false;
  function startExam() {
    selectedKeisanTemplates = pickKeisanTemplates(data.keisanTemplates, data.gradePortfolios[selectedIndex]);
    timerToast.startTimer();
    isTrialInProgress = true;
  }

  let isScoringInProgress = false;
  function finishExam() {
    isTrialInProgress = false;
    timerToast.stopTimer();
    isScoringInProgress = true;
  }

  function handleButtonClick() {
    if (isTrialInProgress) {
      finishExam();
    } else if (isScoringInProgress) {
      showInputScoreModal(
        modalStore,
        toastStore,
        selectedKeisanTemplates.length,
        selectedKeisanTemplates.length - 1,
        "KEISAN_EXAM_PASS",
        "KEISAN_EXAM_PARTICIPATION",
        () => {
          addedReward = true;
          isScoringInProgress = false;
          addedReward = true;
        },
      );
    } else {
      showSubmitExamModal(modalStore, startExam);
    }
  }

  onDestroy(() => {
    timerToast.destroy();
  });
</script>

<div class="cContentPartStyle !m-4">
  {#if userData == null}
    <span> 検定に挑戦するにはログインしてね！ </span>
  {:else}
    <div class="mb-4 flex items-center space-x-2">
      <select id="select-grade" class="border rounded" on:change={selectContent}>
        {#each data.gradePortfolios as gradePortfolio, index}
          <option value={index}>{gradePortfolio.title}</option>
        {/each}
      </select>
      <button
        type="button"
        class="btn variant-filled h-8"
        on:click={handleButtonClick}
        disabled={!isTrialInProgress && addedReward}
      >
        {isTrialInProgress ? "答え合わせ" : isScoringInProgress ? "何問正解？" : addedReward ? "終了" : "出題"}
      </button>
    </div>
    {#if selectedKeisanTemplates.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
        {#each selectedKeisanTemplates as keisanTemplate, index}
          <div>
            <span> {index + 1}. </span>
            <KeisanCard data={keisanTemplate} showAnswer={true} {isTrialInProgress} />
          </div>
        {/each}
      </div>
    {:else if addedReward}
      <span> また明日挑戦してね！ </span>
    {:else}
      <span> 範囲を選択して、出題ボタンをクリック！ </span>
    {/if}
  {/if}
</div>
