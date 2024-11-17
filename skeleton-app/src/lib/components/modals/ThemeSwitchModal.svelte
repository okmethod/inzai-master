<script lang="ts">
  import { getModalStore } from "@skeletonlabs/skeleton";
  import { SlideToggle } from "@skeletonlabs/skeleton";
  import type { ThemeName } from "$lib/stores/theme";
  import { themeLabels, getTheme, setTheme } from "$lib/stores/theme";

  export let parent;

  let currentTheme = getTheme().name;
  let isDarkMode = getTheme().dark;

  function setCurrentTheme() {
    setTheme({ name: currentTheme, dark: isDarkMode });
  }

  function handleThemeSwitch(themeName: ThemeName) {
    currentTheme = themeName;
    setCurrentTheme();
  }

  const modalStore = getModalStore();

  function closeModal() {
    modalStore.close();
  }

  $: cButtonColor = (theme: string) =>
    theme === currentTheme ? "variant-filled-primary" : "variant-filled cMonoButton";
</script>

{#if $modalStore[0]}
  <div class="p-2 md:p-4 rounded shadow-2xl cSurfaceBg" data-parent={parent}>
    <div class="relative pt-10">
      <div class="flex flex-col items-center space-y-2">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          {#each themeLabels as themeLabel}
            <button
              type="button"
              class="btn border {cButtonColor(themeLabel.name)}"
              on:click={() => {
                handleThemeSwitch(themeLabel.name);
              }}
            >
              <div class="h-6 min-w-40 flex items-center justify-start">
                <span class="w-8">{themeLabel.emoji}</span>
                <span class="">{themeLabel.name}</span>
              </div>
            </button>
          {/each}
        </div>
        <SlideToggle
          name="slide"
          bind:checked={isDarkMode}
          on:change={setCurrentTheme}
          background="cPrimaryBg"
          active="cPrimaryBg"
          border="border cSurfaceBorder"
          class="px-2 py-1"
        >
          {isDarkMode ? "ダークモード" : "ライトモード"}
        </SlideToggle>
      </div>
      <p class="text-xl absolute top-0 left-1/2 transform -translate-x-1/2 z-10">テーマ切り替え</p>
      <button
        type="button"
        class="btn-icon btn-icon-sm !bg-transparent absolute top-0 right-0 z-10"
        on:click={closeModal}
      >
        ✕
      </button>
    </div>
  </div>
{/if}
