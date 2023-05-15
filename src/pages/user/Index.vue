
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
        profile: JSON.parse(JSON.stringify({...objeto.profile})) //copia profuda de copia profunda del objeto
        }));
        //console.log(response?.data.items)
        //console.log(items.value)
    })
})

const headers: Header[] = [
    { text: 'ID', value: 'id' },
    { text: 'EMAIL', value: 'email', sortable: true },
    { text: 'NOMBRE', value: 'profile.contractor_full_name', sortable: true },
    { text: 'N. DOCUMENTO', value: 'profile.document_number' },
    { text: 'ROL', value: 'name', sortable: true },
    { text: 'ACCIONES', value: 'UserActions' },
]

const items = ref<Item[]>([])

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
        <Crud :headers="headers" :items="items" />
        <!-- <Button @click="ingreso()">Ingresar</Button> -->
    </div>
    <!-- END: Page Layout -->
</template>
