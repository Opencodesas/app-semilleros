<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import FormSwitch from "@/base-components/Form/FormSwitch";
import { filePondValue } from '@/composables/useFilepondEvents';
import { customVisitServices } from '@/services/psychosocial/customVisitServices';
import { selectOption } from '@/components/CommonSelect.vue';

const { multiple } = useFilepondEvents();
const route = useRoute();
const urlStorage = `${import.meta.env.VITE_BASE_URL}/storage/`;

const form = reactive({
    month: '',
    municipality: '',
    beneficiary: '',
    theme: '',
    agreements: '',
    concept: '',
    guardian_knows_semilleros: true,
    file: [],
    status_id: '',
    rejection_message: '',
})


const form_rules = computed(() => ({
    month: { required },
    municipality: { required },
    beneficiary: { required },
    theme: { required },
    agreements: { required },
    concept: {},
    guardian_knows_semilleros: { required },
    file: [],
}))

const beneficiary_data = reactive({
    scholar_level: '',
    health_entity: '',
    guardian_name: '',
    guardian_lastname: '',
    guardian_identification: '',
})

const months = asyncComputed(async () => {
    return await getSelect(['months'])
}, null)

const municipalities = asyncComputed(async () => {
    return await getSelect(['municipalities'])
}, null)

const beneficiariesList = ref<selectOption[]>([]);

const getBeneficiariesByMunicipaly = async () => {
    await beneficiaryServices.getByDeparment(form.municipality as string).then((response) => {
        if (response?.status == 200 || response?.status == 201) {
            beneficiariesList.value = response?.data
            console.log(response?.data)
        }
    })
}

watch(() => form.municipality, (newVal, oldVal) => {
    console.log(newVal);
    if (newVal != null) getBeneficiariesByMunicipaly();
})

const dataLoaded = ref(false)

const getData = async () => {

    await customVisitServices.get(route.params.id as string).then((response) => {
        console.log(response?.data.items);
        if (response?.status == 200 || response?.status == 201) {
            form.rejection_message = response.data.items.rejection_message;
            form.month = response.data.items.month_id;
            form.municipality = response.data.items.municipality_id;
            form.beneficiary = response.data.items.beneficiary_id;
            form.theme = response.data.items.theme;
            form.agreements = response.data.items.agreements;
            form.concept = response.data.items.concept;
            form.guardian_knows_semilleros = response.data.items.guardian_knows_semilleros;
            form.file = response.data.items.file;
            form.status_id = response.data.items.status;
        } else {
            alerts.custom("", "No se pudieron obtener los datos", "error");
        }
        console.log(form);
    })
};


//Quitar cuando se ponga la relación
const healthEntities = computedAsync(async () => {
    return await getHealthentities();
}, null)

const getBeneficiaryData = async () => {
    await beneficiaryServices.get(form.beneficiary as string).then((response) => {
        console.log(response?.data.items);
        if (response?.status == 200 || response?.status == 201) {
            beneficiary_data.scholar_level = response.data.items.scholar_level ? scholarLevels[response.data.items.scholar_level - 1].label : 'No tiene';
            beneficiary_data.health_entity = response.data.items.health_entity_id ? healthEntities.value[response.data.items.health_entity_id - 1].label : 'No tiene';
            beneficiary_data.guardian_name = response.data.items.acudiente.firts_name;
            beneficiary_data.guardian_lastname = response.data.items.acudiente.last_name;
            beneficiary_data.guardian_identification = response.data.items.acudiente.cedula;
        } else {
            alerts.custom("", "No se pudieron obtener los datos", "error");
        }
    })
}

onMounted(async () => {
    await getData();
    await getBeneficiaryData();
    dataLoaded.value = true;
});

const v$ = useVuelidate(form_rules, form)

const router = useRouter()

