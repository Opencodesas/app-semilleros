<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import customVisit from './customVisit/Index.vue'
import visit from './visit/Index.vue'

const route = useRoute()

const { isProvider } = useProvider()
const router = useRouter()

</script>

<template>
    <TabGroup>
        <TabList class="py-5">
            <Tab as="template" v-slot="{ selected }">
                <button 
                    :class="{ 'inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none': selected, 'inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300': !selected }">
                    Visitas
                </button>
            </Tab>
            <Tab as="template" v-slot="{ selected }">
                <button 
                    :class="{ 'inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none': selected, 'inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300': !selected }">
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
