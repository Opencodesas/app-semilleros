<script setup lang="ts">
import Vue from 'vue'
import Crud from '@/components/Crud.vue'
import { Header, Item } from 'vue3-easy-data-table';
import { onboardingStore } from "@/stores/onboardingStore";
import Form from './Form.vue'

const route = useRoute();
const router = useRouter();
const store = onboardingStore();
//ver el provider - usado en CRUD para definir los botones de actions, leyendo status. fichasViewer si es único para esta tabla
//console.log(route.meta.provider)
console.log();

const headers: Header[] =
store.get_user_role?.slug==="metodologo"?
[
    { text: 'No.', value: 'id', sortable: true},
    { text: 'Monitor', value: 'mon.name', sortable: true},
    { text: 'CC del Monitor', value: 'mon.id', sortable: true},
    { text: 'Beneficiario', value: 'ficha_data.nombres', sortable: true},
    { text: 'Municipio', value: 'ficha_data.municipio'},
    { text: 'Estado', value: 'status'},
    { text: 'Acciones', value: 'fichasViewer' },
]
:
[
    { text: 'No.', value: 'id', sortable: true},
    { text: 'Metodólogo', value: 'met.name', sortable: true},
    { text: 'Monitor', value: 'mon.name', sortable: true},
    { text: 'CC del Monitor', value: 'mon.id', sortable: true},
    { text: 'Beneficiario', value: 'ficha_data.nombres', sortable: true},
    { text: 'Municipio', value: 'ficha_data.municipio'},
    { text: 'Estado', value: 'status'},
    { text: 'Acciones', value: 'fichasViewer' },
];



//modelo info del beneficiario
const fiicha = {
  fechaInscripcion: '12/01/ 2023',
  municipio: 'Cali',
  disciplinas: 'Yudo',
  nombres: 'Alberto',
  apellidos: 'Rodriguez',
  fechaNacimiento: '01-01-1900',
  lugarNacimiento: 'Cali',
  tipoIdentificacion: 'CC',
  numeroDocumento: '1234567890',
  direccionRes: 'Carrera 1 # 1',
  numeroCel: '1231231234',
  estrato: '3',
  zona: '1',
  victimaConf: 'false',
  pueblo: '1',
  genero: 'masc',
  etnia: 'raizal',
  discapacidad: 'ninguna',
  otroDiscapacidad: '',
  patologia: '',
  otroPatologia: '',
  sangre: 'B+',
  escolaridad: 'secundaria',
  vivoCon: 'esposa',
  afiliacion: '1',
  nombresAcudiente: 'Acudiente',
  apellidosAcudiente: ' Mio',
  nDocuAcudiente: '1234567890',
  parentesco: 'Madre',
  email: 'email@nail.com.co',
  nCelularAcudiente: '1231231234',
  redesAcudiente: '',
  enterado: 'si',
}

//traer el listado de fichas de inscripción de monitores 
//filtrado para este rol
//ordenado con status.slug = 'SIN' primero
const data = ref([
    {
        //datos de ficha
        id: 1,
        status: {
			name: 'En revisión',
			slug: 'SIN',
		},
        //datos usuario calificador
        calif: {
            resp_id: '',
            resp_name: '',
            reject_motive: '',
        },
        //datos del monitor asociado
        mon: {
            id: '1234567890',
            name: 'Peter Parker',
        },
         //datos del metodologo asociado
         met: {
            id: 1,
            name: 'Jennifer Montenegro',
        },
        //datos del beneficiario (de la ficha)
        ficha_data: {...fiicha},
    },
    {
        //datos de ficha
        id: 2,
        status: {
			name: 'Aprobado',
			slug: 'APR',
		},
        //datos usuario calificador
        calif: {
            resp_id: '2',
            resp_name: 'Spider Man',
            reject_motive: '',
        },
        //datos del monitor asociado
        mon: {
            id: '1234567890',
            name: 'Peter Parker',
        },
         //datos del metodologo asociado
         met: {
            id: 1,
            name: 'Jennifer Montenegro',
        },
        //datos del beneficiario (de la ficha)
        ficha_data: {...fiicha},
    },
    {
        //datos de ficha
        id: 3,
        status: {
			name: 'Rechazado',
			slug: 'REC',
		},
        //datos usuario calificador
        calif: {
            resp_id: 2,
            resp_name: 'Spider Man',
            reject_motive: 'Faltan documentos',
        },
        //datos del monitor asociado
        mon: {
            id: '1234567890',
            name: 'Peter Parker',
        },
         //datos del metodologo asociado
         met: {
            id: 1,
            name: 'Jennifer Montenegro',
        },
        //datos del beneficiario (de la ficha)
        ficha_data: {...fiicha},
    },
    {
        //datos de ficha
        id: 4,
        status: {
			name: 'En revisión',
			slug: 'SIN',
		},
        //datos usuario calificador
        calif: {
            resp_id: '',
            resp_name: '',
            reject_motive: '',
        },
        //datos del monitor asociado
        mon: {
            id: '1123456789 ',
            name: 'Spider Man',
        },
         //datos del metodologo asociado
         met: {
            id: 1,
            name: 'Jennifer Montenegro',
        },
        //datos del beneficiario (de la ficha)
        ficha_data: {...fiicha},
    },
]);
const items: Item[] = [...data.value];

