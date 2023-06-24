<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import FormSwitch from "@/base-components/Form/FormSwitch";
import { visitServices } from '@/services/psychosocial/visitServices';

const route = useRoute();
const router = useRouter();
const urlStorage = `${import.meta.env.VITE_BASE_URL}/storage/`;

const form = reactive({
    date_visit: '',
    municipalities_id: '',
    monitor: '',
    diciplines_id: '',
    number_beneficiaries: '',
    scenery: '',
    objetive: '',
    beneficiaries_recognize_name: '',
    beneficiary_recognize_value: '',
    all_ok: '',
    description: '',
    observations: '',
    file: [],
    status_id: '',
    rejection_message: '',
});
const form_rules = computed(() => ({
    date_visit: { required },
    municipalities_id: { required },
    monitor: { required },
    diciplines_id: { required },
    number_beneficiaries: { required },
    scenery: { required },
    objetive: { required },
    beneficiaries_recognize_name: { required },
    beneficiary_recognize_value: { required },
    all_ok: { required },
    description: { required },
    observations: { required },
}));

const file: any = ref(null);
const formdataParser = (form: any) => {
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
    });
    return formData;
};
const selectFile = (event: any) => {
    form.file = event.target.files[0];
}

const municipalities = asyncComputed(async () => {
    return await getSelect(['municipalities'])
}, null)

const monitorList = asyncComputed(async () => {
    let response =await getMonitorByAuth()
    return response
    // return await getMonitorByMunicipality(form.municipalities_id); 
}, null);

const disciplinesList = asyncComputed(async () => {
    return await getDisciplinesByMonitor(form.monitor)
}, null)

watch(() => form.municipalities_id, (newVal, oldVal) => {
    if (dataLoaded.value) {
        form.monitor = '';
    }
})

watch(() => form.monitor, (newVal, oldVal) => {
    if (dataLoaded.value) {
        form.diciplines_id = '';
    }
})

const v$ = useVuelidate(form_rules, form)

const dataLoaded = ref(false)

const getData = async () => {

    await visitServices.get(route.params.id as string).then((response) => {
        if (response?.status == 200 || response?.status == 201) {
            form.rejection_message = response.data.items.rejection_message;
            form.date_visit = response.data.items.date_visit;
            form.municipalities_id = response.data.items.municipalities_id;
            form.monitor = response.data.items.monitor_id;
            form.diciplines_id = response.data.items.discipline.id;
            form.number_beneficiaries = response.data.items.number_beneficiaries;
            form.scenery = response.data.items.scenery;
            form.objetive = response.data.items.objetive;
            form.beneficiaries_recognize_name = response.data.items.beneficiaries_knows_project;
            form.beneficiary_recognize_value = response.data.items.beneficiaries_knows_monthly_value;
            form.all_ok = response.data.items.monitor_organization_discipline_management;
            form.description = response.data.items.description;
            form.observations = response.data.items.observations;
            file.value = response.data.items.file;
            form.status_id = response.data.items.status.id;
        } else {
            alerts.custom("", "No se pudieron obtener los datos", "error");
        }
    })
};

onMounted(async () => {
    await getData();
    dataLoaded.value = true;
});

