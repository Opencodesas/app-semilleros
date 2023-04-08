
<script setup lang="ts">
import Crud from '@/components/Crud.vue'
import { Header, Item } from 'vue3-easy-data-table';

const router = useRouter()
const route = useRoute()

const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

const prueba = () => {
    console.log('prueba')
}

// const items = ref<Item[]>([])

// onBeforeMount(async () => {
//     await userServices.getAll().then((response) => {
//         items.value = response?.data.items
//     })
// })

const items = ref<Item[]>([
        {id: 1, name: 'John', email: 'prueba', },
        {id: 2, name: 'John', email: 'prueba', },
        {id: 3, name: 'John', email: 'prueba', },
        {id: 4, name: 'John', email: 'prueba', },
        {id: 5, name: 'John', email: 'prueba', },
        {id: 6, name: 'John', email: 'prueba', },
        {id: 7, name: 'John', email: 'prueba', },
        {id: 8, name: 'John', email: 'prueba', },
        {id: 9, name: 'John', email: 'prueba', },
    
    ])

onMounted(() => {
    console.log( console.log(items))
})

const headers: Header[] = [
    { text: 'No.', value: 'id' },
    { text: 'Fecha', value: 'name', sortable: true },
    { text: 'Usuario', value: 'email', sortable: true },
    { text: 'Municipio', value: 'email', sortable: true },
    { text: 'Escenario Deportivo', value: 'email', sortable: true },
    { text: 'Estado', value: 'Actions', sortable: true },
]




</script>

<template>
    <!-- BEGIN: Page Layout -->
    <div class="p-5 mt-5 intro-y box">
        <Crud :headers="headers" :items="items" :item_see_fnc="prueba"/>
        <!-- <Button @click="ingreso()">Ingresar</Button> -->
    </div>
    <!-- END: Page Layout -->
</template>
