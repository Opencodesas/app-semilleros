<script setup lang="ts">
import Crud from '@/components/Crud.vue'
import { Header, Item } from 'vue3-easy-data-table';
//import { required } from '@/utils/validators'
//import Button from '@/base-components/Button';
import { onboardingStore } from '@/stores/onboardingStore';

const storeOnboarding = onboardingStore();

const route = useRoute();
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
    { text: 'CONTRATO', value: 'user.NODECONTRATO', sortable: true },
    {text: 'PERIODO', value: 'periodo', sortable: true },
    {text: 'VALOR', value: 'user.VALORCUOTASINMOVILIZACION' },
    {text: 'NOMBRE CONTRATISTA', value: 'user.NOMBREMATRIZ' },
    {text: 'CREADO', value: 'create' },
    {text: 'FASE', value: 'budgetFase', sortable: true},
    {text: 'ESTADO', value: 'budgetstatus', sortable: true},
    {text: 'Acciones', value: 'budgetactions' },
]
let data = [
    /*{
        id: "1",
        date: "febrero",
        create: "04-19-2023",
        contract: {
            id: "CPS-057",
            name: "GLORIA INES MONTOYA",
            cuote: formatoPesos.format(Number.parseInt("6600000")),
            periodStart: "14/2/2023",
            periodEnd: "31/5/2023",
            periods: "1", 
        },
        budgetstatus: {
            status: "En Supervisión",
            slug: "SUP",
        },
    },
    {
        id: "2",
        date: "marzo",
        create: "04-19-2023",
        contract: {
            id: "CPS-057",
            name: "GLORIA INES MONTOYA",
            cuote: formatoPesos.format(Number.parseInt("6600000")),
            periodStart: "14/2/2023",
            periodEnd: "31/5/2023",
            periods: "1",  
        },
        budgetstatus: {
            status: "Contabilidad",
            slug: "CON",
        },
    },
    {
        id: "3",
        date: "abril",
        create: "04-19-2023",
        contract: {
            id: "CPS-057",
            name: "GLORIA INES MONTOYA",
            cuote: formatoPesos.format(Number.parseInt("6600000")),
            periodStart: "14/2/2023",
            periodEnd: "31/5/2023",
            periods: "1",  
        },
        budgetstatus: {
            status: "Tesorería",
            slug: "TES",
        },
    },
    {
        id: "4",
        date: "mayo",
        create: "04-19-2023",
        contract: {
            id: "CPS-057",
            name: "GLORIA INES MONTOYA",
            cuote: formatoPesos.format(Number.parseInt("6600000")),
            periodStart: "14/2/2023",
            periodEnd: "31/5/2023",
            periods: "1",  
        },
        budgetstatus: {
            status: "Presupuesto",
            slug: "PRE",
        },
    },
    {
        id: "5",
        date: "junio",
        create: "04-19-2023",
        contract: {
            id: "CPS-057",
            name: "GLORIA INES MONTOYA",
            cuote: formatoPesos.format(Number.parseInt("6600000")),
            periodStart: "14/2/2023",
            periodEnd: "31/5/2023",
            periods: "1",  
        },
        budgetstatus: {
            status: "Subsanación",
            slug: "SUB",
            msn: "Aún no puedes hacer esta cuenta de cobro"
        },
    },*/
];

