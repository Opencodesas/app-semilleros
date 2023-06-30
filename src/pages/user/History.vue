
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
    await userServices.getHistory(route.params.id).then((response) => {
        console.log(response);
        items.value = response?.data
    })
})

const headers: Header[] = [
    { text: 'No.', value: 'id' },
    { text: 'Url', value: 'url', sortable: true },
    { text: 'Fecha', value: 'created_at', sortable: true },
]

const items = ref<Item[]>([])

</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Historial del Usuario</h2>
        <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <Button variant="hotbed" class="btn btn-primary" @click="create">
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
