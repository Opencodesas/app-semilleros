<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import { onboardingStore } from '@/stores/onboardingStore'
import FormSwitch from "@/base-components/Form/FormSwitch";
import { filePondValue } from '@/composables/useFilepondEvents';
import Swal from 'sweetalert2';
import { visitServices } from '@/services/psychosocial/visitServices';
const { multiple } = useFilepondEvents();

const store = onboardingStore();

const route = useRoute();
const router = useRouter();

const form = reactive({
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
    status: '4', //id:4 => Rechazado => REC cambiamos si queremos ver otra vista
    reason: 'Fue rechazado por...',
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

const dataLoaded = ref(false)

const getData = async () => {

    await visitServices.get(route.params.id as string).then((response) => {
        console.log(response?.data.items);
        if (response?.status == 200 || response?.status == 201) {
            form.reason = response.data.items.reason;
            form.date_visit = response.data.items.date_visit;
            form.municipality_id = response.data.items.municipality_id;
            form.monitor_id = response.data.items.monitor_id;
            form.discipline_id = response.data.items.discipline_id;
            form.numberBeneficiary = response.data.items.numberBeneficiary;
            form.sports_scene = response.data.items.sports_scene;
            form.objetive = response.data.items.objetive;
            form.beneficiaries_knows_project = response.data.items.beneficiaries_knows_project;
            form.beneficiaries_knows_monthly_value = response.data.items.beneficiaries_knows_monthly_value;
            form.monitor_organization_discipline_management = response.data.items.monitor_organization_discipline_management;
            form.description = response.data.items.description;
            form.observations = response.data.items.observations;
            form.file = response.data.items.file;
            form.status = response.data.items.status;
        } else {
            alerts.custom("", "No se pudieron obtener los datos", "error");
        }
        console.log(form);
    })
};

onMounted(async () => {
    await fetch();
    await getData();
    dataLoaded.value = true;
});

const onSubmit = async () => {
    const valid = await v$.value.$validate()
    if (valid) {
        form.status = '3';
        form.reason = '';
        await visitServices.update(route.params.id as string, formdataParser(form)).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    alerts.update()
                    setLoading(true)
                    router.push('psychosocial.visits').finally(() => {
                        setLoading(false)
                    })
                }
            }
        })
    }
    else {
        alerts.validation()
    }
}

const download = () => {

}

const disableElements = computed(() => {
    return form.status == '4' ? false : true; //id: 4 => Rechazado => REC
})

</script>