const onSubmit = async () => {
    const valid = await v$.value.$validate()
    if (valid) {
        await customVisitServices.update(route.params.id as string, formdataParser(form)).then((response) => {
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
//Para cuando haya api para descargar el archivo
const download = () => {

}

const disableElements = computed(() => {
    return form.status_id == '4' ? false : true; //id: 4 => Rechazado => REC
})

const positionRange = computed(() => {
    const positionTooltip = (parseInt(form.concept) - 1) / (4);
    return `calc(${positionTooltip * 100}% - ${(2 * (parseInt(form.concept) - 1) ** 2) / 5 + 2 * (parseInt(form.concept) - 1)}px)`;
});
</script>

<template>
    <div class="flex items-center justify-between mt-8 intro-y">
        <div class="flex items-center space-x-4">
            <CommonBackButton :to="'psychosocial.visits'" title="Listado" />
            <h2 v-if="form.status_id == '4'" class="mr-auto text-lg font-medium">Editar visita personalizada</h2>
            <h2 v-else class="mr-auto text-lg font-medium">Vista visita personalizada</h2>
        </div>
    </div>

    <div v-if="dataLoaded" class="p-5 pt-1 mt-5 intro-y box">
        <div v-if="form.status_id == '4'">
            <h2 class="text-red-600 font-bold py-2">Razón de rechazo</h2>
            <p class="text-left">{{ form.rejection_message }}</p>
        </div>
        <form @submit.prevent="onSubmit" class="space-y-8 divide-y divide-slate-200">
            <div class="space-y-8 divide-y divide-slate-200 ">
                <div>

                    <div :class="disableElements == false ? 'mt-6' : 'mt-3'"
                        class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                        <CommonSelect :disabled="disableElements" label="Mes *" name="month" v-model="form.month"
                            :validator="v$" :options="months" />
                        <CommonSelect :disabled="disableElements" label="Municipio *" name="municipality"
                            v-model="form.municipality" :validator="v$" :options="municipalities" />
                        <CommonSelect @select="getBeneficiaryData" :disabled="disableElements" label="Beneficiario *"
                            name="beneficiary" v-model="form.beneficiary" :validator="v$" :options="beneficiariesList" />
                    </div>
                    <!-- cambiar condicion por "beneficiary_data" cuando haya función para traer los datos -->
                    <div v-if="form.beneficiary">
                        <!-- These inputs don't use the validator since they have data from the DB   cambiar los v-model-->
                        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <CommonInput disabled type="text" label="Grado de escolaridad" name="scholar_level"
                                v-model="beneficiary_data.scholar_level" />
                            <CommonInput disabled type="text" label="Entidad de salud" name="health_entity"
                                v-model="beneficiary_data.health_entity" />
                        </div>

                        <div class="mt-6 grid grid-cols-2 gap-y-6 gap-x-4 sm:grid-cols-3">
                            <CommonInput disabled type="text" label="Nombre del padre o acudiente" name="guardian.name"
                                v-model="beneficiary_data.guardian_name" />
                            <CommonInput disabled type="text" label="Apellido del padre o acudiente"
                                name="guardian.lastname" v-model="beneficiary_data.guardian_lastname" />
                            <CommonInput disabled type="text" label="Documento de identificación"
                                name="guardian.identification" v-model="beneficiary_data.guardian_identification" />
                        </div>
                    </div>
                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                        <div class="p-5 intro-y box col-span-3 sm:grid-cols-3 bg-gray-200 flex flex-col gap-3">
                            <div class="">

                                <FormSwitch.Input :disabled="disableElements" name="swich_plans" id="swich_plans"
                                    type="checkbox" v-model="form.guardian_knows_semilleros" :validator="v$" />
                                <FormSwitch.Label htmlFor="swich_plans"> ¿El padre o acudiente conoce el proyecto de
                                    Semilleros Deportivos?. </FormSwitch.Label>
                            </div>
                        </div>
                        <div class="col-span-3 sm:grid-cols-3 space-y-6 pt-5">
                            <CommonTextarea :disabled="disableElements"
                                label="Temáticas durante la visita: físico, emocional, familiar, escolar, social, espiritual *"
                                placeholder="Escriba..." name="theme" rows="5" v-model="form.theme" :validator="v$" />

                            <CommonTextarea :disabled="disableElements" label="Acuerdos y recomendaciones *"
                                placeholder="Escriba..." name="agreements" rows="5" v-model="form.agreements"
                                :validator="v$" />

                            <div class="grid col-span-3 justify-center">
                                <label for="range" class="text-xs">Concepto del padre o acudiente que atendió la visita en
                                    una
                                    escala de 1 a 5 donde 1 es deficiente y 5 excelente:
                                </label>
                                <div id="range" class="relative mb-5">
                                    <input :disabled="disableElements" class="w-full accent-primary" type="range" min="1"
                                        max="5" v-model="form.concept" />
                                    <div :style="{ left: positionRange }"
                                        class="absolute -translate-x-1/4 border-zinc-500 border-2 p-2  rounded-full bg-primary text-white select-none">
                                        {{ form.concept }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Comprobar qué es lo que se está enviando -->
                        <div class="grid justify-center col-span-3 gap-10 p-5">
                            <h1 class="text-center font-bold">Evidencia</h1>
                            <img :alt="`Evidencia de la visita del subdirector`" class="m-auto border rounded-lg"
                                :src="`${urlStorage}/${form.file}`" width="400" />
                        </div>

                        <div v-if="form.status_id == '4'" class="col-span-3 p-5 mt-6 intro-y">
                            <CommonFile :validator="v$" v-model="form.file" name="file"
                                class="w-11/12 sm:w-8/12 m-auto cursor-pointer" :accept-multiple="false"
                                @addfile="(error: any, value: filePondValue) => { form.file = multiple.addfile({ error, value }, form.file) as never[] }"
                                @removefile="(error: any, value: filePondValue) => { form.file = multiple.removefile({ error, value }, form.file) as never[] }" />
                        </div>
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