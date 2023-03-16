<script setup lang="ts">
import { addFile } from '@/types/filepond';
import { moduleServices } from '@/services/moduleServices';
import { required } from '@vuelidate/validators'
import CommonFile from '@/components/CommonFile.vue'
import useVuelidate from '@vuelidate/core'
import CommonEditor from '@/components/CommonEditor.vue';

const router = useRouter()

const form = reactive({
    clause_1: '',
    clause_2: '',
    clause_3: '',
    clause_4: '',
    clause_5: '',
})

const form_rules = computed(() => ({
    clause_1: { required },
    clause_2: { required },
    clause_3: { required },
    clause_4: { required },
    clause_5: { required },
}))

const v$ = useVuelidate(form_rules, form)

const files = ref([])

const onSubmit = async () => {
    const values = formdataParser(form)
    const valid = await v$.value.$validate()

    if (valid) {
        const response = await moduleServices.create(values)
    
        if (response?.status == 200){
            router.go(0)
        }
    }
    else {
        alerts.validation()
    }
}
</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <div class="flex items-center space-x-4">
            <CommonBackButton to="contract.index" title="Listado" />
            <h2 class="mr-auto text-lg font-medium">Clausulas de Contrato</h2>
        </div>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <form @submit.prevent="onSubmit" class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <CommonEditor label="Clausula 1" name="clause_1" v-model="form.clause_1" :validator="v$" />
            <CommonEditor label="Clausula 2" name="clause_2" v-model="form.clause_2" :validator="v$" />
            <CommonEditor label="Clausula 3" name="clause_3" v-model="form.clause_3" :validator="v$" />
            <CommonEditor label="Clausula 4" name="clause_4" v-model="form.clause_4" :validator="v$" />
            <CommonEditor label="Clausula 5" name="clause_5" v-model="form.clause_5" :validator="v$" />
            <!-- <CommonEditor label="Clausula 6" name="clause_6" v-model="form.clause_6" :validator="v$" /> -->
            <!-- <CommonInput label="Clausula 2" name="clause_2" v-model="form.clause_2" :validator="v$" /> -->
            <div class="flex justify-end col-span-1 md:col-span-2">
                <Button type="submit" variant="primary">
                    Ingresar
                </Button>
            </div>
        </form>
    </div>
</template>