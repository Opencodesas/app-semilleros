
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
    await userServices.getAll().then((response) => {
        items.value = 
        [...response?.data.items].map(objeto => ({
        ...objeto,
        profile: JSON.parse(JSON.stringify({...objeto.profile})), //copia profuda de copia profunda del objeto
        role:objeto.roles[0],
        }));
        //console.log(response?.data.items)
        //console.log(items.value)
    })
})

const headers: Header[] = [
    { text: 'No.', value: 'id' },
    { text: 'CORREO', value: 'email', sortable: true },
    { text: 'NOMBRE', value: 'name', sortable: true },
    { text: 'APELLIDO', value: 'lastname', sortable: true },
    { text: 'DOCUMENTO', value: 'document_number', sortable: true },
    { text: "ROLES", value: "role.name" },
    { text: 'ACCIONES', value: 'actions' },
]

const search = ref('')
const items = ref<Item[]>([])

const data = computed(() => searchData(items.value, search.value))

</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Listado Usuarios</h2>
        <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <Button variant="primary" class="btn btn-primary" @click="create">
                Crear Usuario
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
        <Crud :headers="headers" :items="data" />
        <!-- <Button @click="ingreso()">Ingresar</Button> -->
    </div>
    <!-- END: Page Layout -->
</template>
