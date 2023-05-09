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

const userdata = {
    id: "11511231234",
    name: "Arturo Marulanda",
    epsName: "Salud Total",
}
const contractdata =
{
    id: "0010",
    cuote: "$ 1.500.000",
    periodStart: "1-15-2023",
    periodEnd: "12-15-2023",
    periods: "12", 
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
const activities = [
    {nombre: "Actividad 1",
    desc: "Realizar la actividad 1",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 2",
    desc: "Realizar la actividad 2",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 3",
    desc: "Realizar la actividad 3",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 4",
    desc: "Realizar la actividad 4",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 5",
    desc: "Realizar la actividad 5",
    detail: "",
    make: false,
    },
    {nombre: "Actividad 6",
    desc: "Realizar la actividad 6",
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

        await validity_periodsServices.create(formdataParser(form)).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    alerts.create()
                    setLoading(true)
                    router.push('budget').finally(() => {
                        setLoading(false)
                    })
                }
            }
        })
        Swal.fire('', '¡La Cuenta de Cobro se creó exitosamente!', 'success')
        setLoading(true)
        router.replace('budget').finally(() => {
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
            <CommonInput type="text" name="person.name" label="Contrato" placeholder="Seleccionar" v-model="budgetdata.contract.id" />
            <CommonInput type="text" name="person.name" label="Cuota" placeholder="Seleccionar" v-model="budgetdata.contract.username"/>
            <!--<CommonSelect label="Departamento *" name="department" v-model="form.department" :validator="v$" :options="departments" />-->
        </div>
    </div>

    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Planilla Seguridad Social</h2>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <!--<h1 class="m-4 col-span-2 text-xl bold text-left text-gray-800"> Planilla Seguridad Social </h1>-->
            <div class="col-span-2"><CommonInput type="text" name="person.name" label="Periodo de cotización" v-model="budgetdata.contract.username"/></div>
            <div class="col-span-2"><CommonInput type="text" name="person.name" label="Número de planilla" v-model="budgetdata.contract.username"/></div>

            <CommonInput type="text" name="person.name" label="Nombre EPS" v-model="budgetdata.contract.username"/>
            <CommonInput type="text" name="person.name" label="Valor Pagado" v-model="budgetdata.contract.username"/>

            <CommonInput type="text" name="person.name" label="Nombre ARL" v-model="budgetdata.contract.username"/>
            <CommonInput type="text" name="person.name" label="Valor Pagado" v-model="budgetdata.contract.username"/>

            <CommonInput type="text" name="person.name" label="Nombre Pensión" v-model="budgetdata.contract.username"/>
            <CommonInput type="text" name="person.name" label="Valor Pagado" v-model="budgetdata.contract.username"/>
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
    <div class="grid grid-cols-4 gap-4 justify-evenly">

        <div class="font-bold text-center align-middle my-auto mb-4">
                <span class="px-2 py-1 mb-3">Nombre Actividad</span><hr/>
        </div>
        <div class="font-bold text-center align-middle my-auto mb-4">
                <span class="px-2 py-1 mb-3">¿Fue realizada?</span><hr/>
        </div>
        <div class="font-bold text-center align-middle my-auto mb-4 col-span-2">
            <span class="px-2 py-1 mb-3">Detalle de la actividad</span><hr/>
        </div>

        <template v-for="(myactivity, index) in form.activity">

            <div class="font-medium text-center my-auto">
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

            sdf
            
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