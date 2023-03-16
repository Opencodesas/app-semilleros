<script setup lang="ts">
import { addFile } from "@/types/filepond";
import { email, required } from "@vuelidate/validators";
import CommonFile from "@/components/CommonFile.vue";
import useVuelidate from "@vuelidate/core";
import Swal, { SweetAlertIcon } from "sweetalert2";
import FormSwitch from "@/base-components/Form/FormSwitch";
import { onboardingStore } from "@/stores/onboardingStore";
import { formToJSON } from "axios";
import { json } from "stream/consumers";
import { forEach } from "lodash";

const store = onboardingStore();

const form = reactive({
    observations: "",
    monitor: "",
    municipalities: "",
    event_support: "",
    hour_visit: "",
    disciplines: "",
    sidewalk: "",
    sports_scene: "",
    beneficiary_coverage: "",
    evaluations: "",
    date_visit: "",
    swich_plans_r: false,
    swich_plans_gm1: false,
    swich_plans_gm2: false,
    swich_plans_gm3: false,
    swich_plans_gm4: false,
    swich_plans_sc_1: false,
    swich_plans_sc_2: false,
    swich_plans_sc_3: false,
    swich_plans_sc_4: false,
    swich_plans_gm_1: false,
    swich_plans_gm_2: false,
    swich_plans_gm_3: false,
    swich_plans_gm_4: false,
    swich_plans_gm_5: false,
    swich_plans_gm_6: false,
    swich_plans_mp_1: false,
    swich_plans_mp_2: false,
    swich_plans_mp_3: false,
    swich_plans_mp_4: false,
    swich_plans_mp_5: false,
});

const form_rules = computed(() => ({
    observations: { required },
    monitor: { required },
    municipalities: { required },
    event_support: { required },
    hour_visit: { required },
    disciplines: { required },
    sidewalk: { required },
    sports_scene: { required },
    beneficiary_coverage: { required },
    evaluations: { required },
    date_visit: { required },

    swich_plans_r: { required },
    swich_plans_gm1: { required },
    swich_plans_gm2: { required },
    swich_plans_gm3: { required },
    swich_plans_gm4: { required },
    swich_plans_sc_1: { required },
    swich_plans_sc_2: { required },
    swich_plans_sc_3: { required },
    swich_plans_sc_4: { required },
    swich_plans_gm_1: { required },
    swich_plans_gm_2: { required },
    swich_plans_gm_3: { required },
    swich_plans_gm_4: { required },
    swich_plans_gm_5: { required },
    swich_plans_gm_6: { required },
    swich_plans_mp_1: { required },
    swich_plans_mp_2: { required },
    swich_plans_mp_3: { required },
    swich_plans_mp_4: { required },
    swich_plans_mp_5: { required },
}));

const municipalities = ref([]);
const disciplinesList = ref([]);
const monitorList = [
    { label: "Joselito", value: 1 },
    { label: "Miguelito", value: 2 },
];
const event_supportList = [
    { label: "Si", value: 1 },
    { label: "No", value: 2 },
];
const evaluationList = [
    { label: "Aceptada", value: 1 },
    { label: "Rechazada", value: 2 },
];
const v$ = useVuelidate(form_rules, form);

const router = useRouter();
const route = useRoute();

