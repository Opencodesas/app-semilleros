<script setup lang="ts">
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue';
import Cronograma from '../methodologist/reviews/chronograms/Index.vue';
import Fichas from './Index.vue';

</script>

<template>
    <div class="flex items-center justify-between mt-8 intro-y">
		<!--<h2 class="mr-auto text-lg font-medium"></h2>-->
	</div>
    <TabGroup>
		<TabList> 
			<Tab as="template" v-slot="{ selected }">
				<button
					:class="{
						'inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none':
							selected,
						'inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300':
							!selected,
					}">
					Beneficiarios
				</button>
			</Tab>
			<Tab as="template" v-slot="{ selected }">
				<button
					:class="{
						'inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none':
							selected,
						'inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300':
							!selected,
					}">
					Cronograma
				</button>
			</Tab>
		</TabList>

		<TabPanels>
			<TabPanel> <Fichas/> </TabPanel>
			<TabPanel> <Cronograma/> </TabPanel>
		</TabPanels>
	</TabGroup>
</template>
