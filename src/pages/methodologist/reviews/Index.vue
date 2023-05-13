<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import RegistrationForms from './registrationForms/Index.vue'
import Chronograms from './chronograms/Index.vue'

</script>

<template>
    <TabGroup>
        <TabList class="py-5">
            <Tab as="template" v-slot="{ selected }">
                <button 
                    :class="{ 'inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none': selected, 'inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300': !selected }">
                    Fichas de Inscripción
                </button>
            </Tab>
            <Tab as="template" v-slot="{ selected }">
                <button 
                    :class="{ 'inline-block p-2 text-slate-800 font-medium dark:text-slate-400 border-b-2 border-b-primary rounded-t-lg active outline-none': selected, 'inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300': !selected }">
                    Cronogramas
                </button>
            </Tab>
        </TabList>
        <TabPanels>
            <TabPanel>
                <RegistrationForms />
            </TabPanel>
            <TabPanel>
                <Chronograms />
            </TabPanel>
        </TabPanels>
    </TabGroup>
</template>
