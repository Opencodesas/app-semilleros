<script setup lang="ts">
import { addFile } from '@/types/filepond';
import { required } from '@vuelidate/validators'
import CommonFile from '@/components/CommonFile.vue'
import useVuelidate from '@vuelidate/core'
import Swal, { SweetAlertIcon } from "sweetalert2"

const form = reactive({
    term: '',
    start_date: '',
    final_date: '',
    cap_date: '',
    cap: '',
    cap_certificate: '',
    consecutive:'',
})

const form_rules = computed(() => ({
    term: { required },
    start_date: { required },
    final_date: { required },
    cap_date: { required },
    cap: { required },
    cap_certificate: { required },
    consecutive: { required },
}))

const v$ = useVuelidate(form_rules, form)

const router = useRouter()
const route = useRoute()

const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

onBeforeMount(async () => {
    await getConsecutive('validity_periods', 'AD').then((response) => form.consecutive = response)
})

const onSubmit = async () => {
    const valid = await v$.value.$validate()
    if (valid) {

        await validity_periodsServices.create(formdataParser(form)).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    alerts.create()
                    setLoading(true)
                    router.push('').finally(() => {
                        setLoading(false)
                    })
                }
            }
        })
        Swal.fire('', 'Creación exitosa!', 'success')
        setLoading(true)
        router.push('index').finally(() => {
            setLoading(false)
        })
    }
    else {
        alerts.validation()
    } 
}
   
</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Crear Periodo Vigencia</h2>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <CommonInput type="text" placeholder="Ingrese" label="Plazo *" name="term" v-model="form.term" :validator="v$" />
            <CommonInput type="date" label="Fecha inicio *" name="start_date" v-model="form.start_date" :validator="v$" />
            <CommonInput type="date" label="Fecha final *" name="final_date" v-model="form.final_date" :validator="v$" />
            <CommonInput type="date" label="Fecha cap *" name="cap_date" v-model="form.cap_date" :validator="v$" />
            <CommonInput type="text" placeholder="Ingrese" label="Apropiación presupuestal *" name="cap" v-model="form.cap" :validator="v$" />
            <CommonInput type="text" placeholder="Ingrese" label="Certificación presupuestal *" name="cap_certificate" v-model="form.cap_certificate" :validator="v$" />
            <!-- <CommonInput type="number" placeholder="Ingrese" label="Cosecutivol *" name="consecutive" v-model="form.consecutive" :validator="v$" /> -->

            <div class="flex justify-end col-span-1 md:col-span-2">
                <Button variant="primary" class="btn btn-primary" @click="onSubmit">
                    Ingresar
                </Button>
            </div>
        </div>
    </div>
</template>