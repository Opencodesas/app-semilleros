<script setup lang="ts">
import Crud from '@/components/Crud.vue';
import { Header, Item } from 'vue3-easy-data-table';

import { validity_periodsServices } from '@/services/validity_periods';  // 1. Llamar el servicio
const router = useRouter()
const route = useRoute()
const validity_period_services = validity_periodsServices; // 2. Guardar el servicio en un variable
const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

const create = () => {
    setLoading(true)
    router.replace('create').finally(() => {
        setLoading(false)
    })
}

const headers: Header[] = [
    { text: 'ID', value: 'id' },
    { text: 'CONSECUTIVO', value: 'consecutive' },
    { text: 'PLAZO', value: 'term' },
    { text: 'FECHA INICIO', value: 'start_date' },
    { text: 'FECHA FINAL', value: 'final_date' },
    { text: 'FECHA CAP', value: 'cap_date' },
    { text: 'APROPIACION PRESUPUESTAL', value: 'cap' },
    { text: 'CERTIFICACION PRESUPUESTAL', value: 'cap_certificate' },
    { text: 'FECHA CREADO', value: 'created_at' },
    { text: 'ACCIONES', value: 'actions' },
]
const items = ref<Item[]>([])// 3. Definir una variable,para guardar los los datos que llega tipo  ref<Item[]>([])
onBeforeMount(async () => {
    await validity_period_services.getAll().then((response) => {  //4 . Llamar el metodo a consumir
        items.value = response?.data.items.map((all: any) => ({ ...all, status: 'ENREV' })) //5.  Asignar los a la variable los datos que llegan
    })
})

</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Listado Periodo Vigencia</h2>
        <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <Button variant="primary" class="btn btn-primary" @click="create">
                Crear Periodo vigencia
            </Button>
        </div>
    </div>
    <!-- BEGIN: Page Layout -->
    <div class="p-5 mt-5 intro-y box">
        <Crud :headers="headers" :items="items" />
    </div>
    <!-- END: Page Layout -->
</template>