//#region ocultar
const currentMonitor = () => {
   if(route.query.id){      
    const currentMonitor = data.value.filter((tmonitor) => {return tmonitor.mon.id.toString()==route.query.id?.toString()})[0];
    return currentMonitor;
   }else{
    return null;
   }
}
const currentMetodologo = () => {
   if(route.query.id){      
    const currentMetodologo = data.value.filter((tmetodologo) => {return tmetodologo.met.id.toString()==route.query.id?.toString()})[0];
    return currentMetodologo;
   }else{
    return null;
   }
}
const getFichaData = () => data.value;
const aceptar = (id: any, user: any) =>{
    let ficha = data.value.find(o=>o.id=== id);
    if(ficha){
        //actualizar propiedad del objeto
        ficha.calif.resp_id=user.id;
        ficha.calif.resp_name=user.name;
        ficha.status.name="Aprobado"
        ficha.status.slug="APR"
    }
    else{
        return {status: false, msj: "no se encontró un objeto con este id"}
    }    
},
rechazar = (id: any, user:any, msj: any) =>{
    let ficha = data.value.find(o=>o.id=== id);
    if(ficha){
        //actualizar propiedad del objeto
        ficha.calif.resp_id=user.id;
        ficha.calif.resp_name=user.name;
        ficha.calif.reject_motive=msj;
        ficha.status.name="Rechazado";
        ficha.status.slug="REC";        
    }
    else{
        return {status: false, msj: "no se encontró un objeto con este id"}
    }
},
revertir=(id: any, user:any)=>{
    let ficha = data.value.find(o=>o.id=== id);
    if(ficha){
        //actualizar propiedad del objeto
        ficha.calif.resp_id=user.id;
        ficha.calif.resp_name=user.name;
        ficha.status.name="En revisión";
        ficha.status.slug="SIN";        
    }
    else{
        return {status: false, msj: "no se encontró un objeto con este id"}
    }
    console.log(ficha)
    console.log(data.value)
}
const loadmethods = {"APR": aceptar, "REC": rechazar, "SIN": revertir, "DATA": getFichaData}
//#endregion
</script>
<template>

    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Fichas de Inscripción de tus Monitores</h2>
    </div>
    <div class="p-5 mt-5 intro-y box">
        <Crud :headers="headers" :items="items" :Form="{...Form}" :payloadFunctions="loadmethods"/>
    </div>

    <!--<template v-else-if="(route.query.slug=='APR' || route.query.slug=='REC') && route.query.acc=='SIN'">
        <div class="flex items-center mt-8 intro-y">
            <CommonBackButton class="mr-4" :title="'Volver'" :to="route.hash"/>
            <h2 class="mr-auto text-lg font-medium">Revertir el estado {{ currentMonitor()?.status.name }} de {{ currentMonitor()?.name }}</h2>
        </div>

        <div class="p-5 mt-5 intro-y box">
            <div class="col-span-2 mb-3">
                Esta acción no podrá revertirse. ¿Quiere continuar?
            </div>
            <Button :variant="'outline-success'" v-on:click="RevertFicha">Revertir</Button>
            <CommonButtonLink class="ml-2" :to="route.hash" :variant="'outline-secondary'">Cancelar</CommonButtonLink>
        </div>
    </template>

    <template v-else-if="route.query.slug=='SIN' && route.query.acc=='APR'">
        <div class="flex items-center mt-8 intro-y">
            <CommonBackButton class="mr-4" :title="'Volver'" :to="route.hash"/>
            <h2 class="mr-auto text-lg font-medium">Aprobar la ficha de {{ currentMonitor()?.name }}</h2>
        </div>

        <div class="p-5 mt-5 intro-y box">
            <div class="col-span-2 mb-3">
                Se aceptará la ficha de este monitor.
            </div>
            <Button :variant="'outline-success'" v-on:click="AceptFicha">Aceptar</Button>
            <CommonButtonLink class="ml-2" :to="route.hash" :variant="'outline-secondary'">Cancelar</CommonButtonLink>
        </div>
    </template>

    <template v-else-if="route.query.slug=='SIN' && route.query.acc=='REC'">
        <div class="flex items-center mt-8 intro-y">
            <CommonBackButton class="mr-4" :title="'Volver'" :to="route.hash"/>
            <h2 class="mr-auto text-lg font-medium">Rechazar la ficha de {{ currentMonitor()?.name }}</h2>
        </div>

        <div class="p-5 mt-5 intro-y box">
            Se rechazará la ficha de este monitor.
            <div class="col-span-2 mb-3 mt-3">
                    <CommonTextarea :label="'Escribe el motivo del rechazo'" name="motive" v-model="motive"/>
                    <span v-if="error" class="text-sm text-danger">Este campo es obligatorio</span>
            </div>
            <Button :variant="'outline-danger'" v-on:click="RejectFicha">Rechazar</Button>
            <CommonButtonLink class="ml-2" :to="route.hash" :variant="'outline-secondary'">Cancelar</CommonButtonLink>
        </div>
    </template>-->

</template>

