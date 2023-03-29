<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import { onboardingStore } from '@/stores/onboardingStore'
import CommonFile from '@/components/CommonFile.vue'
import FormSwitch from "@/base-components/Form/FormSwitch";
import { filePondValue } from '@/composables/useFilepondEvents';
import { integer } from '@vuelidate/validators';
import { number } from '@intlify/core-base';
import Swal from 'sweetalert2';

const { multiple } = useFilepondEvents();
const store = onboardingStore();

const form = reactive({
	status_id: '3',
	rejection_message: '',
	date_visit: '',
	hour_visit: '',
	municipality_id: '',
	sidewalk: '',
	monitor_id: '',
    numberBeneficiary: '',
	discipline_id: '',
	sports_scene: '',
	beneficiary_coverage: '',
	description: '',
	observations: '',
    objetive: '',
	file: [],
    swich_plans_1: false,
    swich_plans_2: false,
    swich_plans_3: false,
	created_by: store.user.id,
});

const form_rules = computed(() => ({
	status_id: { required },
	rejection_message: {},
	date_visit: { required },
	hour_visit: { required },
	municipality_id: { required },
	sidewalk: { required },
	monitor_id: { required },
    numberBeneficiary: { required },
	discipline_id: { required },
	sports_scene: { required },
	beneficiary_coverage: { required },
	description: { required },
	observations: { required },
    objetive: {required},
	file: { required },
    swich_plans_1:{ required },
    swich_plans_2:{ required },
    swich_plans_3:{ required },
	created_by: { required },
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
                <div>
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                        Información Personal
                    </h3>

                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <CommonInput type="date" placeholder="Fecha de Nacimiento*" name="date_visit"
                            v-model="form.date_visit" :validator="v$" />
                        <CommonSelect placeholder="Municipio*" name="municipality_id" v-model="form.municipality_id"
                            :validator="v$" :options="municipalities" />
                        <CommonSelect placeholder="Monitor Deportivo*" name="monitor_id" v-model="form.monitor_id"
                            :validator="v$" :options="monitorList" />
                        <CommonSelect placeholder="Disciplinas *" name="discipline_id" v-model="form.discipline_id"
                            :validator="v$" :options="disciplinesList" />
                        <CommonInput type="number" placeholder="No. Beneficiarios en el campo *" name="numberBeneficiary"
                            v-model="form.numberBeneficiary" :validator="v$" />
                        <CommonInput type="text" placeholder="Escenario Deportivo*" name="sports_scene" v-model="form.sports_scene"
                            :validator="v$" />
                        <div class="col-span-2 sm:grid-cols-3">
                            <CommonTextarea placeholder="Objetivo del acompañamiento*" name="objetive" v-model="form.objetive"
                                :validator="v$" />
                        </div>
                        <div class="p-5 intro-y box col-span-2 sm:grid-cols-3 bg-gray-200 flex flex-col gap-3">
                            <div class="">

                                <FormSwitch.Input name="swich_plans" id="swich_plans" type="checkbox"
                                    v-model="form.swich_plans_1" :validator="v$" />
                                <FormSwitch.Label htmlFor="swich_plans"> ¿LOS BENEFICIARIOS RECONOCEN EL NOMBRE DEL PROYECTO? </FormSwitch.Label>
                            </div>
                            <div class="">

                                <FormSwitch.Input name="swich_plans" id="swich_plans" type="checkbox"
                                    v-model="form.swich_plans_2" :validator="v$" />
                                <FormSwitch.Label htmlFor="swich_plans"> ¿LOS BENEFICIARIOS RECONOCEN EL VALOR DESARROLLADO EN EL MES? </FormSwitch.Label>
                            </div>
                            <div class="">

                                <FormSwitch.Input name="swich_plans" id="swich_plans" type="checkbox"
                                    v-model="form.swich_plans_3" :validator="v$" />
                                <FormSwitch.Label htmlFor="swich_plans"> ¿SE OBSERVA ORGANIZACIÓN, DISCIPLINA Y BUEN MANEJO DE GRUPO DURANTE LAS SESIONES DE CLASE DEL MONITOR? </FormSwitch.Label>
                            </div>
                        </div>
                        <div class="col-span-2 sm:grid-cols-3">
                            <CommonTextarea placeholder="Objetivo del acompañamiento*" name="description" rows="5"
                                v-model="form.description" :validator="v$" />
                        </div>
                        <div class="col-span-2 sm:grid-cols-3">
                            <CommonTextarea placeholder="Objetivo del acompañamiento*" name="observations" rows="5"
                                v-model="form.observations" :validator="v$" />
                        </div>

                        <div class="grid col-span-2">
                            <CommonDropzone name="file" label="Suba su archivo aqui *" :accept-multiple="false"
                                v-model="form.file"
                                @addfile="(error: any, value: filePondValue) => { form.file = multiple.addfile({ error, value }, form.file) as never[] }"
                                @removefile="(error: any, value: filePondValue) => { form.file = multiple.removefile({ error, value }, form.file) as never[] }"
                                :validator="v$" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="pt-5">
                <div class="flex justify-end gap-x-4">
                    <Button
                        @click="$router.push({ name: isProvider('assistants') ? 'assistants.contractors' : 'contractors.index' })"
                        type="button" variant="outline-secondary">
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary">
                        Guardar
                    </Button>
                </div>
            </div>
        </form>
    </div>
</template>