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
const userdata = {
    nombre: "Arturo Marulanda",
    id : "1112341234"
}

const data = [
    {
        id: "1",
        date: "diciembre",
        create: "04-19-2022",
        contract: {
            id: "0005",
            name: "Arturo Marulanda",
            cuote: formatoPesos.format(Number.parseInt("1500000")),
            periodStart: "1-15-2023",
            periodEnd: "12-15-2023",
            periods: "12", 
        },
        budgetstatus: {
            status: "Pagada",
            slug: "PAG",
        },
    },
    {
        id: "2",
        date: "enero",
        create: "04-19-2023",
        contract: {
            id: "0006",
            name: "Arturo Marulanda",
            cuote: formatoPesos.format(Number.parseInt("1500000")),
            periodStart: "1-15-2023",
            periodEnd: "12-15-2023",
            periods: "12", 
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
        <h2 v-if="route.meta.provider == 'contractor'" class="mr-auto text-lg font-medium">
            {{ storeOnboarding.get_user_role?.name }}, estas son tus Cuentas de Cobro:</h2>
        <h2 v-else class="mr-auto text-lg font-medium">
            Cuentas de cobro de {{ userdata.nombre }}.</h2>
        
        <!--<div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            
            <Button class="bg-cyan-900 text-white border-0 hover:bg-cyan-800 hover:animate-pulse" @click="create">
                <Lucide class="mr-2" :icon="'Wallet'" />
                Crear cuenta de cobro
            </Button> 
        </div>-->
    </div>
    <!-- BEGIN: Page Layout -->
    <div class="p-5 mt-5 intro-y box">
        <Crud :headers="headers" :items="items"/>
    </div>
    <!--
    <CommonInput type="number" placeholder="0.000.000" label="Valor del Contrato *" name="contract_value" />
    <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
  -->
  <!-- END: Page Layout -->
  
</template>