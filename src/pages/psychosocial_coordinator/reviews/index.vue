<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import customVisit from "./customVisit/Index.vue";
import visit from "./visit/Index.vue";

const selectedTab = ref(0);
// provide('selectedTab', selectedTab);
const tabOptions = {
  visits: 0,
  visits_custom: 1,
};

const currentPath = "/dashboard/psychosocial-coordinator/reviews";

const route = useRoute();
const router = useRouter();

function changeTab(index: any) {
  selectedTab.value = index;
  const hashOptions = Object.keys(tabOptions);
  const selectedHash = hashOptions[index];
  const routePath = `${currentPath}/#` + selectedHash;
  router.push(routePath);
}

onMounted(() => {
  if (route.hash) {
    const hashOptions = Object.keys(tabOptions);
    const selectedHash = hashOptions.find((hash) => route.hash === `#${hash}`);
    if (selectedHash) {
      selectedTab.value = tabOptions[selectedHash as keyof typeof tabOptions];
    } else {
      selectedTab.value = 0;
      router.push(`${currentPath}/#visits`);
    }
  } else {
    selectedTab.value = 0;
    router.push(`${currentPath}/#visits`);
  }
});
</script>

<template>
  <TabGroup :selectedIndex="selectedTab" @change="changeTab">
    <TabList class="py-5">
      <Tab as="template" v-slot="{ selected }">
        <button
          :class="{
            'inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none':
              selected,
            'inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300':
              !selected,
          }"
        >
          Visitas
        </button>
      </Tab>
      <Tab as="template" v-slot="{ selected }">
        <button
          :class="{
            'inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none':
              selected,
            'inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300':
              !selected,
          }"
        >
          Visitas Personalizadas
        </button>
      </Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
        <visit />
      </TabPanel>
      <TabPanel>
        <customVisit />
      </TabPanel>
    </TabPanels>
  </TabGroup>
</template>
