<script setup lang="ts">
import Crud from '@/components/Crud.vue'
import { Header, Item } from 'vue3-easy-data-table';

const router = useRouter()
const route = useRoute()

const create = () => {
    setLoading(true)
    router.push({ name: 'contractors.store' }).finally(() => {
        setLoading(false)
    })
}

// [
//     { 
//         id: '1',
//         name: 'Pedro Lozano Marin',
//         identification: '6632323562',
//         email: 'plozano@gmail.com',
//         munc: 'palmira',
//         dept: 'Valle',
//         phone: '318112251',
//         address: 'Cra 25 11-23',
//         date: '17-01-2023-11:54 ',
//         periodo: '1',
//         // actions: 'Acciones',
//     },
//     { 
//         id: '2',
//         name: 'Pedro Flores',
//         identification: '68323894',
//         email: 'PEDRO@hotmail.com ',
//         munc: 'cerriro',
//         dept: 'Valle',
//         phone: '315882252',
//         address: 'Cra 25 11-23',
//         date: '05-07-2023-10:22',
//         periodo: '1',
//         // actions: 'Acciones',
//     },
//     { 
//         id: '3',
//         name: 'Claudia Lozano',
//         identification: '77732343',
//         email: 'claudia@gmail.com',
//         munc: 'pradera',
//         dept: 'Valle',
//         phone: '314462254',
//         address: 'Cra 25 11-23',
//         date: '17-01-2023-11:54',
//         periodo: '1',
//         // actions: 'Acciones',
//     },
//     { 
//         id: '4',
//         name: 'Alexandra Perafan',
//         identification: '92323123',
//         email: 'alexandra@hotmail.com',
//         munc: 'cali',
//         dept: 'Valle',
//         phone: '311882253',
//         address: 'Cra 25 11-23',
//         date: '05-07-2023-10:22',
//         periodo: '1',
//         // actions: 'Acciones',
//     },
// ]

onBeforeMount(async () => {
    await contractorServices.getAll().then((response) => {
        console.log(response?.data)
        items.value = response?.data
    })
})

const headers: Header[] = [
    { text: 'ID', value: 'id' },
    { text: 'NOMBRE COMPLETO', value: 'name', sortable: true },
    { text: 'CÉDULA', value: 'identification', sortable: true},
    { text: 'CORREO', value: 'email' },
    { text: 'MUNICIPIO', value: 'municipality' },
    { text: 'DEPARTAMENTO', value: 'department' },
    { text: 'CELULAR', value: 'phone' },
    { text: 'DIRECCIÓN', value: 'address' },
    { text: 'PERIODO VIGENCIA', value: 'validator_periods.term' },
    { text: 'DOCUMENTOS', value: 'documents', sortable: true },
    { text: 'CREACIÓN', value: 'created_at' },
    { text: 'ACCIONES', value: 'actions' },
]

const items = ref<Item[]>([])
</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Listado Contratistas</h2>
        <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <Button variant="primary" class="btn btn-primary" @click="create">
                Crear Contratista
            </Button>
        </div>
    </div>
    <!-- BEGIN: Page Layout -->
    <div class="p-5 mt-5 intro-y box">
        <Crud :headers="headers" :items="items" />
    </div>
    <!-- END: Page Layout -->
</template>
