<script setup lang="ts">
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/vue";
import Coordinator from "./coordinator/Index.vue";
import Methodologist from "./methodologist/Index.vue";
import Cronograma from "@/pages/methodologist/reviews/chronograms/Index.vue";

const form = reactive({
  month: "",
  municipality: "",
  beneficiary: "",
  objetive: "",
  theme: "",
  agreements: "",
  concept: "0",
  swich_guardian_knows: false,
  file: [],
});

const months = asyncComputed(async () => {
  return await getSelect(["months"]);
}, null);

const cities = asyncComputed(async () => {
  return await getSelect(["municipalities"]);
}, null);

const municipality_id = computed(() => form.municipality);

const { isProvider } = useProvider();

const tabOptions = {
  methodologists: 0,
  coordinators: 1,
  chronogram: 2,
};

const selectedTab = ref(0);

const currentPath = "/dashboard/subdirector/review";

const route = useRoute();
const router = useRouter();

function changeTab(index: any) {
  selectedTab.value = index;
  const hashOptions = Object.keys(tabOptions);
  const selectedHash = hashOptions[index];
  const routePath = `${currentPath}/#` + selectedHash;
  router.replace(routePath);
}

if (route.hash) {
  const hashOptions = Object.keys(tabOptions);
  const selectedHash = hashOptions.find((hash) => route.hash === `#${hash}`);
  if (selectedHash) {
    selectedTab.value = tabOptions[selectedHash as keyof typeof tabOptions];
  } else {
    selectedTab.value = 0;
    router.push(`${currentPath}/#methodologists`);
  }
} else {
  selectedTab.value = 0;
  router.push(`${currentPath}/#methodologists`);
}
</script>

<template>
  <div class="flex items-center justify-between mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Listado de visitas</h2>
  </div>

  <TabGroup :selectedIndex="selectedTab" @change="changeTab">
    <TabList>
      <!-- Use the `selected` state to conditionally style the selected tab. -->
      <Tab as="template" v-slot="{ selected }">
        <button
          :class="{
            'inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none':
              selected,
            'inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300':
              !selected,
          }"
        >
          Metodologos
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
          Coordinadores
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
          Cronograma
        </button>
      </Tab>
    </TabList>
    <TabPanels>
      <TabPanel><Methodologist /></TabPanel>
      <TabPanel><Coordinator /></TabPanel>
      <TabPanel><Cronograma /></TabPanel>
    </TabPanels>
  </TabGroup>
</template>
