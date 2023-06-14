<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import FormSwitch from "@/base-components/Form/FormSwitch";
import { visitServices } from '@/services/psychosocial/visitServices';

const form = reactive({
    date_visit: '',
    municipalities_id: '',
    monitor: '',
    diciplines_id: '',
    number_beneficiaries: '',
    scenery: '',
    objetive: '',
    beneficiaries_recognize_name: false,
    beneficiary_recognize_value: false,
    all_ok: false,
    description: '',
    observations: '',
    file: [],
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
    file: { required },
}));

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
    let response =await getSelect(['municipalities'],true)
    //console.error('municipalities',response);
    return  response
}, null)


const monitorList = asyncComputed(async () => {
    
    //let response= await getMonitorByMunicipality(form.municipalities_id);
    let response =await getMonitorByAuth()
    return response;
}, null);

const disciplinesList = asyncComputed(async () => {
    return await getDisciplinesByMonitor(form.monitor)
}, null)

//watch(() => form.municipalities_id, (newVal, oldVal) => {
  //  form.monitor = '';
//})

//watch(() => form.monitor, (newVal, oldVal) => {
  //  form.diciplines_id = '';
//})

const v$ = useVuelidate(form_rules, form)
const router = useRouter()


const onSubmit = async () => {
    const valid = await v$.value.$validate()
    if (valid) {
        const formData = formdataParser(form);
        await visitServices.create(formData).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    setLoading(true)
                    router.push({ name: 'psychosocial.visits' }).finally(() => {
                        setLoading(false)
                        alerts.create()
                    })

                }
            }
        })
    }
    else {
        alerts.validation()
    }
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
                    <CommonSelect label="Municipio *" name="municipalities_id" v-model="form.municipalities_id"
                        :validator="v$" :options="municipalities" />
                    <CommonSelect label="Monitor Deportivo *" name="monitor" v-model="form.monitor" :validator="v$"
                        :options="monitorList" />
                    <CommonSelect label="Disciplinas *" name="diciplines_id" v-model="form.diciplines_id" :validator="v$"
                        :options="disciplinesList" />
                    <CommonInput type="number" min="0" label="No. Beneficiarios en el campo *" placeholder="Escriba..."
                        name="number_beneficiaries" v-model="form.number_beneficiaries" :validator="v$" />
                    <CommonInput type="text" label="Escenario Deportivo *" placeholder="Escriba..." name="scenery"
                        v-model="form.scenery" :validator="v$" />
                    <div class="col-span-2">
                        <CommonInput label="Objetivo del acompañamiento *" placeholder="Escriba..." name="objetive"
                            v-model="form.objetive" :validator="v$" />
                    </div>
                    <div class="p-5 intro-y box col-span-2 bg-gray-200 flex flex-col gap-3">
                        <div class="">

                            <FormSwitch.Input name="beneficiaries_recognize_name" id="beneficiaries_recognize_name"
                                type="checkbox" v-model="form.beneficiaries_recognize_name" :validator="v$" />
                            <FormSwitch.Label class="text-sm" htmlFor="beneficiaries_recognize_name"> ¿LOS BENEFICIARIOS
                                RECONOCEN EL NOMBRE
                                DEL
                                PROYECTO? </FormSwitch.Label>
                        </div>
                        <div class="">

                            <FormSwitch.Input name="beneficiary_recognize_value" id="beneficiary_recognize_value"
                                type="checkbox" v-model="form.beneficiary_recognize_value" :validator="v$" />
                            <FormSwitch.Label htmlFor="beneficiary_recognize_value"> ¿LOS BENEFICIARIOS RECONOCEN EL
                                VALOR DESARROLLADO
                                EN EL MES? </FormSwitch.Label>
                        </div>
                        <div class="">

                            <FormSwitch.Input name="all_ok" id="all_ok" type="checkbox" v-model="form.all_ok"
                                :validator="v$" />
                            <FormSwitch.Label htmlFor="all_ok"> ¿SE OBSERVA
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
                        <CommonFile :validator="v$" v-model="form.file" name="file"
                            class="w-11/12 sm:w-8/12 m-auto cursor-pointer" :accept-multiple="false" @change="selectFile" />
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