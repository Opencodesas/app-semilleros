<script setup lang="ts">
import { minLength, required } from '@vuelidate/validators'
//import CommonFile from '@/components/CommonFile.vue'
import useVuelidate from '@vuelidate/core'
import Swal from "sweetalert2"
import { onboardingStore } from "@/stores/onboardingStore";
import { filePondValue } from "@/composables/useFilepondEvents";
import { FormSwitch } from '@/base-components/Form';

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


/*
const userdata = {
    id: "11511231234",
    name: "Arturo Marulanda",
    epsName: "Sura",
    arlName: "POSITIVA",
    pensionName: "PROTECCION",
    epsValue: "1.5",
    arlValue: "0.522",
    pensionValue: "0.16",
}
const contractdata =
{
    id: "CPS-057",
    cuote: "$ 6.600.000",
    periodStart: "14/2/2023",
    periodEnd: "31/5/2023",
    periods: "3", 
};
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
*/

const activities = [
    {nombre: "Actividad 1",
    desc: "Apoyar y fortalecer el proceso de vinculación de las niñas, niños, adolescentes y jóvenes al proyecto, por medio de socializaciones en colegios, parques o espacios donde se encuentre la población",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 2",
    desc: "Diligenciar las fichas de inscripción y tamizaje de los beneficiarios de acuerdo al indicador por disciplina deportiva, y reportar el retiro de los beneficiarios y el ingreso de beneficiarios de remplazo durante la ejecución del contrato, si aplica",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 3",
    desc: "Implementar las orientaciones técnicas recibidas por parte del metodólogo como estrategia de fortalecimiento de los procesos de enseñanza - aprendizaje, para brindar un proceso de calidad",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 4",
    desc: "Realizar la práctica deportiva con los beneficiarios de acuerdo a los contenidos establecidos en el plan clase entregado por el equipo técnico, sobre la disciplina a su cargo",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 5",
    desc: "Mantener permanente y buena comunicación con el equipo del proyecto, los padres de familia, los líderes deportivos y sociales y los beneficiarios",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 6",
    desc: "Implementar con sus beneficiarios las actividades del programa semilleros transversales en compañía de las psicólogas, metodólogos y coordinadores de la región",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 7",
    desc: "Asistir a eventos, capacitaciones, conferencias, reuniones que le sean citadas por el programa, de carácter presencial y/o virtual",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 8",
    desc: "Elaborar y presentar el informe sobre los avances y el desarrollo del proceso según las orientaciones impartidas por el equipo técnico del proyecto y presentar al metodólogo para su aprobación",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 9",
    desc: "Elaborar el cronograma de prácticas deportivas y realizar actualizaciones si aplica",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 10",
    desc: "Realizar la convocatoria a padres y/o acudientes para el desarrollo de los semilleros de familia y asesorías personalizadas que lideran las psicólogas en el marco del proyecto Semilleros Deportivos",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 11",
    desc: "Realizar una vez al mes convocatoria para reunión de padres de familia y/o acudientes con el fin de dar orientación sobre el desarrollo técnico, deportivo y administrativo de los beneficiarios",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 12",
    desc: "Apoyar en el desarrollo de activación de rutas de violencia sexual de género en relación a los niños, niñas, adolescentes y jóvenes, de acuerdo a la normativa colombiana",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 13",
    desc: "Garantizar la gratuidad del programa en los Municipios y su enfoque diferencial",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 14",
    desc: "Elaborar el informe en el que dé cuenta de las actividades realizadas",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 15",
    desc: "Las demás actividades afines o complementarias con las anteriores y que le sean asignadas y que correspondan a la naturaleza del cargo",
    detail: "",
    make: false,
    },
]
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
const filesblob = ref([]);
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
const evidence = ref([]);
//#endregion

//#region formValidations 
const form = reactive({
    soportes: [...files.value],
    filesblob: [...filesblob.value],
    activity: [...activities],
    evidencias: [...evidence.value],
    department: "",

    periodo: "mayo",
    planilla: "",
    eps: "",
    arl: "",
    pension: "",
})