<template>
    <div class="flex items-center justify-between mt-8 intro-y">
        <div class="flex items-center space-x-4">
            <CommonBackButton :to="'psychosocial.visits'" title="Listado" />
            <h2 v-if="form.status == '4'" class="mr-auto text-lg font-medium">Editar visita</h2>
            <h2 v-else class="mr-auto text-lg font-medium">Vista visita</h2>
        </div>
    </div>

    <div v-if="dataLoaded" class="p-5 pt-1 mt-5 intro-y box">
        <div v-if="form.status == '4'">
            <h2 class="text-red-600 font-bold py-2">Razón de rechazo</h2>
            <p class="text-left">{{ form.reason }}</p>
        </div>
        <form @submit.prevent="onSubmit" class="space-y-8 divide-y divide-slate-200">
            <div class="space-y-8 divide-y divide-slate-200">

                <div :class="disableElements == false ? 'mt-6' : 'mt-3'" class="grid grid-cols-2 gap-y-6 gap-x-4">
                    <CommonInput :disabled="disableElements" type="date" label="Fecha *" name="date_visit"
                        v-model="form.date_visit" :validator="v$" />
                    <CommonSelect :disabled="disableElements" label="Municipio *" name="municipality_id"
                        v-model="form.municipality_id" :validator="v$" :options="municipalities" />
                    <CommonSelect :disabled="disableElements" label="Monitor Deportivo *" name="monitor_id"
                        v-model="form.monitor_id" :validator="v$" :options="monitorList" />
                    <CommonSelect :disabled="disableElements" label="Disciplinas *" name="discipline_id"
                        v-model="form.discipline_id" :validator="v$" :options="disciplinesList" />
                    <CommonInput :disabled="disableElements" type="number" label="No. Beneficiarios en el campo *"
                        placeholder="Escriba..." name="numberBeneficiary" v-model="form.numberBeneficiary"
                        :validator="v$" />
                    <CommonInput :disabled="disableElements" type="text" label="Escenario Deportivo *"
                        placeholder="Escriba..." name="sports_scene" v-model="form.sports_scene" :validator="v$" />
                    <div class="col-span-2 sm:grid-cols-3">
                        <CommonInput :disabled="disableElements" label="Objetivo del acompañamiento *"
                            placeholder="Escriba..." name="objetive" v-model="form.objetive" :validator="v$" />
                    </div>
                    <div class="p-5 intro-y box col-span-2 sm:grid-cols-3 bg-gray-200 flex flex-col gap-3">
                        <div class="">

                            <FormSwitch.Input :disabled="disableElements" name="beneficiaries_knows_project"
                                id="beneficiaries_knows_project" type="checkbox" v-model="form.beneficiaries_knows_project"
                                :validator="v$" />
                            <FormSwitch.Label class="text-sm" htmlFor="beneficiaries_knows_project"> ¿LOS BENEFICIARIOS
                                RECONOCEN EL NOMBRE
                                DEL
                                PROYECTO? </FormSwitch.Label>
                        </div>
                        <div class="">

                            <FormSwitch.Input :disabled="disableElements" name="beneficiaries_knows_monthly_value"
                                id="beneficiaries_knows_monthly_value" type="checkbox"
                                v-model="form.beneficiaries_knows_monthly_value" :validator="v$" />
                            <FormSwitch.Label htmlFor="beneficiaries_knows_monthly_value"> ¿LOS BENEFICIARIOS RECONOCEN EL
                                VALOR DESARROLLADO
                                EN EL MES? </FormSwitch.Label>
                        </div>
                        <div class="">

                            <FormSwitch.Input :disabled="disableElements" name="monitor_organization_discipline_management"
                                id="monitor_organization_discipline_management" type="checkbox"
                                v-model="form.monitor_organization_discipline_management" :validator="v$" />
                            <FormSwitch.Label htmlFor="monitor_organization_discipline_management"> ¿SE OBSERVA
                                ORGANIZACIÓN, DISCIPLINA Y BUEN MANEJO
                                DE GRUPO DURANTE LAS SESIONES DE CLASE DEL MONITOR? </FormSwitch.Label>
                        </div>
                    </div>
                    <div class="col-span-2 sm:grid-cols-3">
                        <CommonTextarea :disabled="disableElements" label="Descripción de actividades *"
                            placeholder="Escriba..." name="description" rows="5" v-model="form.description"
                            :validator="v$" />
                    </div>
                    <div class="col-span-2 sm:grid-cols-3">
                        <CommonTextarea :disabled="disableElements" label="Observaciones *" placeholder="Escriba..."
                            name="observations" rows="5" v-model="form.observations" :validator="v$" />
                    </div>

                    <div class="grid justify-center col-span-2 gap-10 p-5">
                        <h1 class="text-center font-bold">Evidencia</h1>
                        <!-- <img v-if="form.file" :src="form.file[0]" alt=""> -->
                        <img src="/semilleros.png" width="200" alt="">
                    </div>

                    <div v-if="form.status == '4'" class="col-span-2 p-5 mt-6 intro-y">
                        <CommonFile :validator="v$" v-model="form.file" name="file"
                            class="w-11/12 sm:w-8/12 m-auto cursor-pointer" :accept-multiple="false"
                            @addfile="(error: any, value: filePondValue) => { form.file = multiple.addfile({ error, value }, form.file) as never[] }"
                            @removefile="(error: any, value: filePondValue) => { form.file = multiple.removefile({ error, value }, form.file) as never[] }" />
                    </div>
                </div>

            </div>
            <div class="pt-5">
                <div class="flex justify-center gap-x-4">
                    <Button v-if="form.status == '4'" type="submit" variant="primary">
                        Editar visita
                    </Button>

                    <Button v-else-if="form.status == '1'" type="button" variant="primary" @click="download">
                        Descargar visita
                    </Button>
                </div>
            </div>
        </form>
    </div>
</template>