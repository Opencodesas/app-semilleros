<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import FormSwitch from "@/base-components/Form/FormSwitch";
import { onboardingStore } from "@/stores/onboardingStore";
import { customVisitServices } from '@/services/psychosocial/customVisitServices';
import { selectOption } from '@/components/CommonSelect.vue';

const { multiple } = useFilepondEvents();

const store = onboardingStore();
//id:2 => En revisión => ENR


//Se manda la siguiente información para crear visita personalizada
const form = reactive({
    month: '', //ID del mes
    municipality: '', //ID del municipio
    beneficiary: '', //ID del beneficiario
    theme: '', //String
    agreements: '', //String
    concept: '1', //String
    guardian_knows_semilleros: false, //Boolean
    file: [], //Un archivo (foto)
})


const form_rules = computed(() => ({
    month: { required },
    municipality: { required },
    beneficiary: { required },
    theme: { required },
    agreements: { required },
    concept: {},
    guardian_knows_semilleros: { required },
    file: { required },
}))

const formdataParser = (form: any) => {
    console.log(form);
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
    });
    console.log(formData);
    return formData;
};


const selectFile = (event: any) => {
    console.log(form.file);
    form.file = event.target.files[0];
}

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

const beneficiary_data = reactive({
    scholar_level: '',
    health_entity: '',
    guardian_name: '',
    guardian_lastname: '',
    guardian_identification: '',
})

const beneficiaryLoaded = ref(false);

const getBeneficiaryData = async () => {
    //console.log(scholarLevels[0]);
    await beneficiaryServices.get(form.beneficiary as string).then((response) => {
        console.log(response?.data.items);
        if (response?.status == 200 || response?.status == 201) {
            beneficiary_data.scholar_level = scholarLevels[response.data.items.scholar_level - 1].label;
            beneficiary_data.health_entity = response.data.items.health_entity;
            beneficiary_data.guardian_name = response.data.items.acudiente.firts_name;
            beneficiary_data.guardian_lastname = response.data.items.acudiente.last_name;
            beneficiary_data.guardian_identification = response.data.items.acudiente.cedula;
            beneficiaryLoaded.value = true;
        } else {
            alerts.custom("", "No se pudieron obtener los datos", "error");
        }
        //console.log(form);
    })
}

watch(() => form.beneficiary, (newVal, oldVal) => {
    console.log(newVal);
    if (newVal != null) getBeneficiaryData();

})


const v$ = useVuelidate(form_rules, form)

const router = useRouter()

const onSubmit = async () => {
    const valid = await v$.value.$validate()
    const formData = formdataParser(form)
    console.log(form);
    console.log(formData);
    if (valid) {
        await customVisitServices.create(formData).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    alerts.create()
                    setLoading(true)
                    router.push('/dashboard').finally(() => {
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

const positionRange = computed(() => {
    const positionTooltip = (parseInt(form.concept) - 1) / (4);
    return `calc(${positionTooltip * 100}% - ${(2 * (parseInt(form.concept) - 1) ** 2) / 5 + 2 * (parseInt(form.concept) - 1)}px)`;
});

</script>

<template>
    <div class="flex items-center justify-between mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Registrar visita personalizada</h2>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <form @submit.prevent="onSubmit" class="space-y-8 divide-y divide-slate-200">
            <div class="space-y-8 divide-y divide-slate-200">
                <div>
                    <div class="mt-0 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3 ">
                        <CommonSelect label="Mes *" name="month" v-model="form.month" :validator="v$" :options="months" />
                        <CommonSelect label="Municipio *" name="municipality" v-model="form.municipality" :validator="v$"
                            :options="municipalities" />
                        <CommonSelect label="Beneficiario *" name="beneficiary" v-model="form.beneficiary" :validator="v$"
                            :options="beneficiariesList" />
                    </div>
                    <!-- cambiar condicion por "beneficiary_data" cuando haya función para traer los datos -->
                    <div v-if="form.beneficiary && beneficiaryLoaded">
                        <!-- These inputs don't use the validator since they have data from the DB  -->
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

                                <FormSwitch.Input name="swich_plans" id="swich_plans" type="checkbox"
                                    v-model="form.guardian_knows_semilleros" :validator="v$" />
                                <FormSwitch.Label htmlFor="swich_plans"> ¿El padre o acudiente conoce el proyecto de
                                    Semilleros Deportivos?. </FormSwitch.Label>
                            </div>
                        </div>
                        <div class="col-span-3">
                            <CommonTextarea
                                label="Temáticas durante la visita: físico, emocional, familiar, escolar, social, espiritual *"
                                placeholder="Escriba..." name="theme" rows="5" v-model="form.theme" :validator="v$" />

                        </div>
                        <div class="col-span-3">
                            <CommonTextarea label="Acuerdos y recomendaciones *" placeholder="Escriba..." name="agreements"
                                rows="5" v-model="form.agreements" :validator="v$" />
                        </div>



                        <div class="grid col-span-3 justify-center">
                            <label for="range" class="text-xs">Concepto del padre o acudiente que atendió la visita en una
                                escala de 1 a 5 donde 1 es deficiente y 5 excelente:
                            </label>
                            <div id="range" class="relative mb-5">
                                <input class="w-full accent-primary" type="range" min="1" max="5" v-model="form.concept" />
                                <div :style="{ left: positionRange }"
                                    class="absolute -translate-x-1/4 border-zinc-500 border-2 p-2 rounded-full bg-primary text-white select-none">
                                    {{ form.concept }}
                                </div>
                            </div>
                        </div>

                        <div class="col-span-3 p-5 mt-6 intro-y">
                            <CommonFile :validator="v$" v-model="form.file" name="file"
                                class="w-11/12 sm:w-8/12 m-auto cursor-pointer" :accept-multiple="false"
                                @change="selectFile" />
                        </div>

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
