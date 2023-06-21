<script setup lang="ts">
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/vue";
import Cronograma from "../methodologist/reviews/chronograms/Index.vue";
import Fichas from "./Index.vue";
import { onboardingStore } from "@/stores/onboardingStore";

const tabOptions = {
  beneficiary: 0,
  chronogram: 1,
};

const selectedTab = ref(0);

const currentPath = "/dashboard/review";

const route = useRoute();
const router = useRouter();

function changeTab(index) {
  selectedTab.value = index;
  const hashOptions = Object.keys(tabOptions);
  const selectedHash = hashOptions[index];
  const routePath = `${currentPath}/#` + selectedHash;
  router.replace(routePath);
}

onMounted(() => {
  if (route.hash) {
    const hashOptions = Object.keys(tabOptions);
    const selectedHash = hashOptions.find((hash) => route.hash === `#${hash}`);
    if (selectedHash) {
      selectedTab.value = tabOptions[selectedHash];
    } else {
      selectedTab.value = 0;
      router.push(`${currentPath}/#beneficiary`);
    }
  } else {
    selectedTab.value = 0;
    router.push(`${currentPath}/#beneficiary`);
  }
});
</script>

<template>
  <div class="flex items-center justify-between mt-8 intro-y">
    <!--<h2 class="mr-auto text-lg font-medium"></h2>-->
  </div>
  <TabGroup :selectedIndex="selectedTab" @change="changeTab">
    <TabList>
      <Tab as="template" v-slot="{ selected }">
        <button
          :class="{
            'inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none':
              selected,
            'inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300':
              !selected,
          }"
        >
          Beneficiarios
        </button>
      </Tab>
      <Tab
        v-if="
          onboardingStore().get_user_role?.slug != 'asistente_administrativo'
        "
        as="template"
        v-slot="{ selected }"
      >
        <button
          :class="{
            'inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none':
              selected,
            'inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300':
              !selected,
          }"
        >
          Cronograma
        </button>
      </Tab>
    </TabList>

    <TabPanels>
      <TabPanel> <Fichas /> </TabPanel>
      <TabPanel
        v-if="
          onboardingStore().get_user_role?.slug != 'asistente_administrativo'
        "
      >
        <Cronograma />
      </TabPanel>
    </TabPanels>
  </TabGroup>
</template>