const form_rules = computed(() => ({
    soportes: {
    },
    activity: {
        $each: {
            detail: { required }
        }
    },
    evidencias: {
        //required, minLength: minLength(4),
    },
    filesblob: {
        //required, minLength: minLength(4)
    },
}))

const v$ = useVuelidate(form_rules, form)
//#endregion

//#region form

const onSubmit = async () => {
    const valid = await v$.value.$validate()
    if (valid) {

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
        let lastinfo = localStorage.getItem("cuenta de cobro");
        if(lastinfo){lastinfo = JSON.parse(lastinfo);}
        const today = new Date();
        const thedata = lastinfo==null?
        [{id:'1', ...form, user: {...TheUserData}, /*budgetdata,*/ create: today.getMonth()+"-"+today.getDay()+"-"+today.getFullYear(), budgetstatus: {state: "En Revisión", slug: "ERV", fase: "En supervisión"},}]
        :
        [...lastinfo, {id:'1', ...form, user: {...TheUserData}, /*budgetdata,*/ create: today.getMonth()+"-"+today.getDay()+"-"+today.getFullYear(), budgetstatus: {state: "En Revisión", slug: "ERV", fase: "En supervisión"},}]

        ;
        
        localStorage.setItem("cuenta de cobro", JSON.stringify(thedata));
        Swal.fire('', '¡La Cuenta de Cobro se creó exitosamente!', 'success')
        setLoading(true)
        router.replace('active').finally(() => {
            setLoading(false)
        })
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
        <!--<CommonBackButton class="mr-5 hover:animate-pulse" :to="'budget.index'" title="Volver" />
        <h2 class="mr-auto text-lg font-medium">Formato Cuenta de Cobro de {{ storeOnboarding.get_user_role?.name }}</h2>
        <CommonFormState class="text-center mr-5" :contract_status="budgetdata.state" />
        <CommonFormState class="text-right ml-2" :consecutive="budgetdata.id" />-->
    </div>

    
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Información del Contrato</h2>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <CommonInput type="text" name="person.name" label="Contrato" placeholder="Seleccionar" v-model="TheUserData.NODECONTRATO" :disabled="true"/>
            <CommonInput type="text" name="person.name" label="Cuota" placeholder="Seleccionar" v-model="TheUserData.VALORCUOTAINCLUIDOMOVILIZACION" :disabled="true"/>
            <!--<CommonSelect label="Departamento *" name="department" v-model="form.department" :validator="v$" :options="departments" />-->
        </div>
    </div>

    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Planilla Seguridad Social</h2>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <!--<h1 class="m-4 col-span-2 text-xl bold text-left text-gray-800"> Planilla Seguridad Social </h1>-->
            <CommonInput type="text" name="person.name" label="Periodo de cotización" v-model="form.periodo" :disabled="true"/>
            <CommonInput type="text" name="person.name" label="Número de planilla" v-model="form.planilla" :placeholder="'123456789'"/>

            <CommonInput type="text" name="person.name" label="Nombre EPS" v-model="TheUserData.ENTIDADPROMOTORADESALUD"/>
            <CommonInput type="text" name="person.name" label="Valor Pagado" v-model="form.eps" :placeholder="'$ 0.00'"/>

            <CommonInput type="text" name="person.name" label="Nombre ARL" v-model="TheUserData.ARL"/>
            <CommonInput type="text" name="person.name" label="Valor Pagado" v-model="form.arl" :placeholder="'$ 0.00'"/>

            <CommonInput type="text" name="person.name" label="Nombre Pensión" v-model="TheUserData.FONDODEPENSIONES"/>
            <CommonInput type="text" name="person.name" label="Valor Pagado" v-model="form.pension" :placeholder="'$ 0.00'"/>
        </div>
    </div>

    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Subir documentos de soporte</h2>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <template v-for="(soportefile, index) in files">
                <CommonDropzone class="col-span-2" name="soportes" :label="soportefile.number_doc+'. '+soportefile.title_doc"
                :accept-multiple="false"
                :accepted-files="'application/pdf'"
                v-model="form.soportes[index].file"
                @addfile="(error: any, value: filePondValue) =>
                {
                    form.filesblob = multiple.addfile({ error, value }, form.filesblob) as never[];
                    form.soportes[index].file = form.filesblob.length.toString();

                }"
                @removefile="(error: any, value: filePondValue) =>
                {
                    //se quita la función de quitar file para evitar truncamiento de datos index
                    //form.filesblob = multiple.removefile({ error, value }, form.filesblob) as never[];
                    form.soportes[index].file = '';
                }"
                :validator="v$" />

                <!--Comprobar el orden de los arvhicos-->
                <!--{{ form.soportes[index].file }}-->
                <!-- Se almacena en file el index del archivo en la lista filesblobs, se tendrá que unificar el objectfile antes de subir al back-->
            </template>
            <!--Aqui mostramos el orden de un filesblobs para ver el nombre del archvio y si el orden coinicde-->
            <!--{{ form.filesblob[0]?.name + form.filesblob[1]?.name + form.filesblob[2]?.name + form.filesblob[3]?.name }}-->
        </div>

        <!-- Botones agregar quitar docuemntos - para otros roles
            <div class="flex justify-end col-span-1 md:col-span-2 mt-5">
            <Button variant="secondary" class="btn btn-primary hover:animate-pulse" @click="addFile">
                <Lucide icon="FilePlus" class="mr-2"/>
                Añadir soporte
            </Button>
            <Button variant="secondary" :disabled="filedisable" class="btn btn-primary ml-auto hover:animate-pulse" @click="removeFile">
                <Lucide icon="FileMinus" class="mr-2"/>
                Quitar soporte
            </Button>
        </div>-->
    </div>

<div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Actividades</h2>
</div>

<div class="p-5 mt-5 intro-y box">
    <div class="grid grid-cols-5 gap-2 justify-evenly">

        <div class="font-bold text-center align-middle my-auto mb-4 col-span-2">
                <span class="px-2 py-1 mb-3">Nombre Actividad</span><hr/>
        </div>
        <div class="font-bold text-center align-middle my-auto mb-4">
                <span class="px-2 py-1 mb-3">¿Fue realizada?</span><hr/>
        </div>
        <div class="font-bold text-center align-middle my-auto mb-4 col-span-2">
            <span class="px-2 py-1 mb-3">Detalle de la actividad</span><hr/>
        </div>

        <template v-for="(myactivity, index) in form.activity">

            <div class="font-medium text-justify my-auto mt-2 mb-3 col-span-2">
                <span class="px-2 py-1">{{ myactivity.nombre }}</span><br/>
                <span class="px-2 py-1 font-normal">{{ myactivity.desc }}</span>
            </div>
            
            <FormSwitch class="mx-auto">
                <FormSwitch.Input :name="`swich_activity_${index}`" :id="`swich_activity_${index}`"
                type="checkbox"
                v-model="myactivity.make" />
            </FormSwitch>
    
            <div class="col-span-2">
                <CommonTextarea :name="`activity_${index}`" :validator="v$" :placeholder="'detalles'" v-model="myactivity.detail"/>
            </div>
        </template>
    </div>
</div>
<!--{{ form.activity }}-->

    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Evidencia Fotográfica</h2>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <CommonDropzone class="col-span-2" name="evidencias" label="Suba los archivos"
            :accept-multiple="true"
            v-model="form.evidencias"
            @addfile="(error: any, value: filePondValue) =>
            { form.evidencias = multiple.addfile({ error, value }, form.evidencias) as never[] }"
            @removefile="(error: any, value: filePondValue) =>
            { form.evidencias = multiple.removefile({ error, value }, form.evidencias) as never[] }"
            :validator="v$" />
            
        </div><!---->
        
        
    <div class="flex justify-end col-span-1 md:col-span-2 mt-5">
        <Button variant="primary"
        class="btn btn-primary hover:animate-pulse"
        :isabled="!(form.activity[form.activity.length-1].detail!=''
        && form.soportes.length>=files.length
        && form.evidencias.length>=4)"
        @click="onSubmit">
            <Lucide icon="Save" class="mr-2"/>
            Guardar y Enviar
        </Button>
        
    </div>
</div>

</template>