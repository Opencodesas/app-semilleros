<script setup lang="ts">
import Vue from 'vue'
import Crud from '@/components/Crud.vue'
import { Header, Item } from 'vue3-easy-data-table';
import { onboardingStore } from "@/stores/onboardingStore";
import Form from './Form.vue'
import beneficiary from '@/services/beneficiary/beneficiary';

const route = useRoute();
const router = useRouter();
const store = onboardingStore();
let currentUser = {id: onboardingStore().get_user.id, name: onboardingStore().get_user.name, rol: onboardingStore().get_user_role?.slug};
//ver el provider - usado en CRUD para definir los botones de actions, leyendo status. fichasViewer si es único para esta tabla
//console.log(route.meta.provider)

const headers: Header[] =
currentUser.rol==="metodologo"?
[
    { text: 'No.', value: 'id', sortable: true},
    { text: 'Monitor', value: 'created_by.full_name', sortable: true},
    { text: 'CC del Monitor', value: 'created_by.document_number', sortable: true},
    { text: 'Beneficiario', value: 'full_name', sortable: true},
    { text: 'Municipio', value: 'municipality.name'},
    { text: 'Estado', value: 'fichaStatus'},
    { text: 'Acciones', value: 'fichasViewer' },
]
:
[
    { text: 'No.', value: 'id', sortable: true},
    { text: 'Metodólogo', value: 'reviewed_by.full_name', sortable: true},
    { text: 'Monitor', value: 'created_by.full_name', sortable: true},
    { text: 'CC del Monitor', value: 'created_by.document_number', sortable: true},
    { text: 'Beneficiario', value: 'full_name', sortable: true},
    { text: 'Municipio', value: "municipality.name"},
    { text: 'Estado', value: 'status'},
    { text: 'Acciones', value: 'fichasViewer' },
];


//traer el listado de fichas de inscripción de monitores 
//filtrado para este rol
//ordenado con status.slug = 'ENR' primero
const data = ref([]);

const items = ref<Item[]>([]);

onMounted(async () => {
    const res = await beneficiary.getAllUR();
    data.value = res?.data;
	items.value = await res?.data.items;
});



const getFichaData = () => data.value;

const updateFichaData = (id:any, data:any) => {
    let ficha = data.value.find(o=>o.id=== id);
    if(ficha){
        ficha.status = data.status;
        ficha.reviewed_by = data.reviewed_by;
    }else{
        return {status: false, msj: "no se encontró un objeto con este id"}
    }
}
/*
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
        ficha.status.slug="ENR";        
    }
    else{
        return {status: false, msj: "no se encontró un objeto con este id"}
    }
    console.log(ficha)
    console.log(data.value)
}*/
const loadmethods = {
    /*"APR": aceptar,
    "REC": rechazar,
    "ENR": revertir,*/
    "DATA": getFichaData,
    "UPDATE": updateFichaData,
}

const search = ref('');

const cruddata = computed(() => searchData(items.value, search.value) );

//#endregion


function getObjectKey(obj:any, value:any) {
  return Object.keys(obj).find(key => obj[key] === value);
}
</script>
<template>
    <!--<div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Revisar las fichas de inscripción de los monitores</h2>
    </div>-->

    <div v-if="currentUser.rol==='asistente_administrativo' || currentUser.rol==='coordinador_regional' || currentUser.rol==='metodologo' || currentUser.rol==='super.root'"
    class="p-5 mt-5 intro-y box">
        <CommonInput
			type="search"
			name="search"
			v-model="search"
			placeholder="Buscar" />

        <Crud :headers="headers" :items="cruddata" :Form="{...Form}" :payloadFunctions="loadmethods"/>
    </div>

    <div v-else class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">No tienes permisos para ver esta información</h2>
    </div>
    

</template>

