

//by rick
<script setup lang="ts">
import Crud from '@/components/Crud.vue'
import { zoneServices } from '@/services/zoneSerrvices';
import { forEach } from 'lodash';
import { Header, Item } from 'vue3-easy-data-table';

const router = useRouter()
const route = useRoute()

const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

const edit = () => {
    setLoading(true)
    router.replace('edit').finally(() => {
        setLoading(false)
    })
}






onBeforeMount(async () => {
    await zoneServices.getZones().then((response) => {
        items.value = response?.data;
    });
})

const headers: Header[] = [
    { text: 'ID', value: 'id' },
    { text: 'NOMBRE USUARIO', value: 'users.name' },

    { text: 'CORREO', value: 'users.email', },
    // { text: "ROLES", value: "roles" },
    { text: 'REGION', value: 'zone.name', },
    {
        text: "Acciones", value: 'users.status'
    }
]

const items = ref<Item[]>([])

</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Listado de usuarios por zonas</h2>
        <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <Button variant="primary" class="btn btn-primary" @click="edit">
                Edicion
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
