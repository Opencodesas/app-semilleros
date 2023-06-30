<script setup lang="ts">
import Crud from '@/components/Crud.vue'
import { Header, Item } from 'vue3-easy-data-table';

const router = useRouter()
const route = useRoute()

const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

const create = () => {
    setLoading(true)
    router.replace('create').finally(() => {
        setLoading(false)
    })
}

onBeforeMount(async () => {
    await methodologistVisitServices.getAll().then((response) => {
        console.log(response?.data);
        items.value = response?.data.items
    })
})

const headers: Header[] = [
    { text: 'ID', value: 'id' },
    // { text: 'MONITOR', value: 'monitor' },
    { text: 'FECHA VISITA', value: 'date_visit'},
    { text: 'HORA VISITA', value: 'hour_visit' },
    // { text: 'MUNICIPIO', value: 'municipalities' },
    // { text: 'EVALUACION', value: 'evaluations' },
    { text: 'Observaciones', value: 'observations' },
    { text: 'ACCIONES', value: 'actions' },
]

const items = ref<Item[]>([])

</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Listado Visitas Metodologo</h2>
        <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <Button variant="hotbed" class="btn btn-primary" @click="create">
                Crear Visita
            </Button>
        </div>
    </div>
    <!-- BEGIN: Page Layout -->
    <div class="p-5 mt-5 intro-y box">
        <Crud :headers="headers" :items="items" />
    </div>
    <!-- END: Page Layout -->
</template>
