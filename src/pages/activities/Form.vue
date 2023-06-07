<script setup lang="ts">
import { minLength, required } from '@vuelidate/validators'
//import CommonFile from '@/components/CommonFile.vue'
import useVuelidate from '@vuelidate/core'
import Swal from "sweetalert2"
import { onboardingStore } from "@/stores/onboardingStore";
import { filePondValue } from "@/composables/useFilepondEvents";
import { FormSwitch } from '@/base-components/Form';
import { selectOption } from '@/components/CommonSelect.vue';

const storeOnboarding = onboardingStore(); //datos del usuario  
const { multiple } = useFilepondEvents();

//#region rutas
const router = useRouter()
const route = useRoute()

const routeName = computed(() => {
    return String(route.name).split('.')[0]
})
//#endregion

//#region backend-data

const userdata = {
    id: "11511231234",
    name: "Arturo Marulanda",
    epsName: "Sura",
    arlName: "POSITIVA",
    pensionName: "PROTECCION",
    epsValue: '',
    arlValue: '',
    pensionValue: '',
}
const contractdata =[
{
    id: "1",
    cuote: "$ 6.600.000",
    periodStart: "14/2/2023",
    periodEnd: "31/5/2023",
    periods: "3", 
},
{
    id: "2",
    cuote: "$ 5.500.000",
    periodStart: "14/2/2023",
    periodEnd: "31/5/2023",
    periods: "3", 
}
];
const budgetdata = {
        id: "100013",
        contract: 
            {...contractdata,
                userid: userdata.id,
                username: userdata.name,
                userEps: userdata.epsName,
            },
        state: "En Supervisión",
        validity: "abril 2023",
    };
const activities = [
    {nombre: "Actividad 1",
    desc: "Planear, organizar, direccionar y realizar control de los servicios administrativos en el desarrollo del proyecto Semilleros Deportivos",
    detail: "",
    },
    {nombre: "Actividad 2",
    desc: "Revisar, autorizar los pagos y control de la ejecución presupuestal del proyecto semilleros deportivos.",
    detail: "",
    },
    {nombre: "Actividad 3",
    desc: "Coordinar reuniones de planeación y seguimiento del proyecto",
    detail: "",
    },
    {nombre: "Actividad 4",
    desc: "Coordinar la gestión de adquisición de bienes, obras y servicios para el proyecto",
    detail: "",
    },
    {nombre: "Actividad 5",
    desc: "Realizar proyecciones de flujo de caja en la ejecución del proyecto.",
    detail: "",
    },
    {nombre: "Actividad 6",
    desc: "Revisar y aprobar los informes del Proyecto para correspondientes desembolsos requeridos por la supervisión del proyecto.",
    detail: "",
    },
    {nombre: "Actividad 7",
    desc: "Atender los requerimientos administrativos y/o PQRS en el marco del proyecto.",
    detail: "",
    },
    {nombre: "Actividad 8",
    desc: "Convocar y/o asistir a eventos, capacitaciones, conferencias, reuniones que le sean citadas del proyecto, de carácter presencial y/o virtual.",
    detail: "",
    },
    {nombre: "Actividad 9",
    desc: "Revisar y aprobar los informes presentados por los contratistas bajo supervisión para la verificación del proceso técnico y de pago.",
    detail: "",
    },
    {nombre: "Actividad 10",
    desc: "Elaborar el informe en el que dé cuenta de sus actividades realizadas.",
    detail: "",
    },
    {nombre: "Actividad 11",
    desc: "Las demás actividades afines o complementarias con las anteriores y que le sean asignadas y que correspondan a la naturaleza del contrato.",
    detail: "",
    },
]

const misActivitis = ref(JSON.parse(JSON.stringify(activities)));

//son los documentos de soporte que vienen de la base de datos
const files = ref([
    {
        number_doc: 1,
        title_doc: "Documento de afiliación a EPS",
        type: "pdf",
        file: "",
    },
    {
        number_doc: 2,
        title_doc: "Documento de afiliación a la ARL",
        type: "pdf",
        file: "",
    },
    {
        number_doc: 3,
        title_doc: "Documento de afiliación a Cesantías",
        type: "pdf",
        file: "",
    },
    {
        number_doc: 4,
        title_doc: "Documento de afiliación a Fondo de Pensiones",
        type: "pdf",
        file: "",
    },
]);
const filedisable = ref(true);

const addFile = () => {
    files.value.push({
        number_doc: files.value.length+1,
        title_doc: "Documento anexo",
        type: "pdf",
        file: "",
    });
    /*if(files.value.length>4)
    filedisable.value = false;*/
}
const removeFile = () => {
    if(files.value.length>4){
        if(files.value.length===5){files.value.pop();filedisable.value = true;return;}
    files.value.pop();
    }else{
        filedisable.value = true;
    }    
}
//#endregion

