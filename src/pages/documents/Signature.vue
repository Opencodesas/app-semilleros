<script setup lang="ts">
import Lucide from '@/base-components/Lucide'
import CommonFile from '@/components/CommonFile.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const form = reactive({
    document: null
})

const form_rules = computed(() => ({
    document: { required }
}))

const v$ = useVuelidate(form_rules, form)

const onSubmit = () => {
    console.log('submit')
}
</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Firma de Contrato</h2>
    </div>
    <!-- BEGIN: Page Layout -->
    <div class="p-5 mt-5 intro-y box">
        <form @submit.prevent="onSubmit">
            <CommonFile name="document" label="PDF" accept_pdf_only :validator="v$" />
            <div class="flex justify-center">
                <Button type="submit" variant="primary">
                    Ingresar
                </Button>
            </div>
        </form>
    </div>
    <!-- END: Page Layout -->
</template>
