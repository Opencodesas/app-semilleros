<script setup lang="ts">
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue';

import visits from '../visit/Index.vue';
import cutomVisits from '../custom-visit/Index.vue';
import transversalActivities from '../transversal-activity/Index.vue';

const selectedTab = ref(1);
provide('selectedTab', selectedTab);

</script>

<template>
	<TabGroup>
		<TabList class="pt-5">
			<Tab
				as="template"
				v-slot="{ selected }">
				<button
					@click="selectedTab = 1"
					:class="{
						'select-none inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none':
							selected,
						'select-none inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300':
							!selected,
					}">
					Visitas
				</button>
			</Tab>
			<Tab
				as="template"
				v-slot="{ selected }">
				<button
					@click="selectedTab = 2"
					:class="{
						'select-none inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none':
							selected,
						'select-none inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300':
							!selected,
					}">
					Visitas Personalizadas
				</button>
			</Tab>
			<Tab
				as="template"
				v-slot="{ selected }">
				<button
					@click="selectedTab = 3"
					:class="{
						'select-none inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none':
							selected,
						'select-none inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300':
							!selected,
					}">
					Actividades Transversales
				</button>
			</Tab>
		</TabList>
		<TabPanels>
			<TabPanel>
				<visits />
			</TabPanel>
			<TabPanel>
				<cutomVisits />
			</TabPanel>
			<TabPanel>
				<transversalActivities />
			</TabPanel>
		</TabPanels>
	</TabGroup>
</template>