const selectContratos = [
    { label: "CPS-057", value: "1" },
    { label: "CPS-058", value: "2" },
];
const selectMounth = [
    { label: "Enero", value: "1" },
    { label: "Febrero", value: "2" },
    { label: "Marzo", value: "3" },
    { label: "Abril", value: "4" },
    { label: "Mayo", value: "5" },
    { label: "Junio", value: "6" },
    { label: "Julio", value: "7" },
    { label: "Agosto", value: "8" },
    { label: "Septiembre", value: "9" },
    { label: "Octubre", value: "10" },
    { label: "Noviembre", value: "11" },
    { label: "Diciembre", value: "12" },
];
const cuote = ref('');

//#region formValidations 
const form = reactive({
    contractId: '',
    cuote: '',
    period: '',
    nPlanilla: '',
    epsName: '',
    pensionName: '',
    arlName: '',
    epsValue: '',
    pensionValue: '',
    arlValue: '',
    soporteFile: [],
    activity: misActivitis.value,
    evidenciaVertical1:[],
    evidenciaVertical2:[],
    evidenciaHorizontal1:[],
    evidenciaHorizontal2:[],    
})


const form_rules = computed(() => ({
    contractId: {},
    cuote: {},
    period: {},
    nPlanilla: {},
    epsName: {},
    pensionName: {},
    arlName: {},
    epsValue: {},
    pensionValue: {},
    arlValue: {},
    soporteFile: {required},
    activity: {},
    evidenciaVertical1:{required},
    evidenciaVertical2:{required},
    evidenciaHorizontal1:{required},
    evidenciaHorizontal2:{required},
}))

const v$ = useVuelidate(form_rules, form);

const getCuote=()=>{
    const contractdataselected = contractdata.find(objeto=>objeto.id==form.contractId);
    cuote.value=contractdataselected?.cuote.toString()||'';
    form.cuote = cuote.value;
}
//#endregion

//#region form
const Vinfo = ref(false);
const Vplanilla = ref(false);
const Vactivitis = ref(false);

const onSubmit = async () => {
    //sube data

    //comprobar campos especiales
    if(form.contractId===''||form.cuote===''||form.period==='')
    {Vinfo.value = true;}else{ Vinfo.value = false; }

    if(form.epsName===''||form.epsValue===''||form.pensionName===''||form.pensionValue===''||form.arlName===''||form.arlValue==='')
    {Vplanilla.value = true;}else{ Vplanilla.value = false; }

    for (const act of form.activity)
    {
        if(!act.detail)
        {Vactivitis.value=true; break;}
        else{ if(act == form.activity[form.activity.length - 1]){Vactivitis.value=false;}}
    }

    const valid = await v$.value.$validate()
    if (valid) {
        if(Vinfo.value===true||Vplanilla.value===true||Vactivitis.value===true){alerts.validation(); return; }

        /*await service.create(formdataParser(form)).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    alerts.create()
                    setLoading(true)
                    router.push('budget').finally(() => {
                        setLoading(false)
                    })
                }
            }
        })*/

        alerts.update();
    }
    else {
        alerts.validation()
    } 
}
//#endregion

</script>
<style>
.grid-cols-4 {
    grid-template-columns:repeat(4, minmax(0, 1fr));
}
</style>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Información del Contrato</h2>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <CommonSelect label="Contrato" name="contractId" v-model="form.contractId" :options="selectContratos" :onblur="getCuote()" />
            <CommonInput type="text" name="cuote" label="Cuota" :placeholder="cuote" v-model="cuote" :mask="'money'" :disabled="true" />
            <div class="col-span-2">
                <CommonSelect label="Periodo de cotización" name="period" v-model="form.period" :options="selectMounth" />
            </div>
            <div :class="(!Vinfo&&'hidden')+' col-span-2 text-danger'">Debe diligenciar todos los campos</div>
        </div>
    </div>

    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Planilla Seguridad Social</h2>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <div class="col-span-2">
                <CommonInput type="number" name="nPlanilla" label="Número de planilla" v-model="form.nPlanilla" :placeholder="'0000000'" />
            </div>

            <CommonInput type="text" name="epsName" label="Nombre EPS" :placeholder="'Nombre EPS'" v-model="form.epsName"/>
            <CommonInput type="text" name="epsValue" label="Valor Pagado" v-model="form.epsValue" :placeholder="'$ 0.00'" :mask="'money'"/>

            <CommonInput type="text" name="pensionName" label="Nombre Pensión" :placeholder="'Nombre Pensión'" v-model="form.pensionName"/>
            <CommonInput type="text" name="pensionValue" label="Valor Pagado" v-model="form.pensionValue" :placeholder="'$ 0.00'" :mask="'money'"/>

            <CommonInput type="text" name="arlName" label="Nombre ARL" :placeholder="'Nombre ARL'" v-model="form.arlName"/>
            <CommonInput type="text" name="arlValue" label="Valor Pagado" v-model="form.arlValue" :placeholder="'$ 0.00'" :mask="'money'"/>
        </div>
        <div :class="(!Vplanilla&&'hidden')+' col-span-2 mt-5 text-danger'">Debe diligenciar todos los campos</div>
    </div>

    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Subir soporte</h2>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <div class="grid grid-cols-2 gap-6 justify-evenly">
            <div class="col-span-2">
                <CommonDropzone class="col-span-1" name="soporteFile"
                :accept-multiple="false"
                :accepted-files="'application/pdf'"
                v-model="form.soporteFile"
                @addfile="(error: any, value: filePondValue) =>
                {
                    form.soporteFile = multiple.addfile({ error, value }, form.soporteFile) as never[];
                    //form.soportes.file = form.filesblob.length.toString();

                }"
                @removefile="(error: any, value: filePondValue) =>
                {
                    //se quita la función de quitar file para evitar truncamiento de datos index
                    //form.filesblob = multiple.removefile({ error, value }, form.filesblob) as never[];
                    form.soporteFile = [];
                }"              
                :validator="v$" />
            </div>                
        </div>
    </div>

