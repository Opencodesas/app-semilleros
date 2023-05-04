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
//console.log();

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
//ordenado con status.slug = 'ENR' primero
const data = ref([
{
    "id": 1,
        "registration_date": null,
        "affiliation_type": "SUB",
         //datos del monitor asociado
        "created_by": {
            "id": 19,
            "name": "Monitor",
            "lastname": null,
            "address": null,
            "document_number": null,
            "document_type": null,
            "phone": null,
            "gender": null,
            "profile_photo_path": null,
            "email": "monitor@ssiset.com",
            "email_verified_at": null,
            "two_factor_secret": null,
            "two_factor_recovery_codes": null,
            "created_by": null,
            "revised_by": null,
            "status": "ENREV",
            "rejection_message": null,
            "created_at": "2023-04-25T02:08:11.000000Z",
            "updated_at": "2023-04-25T02:08:11.000000Z",
            "deleted_at": null
        },
        "group_id": null,
        "full_name": "Alaina Schamberger",
        "institution": null,
        "accept": "0",
        "linkage_project": "PMIE",
        "participant_type": "C",
        "type_document": null,
        "document_number": "72192513",
        "zone": "R",
        "stratum": "6",
        "phone": "71387974",
        "email": "gislason.shea@example.org",
        "file": null,
        //datos de ficha
        "status": {
            "id": 1,
            "name": "Aprobado",
            "slug": "APR",
            "created_at": "2023-04-25T02:10:27.000000Z",
            "updated_at": "2023-04-25T02:10:27.000000Z",
            "deleted_at": null
        },
        "municipality": null,
        "audited": "0",
        "rejection_message": null,
        "referrer_name": null,
        "created_at": "2023-04-26T05:54:46.000000Z",
        "disciplines_id": null,
        "birth_date": null,
        "origin_place": "Origin place demo",
        "home_address": "Demo address",
        "conflict_victim": "0",
        "distric": "Demo distric",
        "gender": "M",
        "ethnicities_id": null,
        "disability": "0",
        "other_disability": null,
        "pathology": "1",
        "what_pathology": null,
        "blood_type": "2",
        "live_with": "Demo live_with",
        "scholarship": "1",
        "scholar_level": null,
        "health_entity_id": null,
        "know_guardian": {
            "id": 1,
            "id_guardian": 1,
            "id_beneficiary": 1,
            "relationship": "Prima",
            "find_out": "[]",
            "social_media": "[]",
            "created_at": "2023-04-26T05:55:06.000000Z",
            "updated_at": "2023-04-26T05:55:06.000000Z",
            "guardian": {
                "id": 1,
                "cedula": "66815276",
                "firts_name": "Tobin",
                "last_name": "Stamm",
                "email": "vbernier@example.org",
                "phone_number": "(505) 419-0683",
                "created_at": "2023-04-26T05:54:36.000000Z",
                "updated_at": "2023-04-26T05:54:36.000000Z"
            }
        },
        "acudiente": {
            "id": 1,
            "cedula": "66815276",
            "firts_name": "Tobin",
            "last_name": "Stamm",
            "email": "vbernier@example.org",
            "phone_number": "(505) 419-0683",
            "created_at": "2023-04-26T05:54:36.000000Z",
            "updated_at": "2023-04-26T05:54:36.000000Z"
        },
        "tamizaje": null,
        //datos usuario calificador
        "revised_by": {
            "id": 10,
            "name": "Apoyo administrativo",
            "lastname": null,
            "address": null,
            "document_number": null,
            "document_type": null,
            "phone": null,
            "gender": null,
            "profile_photo_path": null,
            "email": "apoyo_administrativo@ssiset.com",
            "email_verified_at": null,
            "two_factor_secret": null,
            "two_factor_recovery_codes": null,
            "created_by": null,
            "revised_by": null,
            "status": "ENREV",
            "rejection_message": null,
            "created_at": "2023-04-25T02:08:08.000000Z",
            "updated_at": "2023-04-25T02:08:08.000000Z",
            "deleted_at": null
        },
        "status_id": 1,
        //datos del beneficiario (de la ficha)
        ficha_data: {...fiicha},
    },
    {
        //datos de ficha
        id: 1,
        status: {
			name: 'En revision',
			slug: 'ENR',
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
			slug: 'ENR',
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
        ficha.status.slug="ENR";        
    }
    else{
        return {status: false, msj: "no se encontró un objeto con este id"}
    }
    console.log(ficha)
    console.log(data.value)
}
const loadmethods = {"APR": aceptar, "REC": rechazar, "ENR": revertir, "DATA": getFichaData}

const search = ref('');
const cruddata = computed(() => searchData(items, search.value));
//#endregion
</script>
<template>

    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Fichas de Inscripción de tus Monitores</h2>
    </div>
    <div class="p-5 mt-5 intro-y box">
        <CommonInput
			type="search"
			name="search"
			v-model="search"
			placeholder="Buscar" />

        <Crud :headers="headers" :items="cruddata" :Form="{...Form}" :payloadFunctions="loadmethods"/>
    </div>

</template>