const routeName = computed(() => {
    return String(route.name).split(".")[0];
});
var mun = [];
const fetch = async () => {
    await store.getListSelect().then((response) => {
        console.log(`data fetch: ${response?.data}`);
        if (response?.status == 200 || response?.status == 201) {
            municipalities.value = JSON.parse(JSON.stringify(response.data["municipalities"]));
            disciplinesList.value = JSON.parse(JSON.stringify(response.data["diciplines"]));
        } else {
            Swal.fire("", "No se pudieron obtener los datos", "error");
        }
    });
};
onMounted(() => {
    fetch();
});
const onSubmit = async () => {
    const valid = await v$.value.$validate();

    if (valid) {
        Swal.fire("", "Creación exitosa!", "success");
        setLoading(true);
        router.push("index").finally(() => {
            setLoading(false);
        });
    } else {
        alerts.validation();
    }
};
</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <div class="flex items-center space-x-4">
            <CommonBackButton :to="'subdirector_visit.index'" title="Listado" />
            <h2 class="mr-auto text-lg font-medium">Registrar visita</h2>
        </div>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <CommonInput type="date" label="Fecha  *" name="date_visit" v-model="form.date_visit" :validator="v$" />
            <CommonInput type="time" label="Hora  *" name="hour_visit" v-model="form.hour_visit" :validator="v$" />
            <CommonSelect label="Municipio *" name="municipalities" v-model="form.municipalities" :validator="v$"
                :options="municipalities" />

            <CommonInput type="text" placeholder="Ingrese" label="Corregimiento / Vereda *" name="sidewalk"
                v-model="form.sidewalk" :validator="v$" />
            <CommonSelect label="Monitor *" name="monitor" v-model="form.monitor" :validator="v$"
                :options="monitorList" />
            <CommonSelect label="Diciplinas *" name="disciplines" v-model="form.disciplines" :validator="v$"
                :options="disciplinesList" />
            <CommonInput type="text" placeholder="Ingrese" label="Escenario deportivo *" name="sports_scene"
                v-model="form.sports_scene" :validator="v$" />
            <CommonInput type="text" placeholder="Ingrese" label="Cobertura de benificiario *"
                name="beneficiary_coverage" v-model="form.beneficiary_coverage" :validator="v$" />
            <CommonSelect label="Evaluacion *" name="evaluations" v-model="form.evaluations" :validator="v$"
                :options="evaluationList" />
            <CommonSelect label="Apoyo a eventos *" name="event_support" v-model="form.event_support" :validator="v$"
                :options="event_supportList" />

            <!--  -->
        </div>
    </div>
    <div class="w-full py-6 mx-auto">
        <h2 class="text-center mr-auto text-lg font-medium">Requerimientos</h2>
    </div>
    <div class="p-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly"></div>

        <FormSwitch.Input name="swich_plans" id="swich_plans" type="checkbox" v-model="form.swich_plans_r"
            :validator="v$" />
        <FormSwitch.Label htmlFor="swich_plans"> Plan de clases </FormSwitch.Label>
    </div>
    <div class="w-full py-6 mx-auto">
        <h2 class="text-center mr-auto text-lg font-medium">Sesión de clase</h2>
    </div>
    <div class="p-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <FormSwitch>
                <FormSwitch.Input name="swich_plans_sc_1" id="swich_plans_sc_1" type="checkbox"
                    v-model="form.swich_plans_sc_1" />
                <FormSwitch.Label htmlFor="swich_plans_sc_1">
                    Plantea actividades congruentes para el cumplimiento de los objetivos de la
                    sesión de clase
                </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_sc_2" id="swich_plans_sc_2" type="checkbox"
                    v-model="form.swich_plans_sc_2" />
                <FormSwitch.Label htmlFor="swich_plans_sc_2">
                    Desarrolla el componente técnico deportivo del mes
                </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_sc_3" id="swich_plans_sc_3" type="checkbox"
                    v-model="form.swich_plans_sc_3" />
                <FormSwitch.Label htmlFor="swich_plans_sc_3">
                    Tiene buen manejo de grupo en el desarrollo de las actividades
                </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_sc_4" id="swich_plans_sc_4" type="checkbox"
                    v-model="form.swich_plans_sc_4" />
                <FormSwitch.Label htmlFor="swich_plans_sc_4">
                    Desarrolla el componente funcional del mes
                </FormSwitch.Label>
            </FormSwitch>
        </div>
    </div>
    <div class="w-full py-6 mx-auto">
        <h2 class="text-center mr-auto text-lg font-medium">Generalidades del monitor</h2>
    </div>
    <div class="p-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <FormSwitch>
                <FormSwitch.Input name="swich_plans_gm_1" id="swich_plans_gm_1" type="checkbox"
                    v-model="form.swich_plans_gm_1" />
                <FormSwitch.Label htmlFor="swich_plans_gm_1"> Puntualidad </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_gm_2" id="swich_plans_gm_2" type="checkbox"
                    v-model="form.swich_plans_gm_2" />
                <FormSwitch.Label htmlFor="swich_plans_gm_2">
                    Presentacion personal - uniforme del Proyecto
                </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_gm_3" id="swich_plans_gm_3" type="checkbox"
                    v-model="form.swich_plans_gm_3" />
                <FormSwitch.Label htmlFor="swich_plans_gm_3"> Paciente </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_gm_4" id="swich_plans_gm_4" type="checkbox"
                    v-model="form.swich_plans_gm_4" />
                <FormSwitch.Label htmlFor="swich_plans_gm_4"> Disciplina </FormSwitch.Label>
            </FormSwitch>
            <FormSwitch>
                <FormSwitch.Input name="swich_plans_gm_5" id="swich_plans_gm_5" type="checkbox"
                    v-model="form.swich_plans_gm_5" />
                <FormSwitch.Label htmlFor="swich_plans_gm_5">
                    Comunicación alumnos y padres
                </FormSwitch.Label>
            </FormSwitch>
            <FormSwitch>
                <FormSwitch.Input name="swich_plans_gm_6" id="swich_plans_gm_6" type="checkbox"
                    v-model="form.swich_plans_gm_6" />
                <FormSwitch.Label htmlFor="swich_plans_gm_6">
                    Verbalización clara y simple
                </FormSwitch.Label>
            </FormSwitch>
        </div>
    </div>
    <div class="w-full py-6 mx-auto">
        <h2 class="text-center mr-auto text-lg font-medium">Modelo pedagógico del monitor</h2>
    </div>
    <div class="p-5 intro-y box">
        <div class="grid grid-cols-3 md:grid md:grid-cols-3 gap-6 justify-evenly">
            <FormSwitch>
                <FormSwitch.Input name="swich_plans_mp_1" id="swich_plans_mp_1" type="checkbox"
                    v-model="form.swich_plans_mp_1" />
                <FormSwitch.Label htmlFor="swich_plans_mp_1">
                    Modelo pedagógico del monitor
                </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_mp_2" id="swich_plans_mp_2" type="checkbox"
                    v-model="form.swich_plans_mp_2" />
                <FormSwitch.Label htmlFor="swich_plans_mp_2"> Conductual </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_mp_3" id="swich_plans_mp_3" type="checkbox"
                    v-model="form.swich_plans_mp_3" />
                <FormSwitch.Label htmlFor="swich_plans_mp_3"> Romantico </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_mp_4" id="swich_plans_mp_4" type="checkbox"
                    v-model="form.swich_plans_mp_4" />
                <FormSwitch.Label htmlFor="swich_plans_mp_4"> Constructivista </FormSwitch.Label>
            </FormSwitch>

            <FormSwitch>
                <FormSwitch.Input name="swich_plans_mp_5" id="swich_plans_mp_5" type="checkbox"
                    v-model="form.swich_plans_mp_5" />
                <FormSwitch.Label htmlFor="swich_plans_mp_5">
                    Integrador – globalizador
                </FormSwitch.Label>
            </FormSwitch>
        </div>
    </div>
    <div class="p-5 mt-6 intro-y box">
        <CommonTextarea label="Observaciones *" placeholder="Ingrese las observaciones" name="observations"
            v-model="form.observations" :validator="v$" />
    </div>
    <div class="p-5 mt-6 intro-y box">
        <Dropzone refKey="dropzoneValidationRef" :options="{
            url: 'https://httpbin.org/post',
            thumbnailWidth: 150,
            maxFilesize: 0.5,
            maxFiles: 1,
            acceptedFiles: 'image/jpeg|image/png|image/jpg',
            headers: { 'My-Awesome-Header': 'header value' },
        }" class="dropzone">
            <div class="text-lg font-medium">Drop files here or click to upload.</div>
        </Dropzone>
    </div>
    <div class="mt-6 flex justify-end col-span-1 md:col-span-2">
        <Button variant="primary" class="btn btn-primary" @click="onSubmit">
            Registrar
        </Button>
    </div>
</template>
