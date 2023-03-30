<script setup lang="ts">
import { searchData } from '@/composables/search';
import Crud from '@/components/Crud.vue'
import { onboardingStore } from '@/stores/onboardingStore';
import { Header, Item } from 'vue3-easy-data-table';
import Swal, { SweetAlertIcon } from "sweetalert2";

const router = useRouter()
const route = useRoute()
const store = onboardingStore();


const items = ref<Item[]>([])

const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

const create = () => {
    setLoading(true)
    router.replace({name:'coordinator_visit.create'}).finally(() => {
        setLoading(false)
    })
}
const fetchData = () => {
    coordinatorVisitServices.getAll(store.user.id).then((response) => {
        items.value = response?.data
        console.log(items.value)
    })
}
async function deleteModule(id: string | number) {
  await coordinatorVisitServices.delete(id as string).then((response) => {
    if (response?.status == 200 || response?.status == 201) {
            Swal.fire("", response?.data.items, "success");
            setLoading(true)
        } else {
            Swal.fire("", response?.data.items, "error");
        }
        fetchData()
    });
}
onBeforeMount(async () => {
    await coordinatorVisitServices.getAll(store.user.id).then((response) => {
        console.log(response?.data);
        items.value = response?.data
    })
})

const headers: Header[] = [
    { text: 'ID', value: 'id' },
    { text: 'FECHA VISITA', value: 'date_visit'},
    { text: 'HORA VISITA', value: 'hour_visit' },
    { text: 'MUNICIPIO', value: 'municipalities.name'},
    { text: 'ESCENARIO DEPORTIVO', value: 'sports_scene'},
    { text: 'Estado', value: 'status' },
	// { text: "ROLES", value: "roles" },
    { text: 'ACCIONES', value: 'actions' },
]

const search = ref('');
const data = computed(() => searchData(items.value, search.value));

</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Listado Visitas de coordinadores</h2>
        <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <Button variant="primary" class="btn btn-primary" @click="create">
                Crear Visita
            </Button>
        </div>
    </div>
    <!-- BEGIN: Page Layout -->
    <div class="p-5 mt-5 intro-y box">
        <CommonInput
			type="search"
			name="search"
			v-model="search"
			placeholder="Buscar" />
        <Crud :headers="headers" label="Visitas" :items="data" :on-delete-fnc="deleteModule" />
    </div>
    <!-- END: Page Layout -->
</template>