<div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Actividades</h2>
</div>

<div class="p-5 mt-5 intro-y box">
    <div class="grid grid-cols-4 gap-4 justify-evenly">
        <div class="font-bold text-center align-middle my-auto mb-4 col-span-2">
                <span class="px-2 py-1 mb-3">Nombre Actividad</span><hr/>
        </div>
        <div class="font-bold text-center align-middle my-auto mb-4 col-span-2">
            <span class="px-2 py-1 mb-3">Detalle de la actividad</span><hr/>
        </div>
        <template v-for="(activity, index) in misActivitis">
        <div class="font-medium text-center my-auto col-span-2">
            <span class="px-2 py-1">{{ activity.nombre }}</span><br/>
            <span class="px-2 py-1 font-normal">{{ activity.desc }}</span>
        </div>
        <div class="col-span-2"><CommonTextarea :placeholder="'descripción...'" class="'border-red-400'" :id="'activity_'+index" :name="'activity'" v-model="activity.detail" :validator="v$" /></div>
</template>
<div :class="(!Vactivitis&&'hidden')+' col-span-4 text-danger'">Debe diligenciar todas las descripciones</div>
</div>
</div>

<div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Evidencia Fotográfica</h2>
</div>

    <div class="p-5 mt-5 intro-y box">
        <div class="grid justify-stretch ustify-evenly grid-cols-2 gap-4 grid-flow-row auto-rows-max">
            <CommonDropzone class="col-span-1" name="evidenciaHorizontal1"
                :accept-multiple="false"
                v-model="form.evidenciaHorizontal1"
                @addfile="(error: any, value: filePondValue) =>
                {
                    form.evidenciaHorizontal1 = multiple.addfile({ error, value }, form.evidenciaHorizontal1) as never[];
                }"
                @removefile="(error: any, value: filePondValue) =>
                {
                    form.evidenciaHorizontal1 = [];
                }"              
                :validator="v$"/>
            <CommonDropzone class="col-span-1" name="evidenciaHorizontal2"
                :accept-multiple="false"
                v-model="form.evidenciaHorizontal2"
                @addfile="(error: any, value: filePondValue) =>
                {
                    form.evidenciaHorizontal2 = multiple.addfile({ error, value }, form.evidenciaHorizontal2) as never[];
                }"
                @removefile="(error: any, value: filePondValue) =>
                {
                    form.evidenciaHorizontal2 = [];
                }"              
                :validator="v$"/>    
            <h2 class="mr-auto col-span-2 text-lg font-medium mt-4 mb-5">Redes sociales</h2>
            <CommonDropzone class="col-span-1" name="evidenciaVertical1"
                v-model="form.evidenciaVertical1"
                @addfile="(error: any, value: filePondValue) =>
                {
                    form.evidenciaVertical1 = multiple.addfile({ error, value }, form.evidenciaVertical1) as never[];
                }"
                @removefile="(error: any, value: filePondValue) =>
                {
                    form.evidenciaVertical1 = [];
                }"              
                :validator="v$"/>
            <CommonDropzone class="col-span-1" name="evidenciaVertical2"
                :accept-multiple="false"
                v-model="form.evidenciaVertical2"
                @addfile="(error: any, value: filePondValue) =>
                {
                    form.evidenciaVertical2 = multiple.addfile({ error, value }, form.evidenciaVertical2) as never[];
                }"
                @removefile="(error: any, value: filePondValue) =>
                {
                    form.evidenciaVertical2 = [];
                }"              
                :validator="v$"/>            
        </div>
        
    <div class="flex justify-end col-span-1 md:col-span-2 mt-10 pt-5">
        <Button variant="primary"
        class="btn btn-primary hover:animate-pulse"
        @click="onSubmit">
            <Lucide icon="Save" class="mr-2"/>
            Guardar y Enviar
        </Button>
        
    </div>
</div>

</template>