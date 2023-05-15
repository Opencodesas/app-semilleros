<script setup lang="ts">
import Crud from '@/components/Crud.vue'
import { Header, Item } from 'vue3-easy-data-table';
//import { required } from '@/utils/validators'
//import Button from '@/base-components/Button';
import { onboardingStore } from "@/stores/onboardingStore";

const storeOnboarding = onboardingStore();

const route = useRoute(); //the
const { isProvider } = useProvider(); //isProvider return boolean value of especific role mode

//#region rutas
const router = useRouter()
const formatoPesos = new Intl.NumberFormat( "es-CO" , {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
 } );

const create = () => {
    setLoading(true)
    router.push({name:"budget.store"}).finally(() => {
        setLoading(false)
    })
}
//#endregion

const prueba = () => { 
    console.clear();
    /*console.log(
        "rol: "+isProvider('contractor')
    );*/
    
    console.log( route.meta);
}
prueba();
/*const { state: contractors, isLoading, error, execute } = useAsyncState(async () => {
    return await find<{ items: Item[] }>('contracts').then((response) => {
        console.log(response.data.items)
        return response.data.items
    })
}, null) */

//#region TABLA
const headers: Header[] = [
    { text: 'N.', value: 'id' },
    { text: 'CONTRATO', value: 'contract.id', sortable: true },
    {text: 'PERIODO', value: 'date', sortable: true },
    {text: 'VALOR', value: 'contract.cuote' },
    {text: 'NOMBRE CONTRATISTA', value: 'contract.name' },
    {text: 'CREADO', value: 'create' },
    {text: 'ESTADO', value: 'budgetstatus', sortable: true, width: 150},
]

const data = [
    {
        id: "1",
        date: "noviembre",
        create: "04-19-2022",
        contract: {
            id: "CPS-057",
            name: "GLORIA INES MONTOYA",
            cuote: formatoPesos.format(Number.parseInt("6600000")),
            periodStart: "14/11/2022",
            periodEnd: "31/5/2023",
            periods: "1", 
        },
        budgetstatus: {
            status: "Pagada",
            slug: "PAG",
        },
    },
    {
        id: "2",
        date: "diciembre",
        create: "04-19-2023",
        contract: {
            id: "CPS-057",
            name: "GLORIA INES MONTOYA",
            cuote: formatoPesos.format(Number.parseInt("6600000")),
            periodStart: "14/11/2022",
            periodEnd: "31/5/2023",
            periods: "2",  
        },
        budgetstatus: {
            status: "Pagada",
            slug: "PAG",
        },
    },
];
console.log(data);
const items = ref<Item[]>(data);
//#endregion

</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Historial de Cuentas de Cobro</h2>
    </div>
    <!-- BEGIN: Page Layout -->
    <div class="p-5 mt-5 intro-y box">
        <Crud :headers="headers" :items="items"/>
    </div>
  <!-- END: Page Layout -->
  
</template>