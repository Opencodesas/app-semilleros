<script setup lang="ts">
import Crud from '@/components/Crud.vue'
import { Header, Item } from 'vue3-easy-data-table';
import Swal, { SweetAlertIcon } from "sweetalert2";

const router = useRouter()
const route = useRoute()

const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

const create = () => {
    setLoading(true)
    router.replace({ name:'methodologist_visits.create'}).finally(() => {
        setLoading(false)
    })
}
const fetchData = () => {
    methodologistVisitServices.getAll().then((response) => {
        items.value = response?.data.items
        console.log(items.value)
    })
}
async function deleteModule(id: string | number) {
  await methodologistVisitServices.delete(id as string).then((response) => {
    if (response?.status == 200 || response?.status == 201) {
            Swal.fire("", response?.data.items, "success");
        } else {
            Swal.fire("", response?.data.items, "error");
        }
    });
    fetchData();
}

onBeforeMount(async () => {
    await methodologistVisitServices.getAll().then((response) => {
        items.value = response?.data.items
        console.log(items.value)
    })
})

const headers: Header[] = [
    { text: 'ID', value: 'id' },
    { text: 'FECHA VISITA', value: 'date_visit'},
    { text: 'HORA VISITA', value: 'hour_visit' },
    { text: 'DISCIPLINA', value: 'disciplines.name' },
    // { text: 'MUNICIPIO', value: 'municipalities' },
    // { text: 'EVALUACION', value: 'evaluations' },
    { text: 'ESTADO', value: 'status.name' },
    { text: 'ACCIONES', value: 'actions' },
]

const items = ref<Item[]>([])
</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Listado Visitas Metodologo</h2>
        <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <Button variant="primary" class="btn btn-primary" @click="create">
                Crear Visita
            </Button>
        </div>
    </div>
    <!-- BEGIN: Page Layout -->
    <div class="p-5 mt-5 intro-y box">
        <Crud :headers="headers" label="Visitas" :items="items" :on-delete-fnc="deleteModule" />
    </div>
    <!-- END: Page Layout -->
</template>