const TheUserData = {
  ORDENDECONTRATOS: "6",
  NODECONTRATO: "CPS-245",
  RPA: "622",
  REGION: "1",
  ROL: "MONITORDEPORTIVO",
  DISCIPLINAMATRIZ: "FUTBOL",
  NOMBREMATRIZ: "ALEXANDER GOMEZ GIL",
  GENERO: "MASCULINO",
  NUMERODEDOCUMENTO: "94228623",
  LUGARDEEXPEDICIONDELDOCUMENTO: "ZARZAL VALLEDELCAUCA",
  FECHADEEXPEDICIONDELDOCUMENTO: "20/2/1991",
  FECHADENACIMIENTO: "7/5/1972",
  NUMERODECELULAR: "3177880336",
  MUNICIPIODERESIDENCIA: "ZARZAL",
  DIRECCIONDERESIDENCIA: "CARRERA15#10A04",
  CORREOELECTRONICO: "alegogil07@hotmail.com",
  ENTIDADBANCARIA: "BANCOLOMBIA",
  NUMERODECUENTABANCARIA: "83661902232",
  TIPODECUENTA: "AHORROS",
  RUT: "94228623-0",
  ENTIDADPROMOTORADESALUD: "SURA",
  FONDODEPENSIONES: "COLPENSIONES",
  ARL: "POSITIVA",
  MODOPAGOPLANILLA: "",
  OBJETOCONTRACTUAL: "PrestacióndeservicioscomoMonitorDeportivoenelmarcodelproyectoSemillerosDeportivos.",
  ASIGNACIONPRESUPUESTAL: "23-010110MonitoresDeportivos",
  CERTIFICADODEASIGNACIONPRESUPUESTAL: "615",
  FECHADECAP: "14/2/2023",
  FECHADEINICIO: "14defebrerode2023",
  FECHADEFINALIZACION: "28deabrilde2023",
  FECHADEFINALIZACIONOTROSI: "31/5/2023",
  VALORCUOTASINMOVILIZACION: "1540000",
  MOVILIZACIONYOTRANSPORTE: "0",
  NUMERODECUOTAS: "3",
  VALORCUOTAINCLUIDOMOVILIZACION: "1540000",
  VALORTOTALCONTRATO: "4620000",
  ROJO: {
    ASIGNACIONPRESUPUESTALOTROSI: "23-010134",
    CAPOTROSI: "2709",
    FECHADECAP: "27/4/2023",
    VALORCUOTAOTROSISINMOVILIZACION: "1540000",
    VALORTOTALCONTRATOOTROSI: "6160000",
    RPAADICION: "",
  },
  SUPERVISOR: "OSCARANDRESGARCIARIOS",
  ADMINISTRATIVO: "KATHERINEMARTINEZSANDOVAL"
};
const aceptarCuenta = (id:any)=>{
    const index = data.findIndex(obj => obj.id === id);
    if (index !== -1) {
    let obj = JSON.parse( JSON.stringify( data[index] ) );
    obj = {...obj, budgetstatus: {...obj.budgetstatus, fase: 
        obj.budgetstatus.fase === "En supervisión" ?
        "En contaduria"
        : obj.budgetstatus.fase === "En contaduria"?
        "En tesorería"
        : obj.budgetstatus.fase === "En tesorería"?
        "En presupuesto" : "Pagado"
    }}
    
    data.splice(index, 1);
    if(obj.budgetstatus.fase!=="Pagado"){   data.splice(index, 0, obj); } else { localStorage.setItem("pagadas", JSON.stringify([obj])); }
    localStorage.setItem("cuenta de cobro", JSON.stringify(data));
    location.reload();
  }
}
let fakedata: any = localStorage.getItem("cuenta de cobro");
if(fakedata){
    fakedata = JSON.parse(fakedata);
    data = fakedata;
    console.log(data);
}


/*let fakedata: any = localStorage.getItem("cuenta de cobro");
console.log("fakedata: "+JSON.stringify(fakedata));
if(fakedata){
    fakedata = JSON.parse(fakedata);
    if(fakedata?.length===1){
        fakedata = fakedata[0];
    data[data.length] = {...fakedata,
        id:data.length+1,
        date:fakedata.budgetdata?.validity.split(" ")[0],
        contract: {
            id:fakedata.budgetdata?.contract?.id,
            name: fakedata.budgetdata.contract?.username,
            cuote:fakedata.budgetdata.contract?.cuote
        },
        create: fakedata.create,
        budgetstatus: {
            status:fakedata.budgetdata.state,
            slug:'ENR'
        }};
    }else{
        let temp;
        fakedata.forEach((element: any) => {
            data[data.length] =
            {...element,
                id:data.length+1,
                date:element.budgetdata?.validity.split(" ")[0],
                contract: {
                    id:element.budgetdata?.contract?.id,
                    name: element.budgetdata.contract?.username,
                    cuote:element.budgetdata.contract?.cuote
                },
                create: element.create,
                budgetstatus: {
                    status:element.budgetdata.state,
                    slug:'ENR'
                }
            };
        });
    }
}
console.log(data);*/

const items = ref<Item[]>(data);
//#endregion

</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">
            Informes de Cuentas de Cobro
        </h2>        
        <!--<div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            
            <Button class="bg-cyan-900 text-white border-0 hover:bg-cyan-800 hover:animate-pulse" @click="create">
                <Lucide class="mr-2" :icon="'Wallet'" />
                Crear cuenta de cobro
            </Button> 
        </div>-->
    </div>
    <!-- BEGIN: Page Layout -->
    <div class="p-5 mt-5 intro-y box">
        <Crud :headers="headers" :items="items" :item_see_fnc="aceptarCuenta"/>
    </div>
    <!--
    <CommonInput type="number" placeholder="0.000.000" label="Valor del Contrato *" name="contract_value" />
    <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
  -->
  <!-- END: Page Layout -->
  
</template>