<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import FormSwitch from "@/base-components/Form/FormSwitch";
import { filePondValue } from '@/composables/useFilepondEvents';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import CustomVisit from './visits_type/Custom-visit.vue'
import { customVisitServices } from '@/services/psychosocial/customVisitServices';


const { multiple } = useFilepondEvents();

const form = reactive({
    month: '',
    municipality: '',
    beneficiary: '',
    objetive: '',
    theme: '',
    agreements: '',
    concept: '0',
    swich_guardian_knows: false,
    file: [],

})


// const form_rules = computed(() => ({
//     month: { required },
//     municipality: { required },
//     beneficiary: { required },
//     objetive: { required },
//     theme: { required },
//     agreements: { required },
//     concept: {},
//     swich_guardian_knows: { required },
//     file: [],
// }))

const months = asyncComputed(async () => {
    return await getSelect(['months'])
}, null)

const cities = asyncComputed(async () => {
    return await getSelect(['municipalities'])
}, null)

const municipality_id = computed(() => form.municipality)

// const beneficiaries = asyncComputed(async () => {
//     return municipality_id.value ? await getBeneficiariesByMunicipaly(municipality_id.value) : []
//  }, null)

// const beneficiary_data = asyncComputed(async () => {
//     return form.beneficiary ? await getBeneficiaryData(form.beneficiary) : null
// }, null)
//      |
//    grade: '',
//     health_entity: '',
//     guardian_name: '',
//     guardian_lastname: '',
//     guardian_identification: '',
//     

//const v$ = useVuelidate(form_rules, form)

const { isProvider } = useProvider()
const router = useRouter()


</script>

<template>
    <div class="flex items-center justify-between mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Registrar visita personalizada</h2>
    </div>

    <TabGroup>
        <TabList>
            <!-- Use the `selected` state to conditionally style the selected tab. -->
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
            <TabPanel>Content 1</TabPanel>
            <TabPanel>
                <CustomVisit />
            </TabPanel>
        </TabPanels>
    </TabGroup>
</template>
