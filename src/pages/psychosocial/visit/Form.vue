<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import { onboardingStore } from '@/stores/onboardingStore'
import CommonFile from '@/components/CommonFile.vue'
import FormSwitch from "@/base-components/Form/FormSwitch";
import { filePondValue } from '@/composables/useFilepondEvents';
import Swal from 'sweetalert2';
const { multiple } = useFilepondEvents();
const store = onboardingStore();
const form = reactive({
    status_id: '2',
    date_visit: '',
    municipality_id: '',
    monitor_id: '',
    discipline_id: '',
    numberBeneficiary: '',
    sports_scene: '',
    objetive: '',
    beneficiaries_knows_project: false,
    beneficiaries_knows_monthly_value: false,
    monitor_organization_discipline_management: false,
    description: '',
    observations: '',
    file: [],
    //created_by: store.user.id,
});
const form_rules = computed(() => ({
    date_visit: { required },
    municipality_id: { required },
    monitor_id: { required },
    discipline_id: { required },
    numberBeneficiary: { required },
    sports_scene: { required },
    objetive: { required },
    beneficiaries_knows_project: { required },
    beneficiaries_knows_monthly_value: { required },
    monitor_organization_discipline_management: { required },
    description: { required },
    observations: { required },
    file: { required },
}));
const municipalities = ref([]);
const disciplinesList = ref([]);
const monitorList = [
    { label: "Joselito", value: 1 },
    { label: "Miguelito", value: 2 },
];
const v$ = useVuelidate(form_rules, form)
const { isProvider } = useProvider()
const router = useRouter()
const fetch = async () => {
    await store.getListSelect().then((response) => {
        console.log(`data fetch: ${response?.data}`);
        if (response?.status == 200 || response?.status == 201) {
            municipalities.value = JSON.parse(JSON.stringify(response.data["municipalities"]));
            disciplinesList.value = JSON.parse(JSON.stringify(response.data["diciplines"]));
        } else {
            Swal.fire("", "No se pudieron obtener los datos", "error");
        }
    });
};
onMounted(() => {
    fetch();
});
const onSubmit = async () => {
    const valid = await v$.value.$validate()
    alerts.create()
    /*if (valid) {
        await contractorServices.create(formdataParser(form)).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    alerts.create()
                    setLoading(true)
                    if (isProvider('assistants')) {
                        router.push('').finally(() => {
                            setLoading(false)
                        })
                    }
                    else {
                        router.push('').finally(() => {
                            setLoading(false)
                        })
                    }
                }
            }
        })
    }
    else {
        alerts.validation()
    }*/
}
</script>

<template>
    <div class="flex items-center justify-between mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Registrar Visita</h2>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <form @submit.prevent="onSubmit" class="space-y-8 divide-y divide-slate-200">
            <div class="space-y-8 divide-y divide-slate-200">

                <div class="grid grid-cols-2 gap-y-6 gap-x-4">
                    <CommonInput type="date" label="Fecha *" name="date_visit" v-model="form.date_visit" :validator="v$" />
                    <CommonSelect label="Municipio *" name="municipality_id" v-model="form.municipality_id" :validator="v$"
                        :options="municipalities" />
                    <CommonSelect label="Monitor Deportivo *" name="monitor_id" v-model="form.monitor_id" :validator="v$"
                        :options="monitorList" />
                    <CommonSelect label="Disciplinas *" name="discipline_id" v-model="form.discipline_id" :validator="v$"
                        :options="disciplinesList" />
                    <CommonInput type="number" min="0" label="No. Beneficiarios en el campo *" placeholder="Escriba..."
                        name="numberBeneficiary" v-model="form.numberBeneficiary" :validator="v$" />
                    <CommonInput type="text" label="Escenario Deportivo *" placeholder="Escriba..." name="sports_scene"
                        v-model="form.sports_scene" :validator="v$" />
                    <div class="col-span-2 sm:grid-cols-3">
                        <CommonInput label="Objetivo del acompañamiento *" placeholder="Escriba..." name="objetive"
                            v-model="form.objetive" :validator="v$" />
                    </div>
                    <div class="p-5 intro-y box col-span-2 sm:grid-cols-3 bg-gray-200 flex flex-col gap-3">
                        <div class="">

                            <FormSwitch.Input name="beneficiaries_knows_project" id="beneficiaries_knows_project"
                                type="checkbox" v-model="form.beneficiaries_knows_project" :validator="v$" />
                            <FormSwitch.Label class="text-sm" htmlFor="beneficiaries_knows_project"> ¿LOS BENEFICIARIOS
                                RECONOCEN EL NOMBRE
                                DEL
                                PROYECTO? </FormSwitch.Label>
                        </div>
                        <div class="">

                            <FormSwitch.Input name="beneficiaries_knows_monthly_value"
                                id="beneficiaries_knows_monthly_value" type="checkbox"
                                v-model="form.beneficiaries_knows_monthly_value" :validator="v$" />
                            <FormSwitch.Label htmlFor="beneficiaries_knows_monthly_value"> ¿LOS BENEFICIARIOS RECONOCEN EL
                                VALOR DESARROLLADO
                                EN EL MES? </FormSwitch.Label>
                        </div>
                        <div class="">

                            <FormSwitch.Input name="monitor_organization_discipline_management"
                                id="monitor_organization_discipline_management" type="checkbox"
                                v-model="form.monitor_organization_discipline_management" :validator="v$" />
                            <FormSwitch.Label htmlFor="monitor_organization_discipline_management"> ¿SE OBSERVA
                                ORGANIZACIÓN, DISCIPLINA Y BUEN MANEJO
                                DE GRUPO DURANTE LAS SESIONES DE CLASE DEL MONITOR? </FormSwitch.Label>
                        </div>
                    </div>
                    <div class="col-span-2 sm:grid-cols-3">
                        <CommonTextarea label="Descripción de actividades *" placeholder="Escriba..." name="description"
                            rows="5" v-model="form.description" :validator="v$" />
                    </div>
                    <div class="col-span-2 sm:grid-cols-3">
                        <CommonTextarea label="Observaciones *" placeholder="Escriba..." name="observations" rows="5"
                            v-model="form.observations" :validator="v$" />
                    </div>

                    <div class="col-span-2 p-5 mt-6 intro-y">
                        <CommonDropzone name="file"
                        class="w-11/12 sm:w-8/12 m-auto cursor-pointer"
                        :accept-multiple="false"
                            v-model="form.file"
                            @addfile="(error: any, value: filePondValue) => { form.file = multiple.addfile({ error, value }, form.file) as never[] }"
                            @removefile="(error: any, value: filePondValue) => { form.file = multiple.removefile({ error, value }, form.file) as never[] }"
                            :validator="v$" />
                    </div>
                </div>

            </div>
            <div class="pt-5">
                <div class="flex justify-center gap-x-4">
                    <Button type="submit" variant="primary">
                        Registrar
                    </Button>
                </div>
            </div>
        </form>
    </div>
</template>