const onSubmit = async () => {
    const valid = await v$.value.$validate()
    if (valid) {
        await visitServices.update(route.params.id as string, formdataParser(form)).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    alerts.update()
                    setLoading(true)
                    router.push({ name: 'psychosocial.visits' }).finally(() => {
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

const download = async () => {
	return await visitServices.download(route.params.id as string).then((res) => {
		if (res) {
			if (res.status >= 200 && res.status <= 300) {
				downloadFile(res);
			}
		}
	});
};

const disableElements = computed(() => {
    return form.status_id == '4' ? false : true;
})

</script>

<template>
    <div class="flex items-center justify-between mt-8 intro-y">
        <div class="flex items-center space-x-4">
            <CommonBackButton :to="'psychosocial.visits'" title="Listado" />
            <h2 v-if="form.status_id == '4'" class="mr-auto text-lg font-medium">Editar visita</h2>
            <h2 v-else class="mr-auto text-lg font-medium">Vista visita</h2>
        </div>
    </div>

    <div v-if="dataLoaded" class="p-5 pt-1 mt-5 intro-y box">
        <div v-if="form.status_id == '4'">
            <h2 class="text-red-600 font-bold py-2">Razón de rechazo</h2>
            <p class="text-left">{{ form.rejection_message }}</p>
        </div>
        <form @submit.prevent="onSubmit" class="space-y-8 divide-y divide-slate-200">
            <div class="space-y-8 divide-y divide-slate-200">

                <div :class="disableElements == false ? 'mt-6' : 'mt-3'" class="grid grid-cols-2 gap-y-6 gap-x-4">
                    <CommonInput :disabled="disableElements" type="date" label="Fecha *" name="date_visit"
                        v-model="form.date_visit" :validator="v$" />
                    <CommonSelect :disabled="disableElements" label="Municipio *" name="municipalities_id"
                        v-model="form.municipalities_id" :validator="v$" :options="municipalities" />
                    <CommonSelect :disabled="disableElements" label="Monitor Deportivo *" name="monitor"
                        v-model="form.monitor" :validator="v$" :options="monitorList" />
                    <CommonSelect :disabled="disableElements" label="Disciplinas *" name="diciplines_id"
                        v-model="form.diciplines_id" :validator="v$" :options="disciplinesList" />
                    <CommonInput :disabled="disableElements" type="number" min="0" label="No. Beneficiarios en el campo *"
                        placeholder="Escriba..." name="number_beneficiaries" v-model="form.number_beneficiaries"
                        :validator="v$" />
                    <CommonInput :disabled="disableElements" type="text" label="Escenario Deportivo *"
                        placeholder="Escriba..." name="scenery" v-model="form.scenery" :validator="v$" />
                    <div class="col-span-2 sm:grid-cols-3">
                        <CommonInput :disabled="disableElements" label="Objetivo del acompañamiento *"
                            placeholder="Escriba..." name="objetive" v-model="form.objetive" :validator="v$" />
                    </div>
                    <div class="p-5 intro-y box col-span-2 sm:grid-cols-3 bg-gray-200 flex flex-col gap-3">
                        <div class="">

                            <FormSwitch.Input :disabled="disableElements" name="beneficiaries_recognize_name"
                                id="beneficiaries_recognize_name" type="checkbox"
                                v-model="form.beneficiaries_recognize_name" :validator="v$" />
                            <FormSwitch.Label class="text-sm" htmlFor="beneficiaries_recognize_name"> ¿LOS BENEFICIARIOS
                                RECONOCEN EL NOMBRE
                                DEL
                                PROYECTO? </FormSwitch.Label>
                        </div>
                        <div class="">

                            <FormSwitch.Input :disabled="disableElements" name="beneficiary_recognize_value"
                                id="beneficiary_recognize_value" type="checkbox" v-model="form.beneficiary_recognize_value"
                                :validator="v$" />
                            <FormSwitch.Label htmlFor="beneficiary_recognize_value"> ¿LOS BENEFICIARIOS RECONOCEN EL
                                VALOR DESARROLLADO
                                EN EL MES? </FormSwitch.Label>
                        </div>
                        <div class="">

                            <FormSwitch.Input :disabled="disableElements" name="all_ok" id="all_ok" type="checkbox"
                                v-model="form.all_ok" :validator="v$" />
                            <FormSwitch.Label htmlFor="all_ok"> ¿SE OBSERVA
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
                        <img :alt="`Evidencia de la visita personalizada`" class="m-auto border rounded-lg"
                            :src="`${urlStorage}${file}`" width="400" />
                    </div>

                    <div v-if="form.status_id == '4'" class="col-span-2 p-5 mt-6 intro-y">
                        <CommonFile v-if="form.status_id == '4'" v-model="form.file" name="file"
                            class="w-11/12 sm:w-8/12 m-auto cursor-pointer" @change="selectFile" />
                    </div>
                </div>

            </div>
            <div class="pt-5">
                <div class="flex justify-center gap-x-4">
                    <Button v-if="form.status_id == '4'" type="submit" variant="primary">
                        Editar visita
                    </Button>

                    <Button v-else-if="form.status_id == '1'" type="button" variant="primary" @click="download">
                        Descargar visita
                    </Button>
                </div>
            </div>
        </form>
    </div>
</template>