<script setup lang="ts">
import Crud from '@/components/Crud.vue';
import { Header, Item } from 'vue3-easy-data-table';

import { beneficiaryServices } from '@/services/beneficiaryServices';  // 1. Llamar el servicio
import beneficiary from '@/services/beneficiary/beneficiary';
const router = useRouter()
const route = useRoute()
const beneficiary_Services = beneficiaryServices; // 2. Guardar el servicio en un variable
const routeName = computed(() => {
    return String(route.name).split('.')[0]
})


const download = () => {
    console.log('iniciando descarga de docs en un zip');
}

const headers: Header[] = [
    { text: 'ID', value: 'id' },
    { text: 'NOMBRE COMPLETO', value: 'full_name' },
    { text: 'MUNICIPIO', value: 'municipality.name' },
    { text: 'ESTADO', value: 'status' },
    { text: 'FECHA CREADO', value: 'created_at' },
    { text: 'ACCIONES', value: 'actions' },
]
const items = ref<Item[]>([])// 3. Definir una variable,para guardar los los datos que llega tipo  ref<Item[]>([])

onBeforeMount(async () => {
    const BeneId = String(route.fullPath).split('?id=')[1] || 'null';
    console.log(BeneId);
    if(BeneId!='null'){
        await beneficiary.getAll().then((response)=>{ //llamar beneficiarios de monitor con id = BeneId
            items.value = response?.data.items;
        }).catch()
    }else{
        await beneficiary_Services.getAll().then((response) => {  //llamar todos los beneficiarios del monitor actual
            items.value = response?.data.items
        }).catch()
    }
})


const descargar = ()=>{
    //getReportBenefisiaries/{id}
    return 'ruta'
}

</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Listado Beneficarios</h2>
        <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <Button v-if="String(route.fullPath).split('?id=')[1] || false" variant="primary" class="btn btn-primary"  @click="download">
                <Lucide class="mr-2" :icon="'Download'" :title="'Descarga todos los beneficiarios'"/> Descargar
            </Button>
        </div>
    </div>
    <!-- BEGIN: Page Layout -->
    <div class="p-5 mt-5 intro-y box">
        <Crud :headers="headers" :items="items" />
    </div>
    <!-- END: Page Layout -->
</template>
