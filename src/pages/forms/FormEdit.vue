<template>
  <div class="flex items-center mt-8 intro-y">
    <div class="flex items-center space-x-4">
            <CommonBackButton :to="'beneficiaries.index'" title="Listado" />
            <h2 class="mr-auto text-lg font-medium">BENEFICIARIOS</h2>
        </div>
  </div>
  <div class="p-5 mt-5 intro-y box" v-if="form.mensaje!=null">
    <h2 class="mr-auto mb-2 text-sm font-medium">MOTIVO DEL RECHAZO</h2>
    <CommonTextarea name="mensaje" :placeholder="form.mensaje" :disabled="true"/>
  </div>
  <!-- BEGIN: Page Layout -->
  <form @submit="onIngreso($event, v3$, form)">
    <div class="p-5 mt-5 intro-y box">
      <h1 class="my-4 text-xl bold text-left text-gray-800 cursor-pointer" @click="next_step(1)">
        Datos del beneficiario
      </h1>
      <div v-show="step === 1">
        <CommonInput
          label="Fecha de inscripcion"
          name="fechaInscripcion"
          v-model="form.fechaInscripcion"
          :validator="v$"
          :disabled="form.status.id !== 4"
          type="date"
        />
        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-3 justify-evenly">
          <CommonSelect
            label="Municipio"
            name="municipio"
            v-model="form.municipio"
            :validator="v$"
            :disabled="form.status.id !== 4"
            :allowEmpty="false"
            :options="municipalitiesList"
          />
          <CommonSelect
            label="disciplinas"
            name="disciplinas"
            v-model="form.disciplinas"
            :validator="v$"
            :disabled="form.status.id !== 4"
            :allowEmpty="false"
            :options="diciplinesList"
          />
          <CommonInput
            label="nombres"
            name="nombres"
            v-model="form.nombres"
            :validator="v$"
            :disabled="form.status.id !== 4"
          />
          <CommonInput
            label="Apellidos"
            name="apellidos"
            v-model="form.apellidos"
            :validator="v$"
            :disabled="form.status.id !== 4"
          />
          <CommonInput
            label="Fecha de nacimiento"
            name="fechaNacimiento"
            :max="maxDate"
            type="date"
            v-model="form.fechaNacimiento"
            :validator="v$"
            :disabled="form.status.id !== 4"
          />
          <CommonInput
            label="Lugar de nacimiento"
            name="lugarNacimiento"
            v-model="form.lugarNacimiento"
            :validator="v$"
            :disabled="form.status.id !== 4"
          />
          <CommonSelect
            label="identificacion"
            name="tipoIdentificacion"
            v-model="form.tipoIdentificacion"
            :validator="v$"
            :disabled="form.status.id !== 4"
            :allowEmpty="false"
            :options="optionsIdentificacion"
          />
          <CommonInput
            label="Numero de documento"
            name="numeroDocumento"
            v-model="form.numeroDocumento"
            type="number"
            min="0"
            :validator="v$"
            :disabled="form.status.id !== 4"
          />
        </div>
        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-3 gap-6 justify-evenly">
          <CommonInput
            label="Direccion de residencia"
            name="direccionResidencia"
            v-model="form.direccionResidencia"
            :validator="v$"
            :disabled="form.status.id !== 4"
          />
          <CommonInput
            label="Numero de celular"
            name="numeroCel"
            v-model="form.numeroCel"
            :validator="v$"
            :disabled="form.status.id !== 4"
          />
          <CommonSelect
            label="Estrato"
            name="estrato"
            v-model="form.estrato"
            :validator="v$"
            :disabled="form.status.id !== 4"
            :allowEmpty="false"
            :options="optionsEstrato"
          />
          <CommonSelect
            label="Zona"
            name="zona"
            v-model="form.zona"
            :validator="v$"
            :disabled="form.status.id !== 4"
            :allowEmpty="false"
            :options="zonesList"
          />
          <CommonInput
            v-if="form.zona === 'R'"
            label="Corregimiento/Barrio/Vereda"
            name="pueblo"
            v-model="form.pueblo"
            :validator="v$"
            :disabled="form.status.id !== 4"
          />
          <CommonSelect
            label="Victima de conflicto"
            name="victimaConflicto"
            v-model="form.victimaConflicto"
            :validator="v$"
            :disabled="form.status.id !== 4"
            :allowEmpty="false"
            :options="optionsVictima"
          />
        </div>
        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
          <CommonSelect
            label="Genero"
            name="genero"
            v-model="form.genero"
            :validator="v$"
            :disabled="form.status.id !== 4"
            :allowEmpty="false"
            :options="optionsGenero"
          />
          <CommonSelect
            label="Etnia"
            name="etnia"
            v-model="form.etnia"
            :validator="v$"
            :disabled="form.status.id !== 4"
            :allowEmpty="false"
            :options="ethniacityList"
          />
          <CommonSelect
            label="Discapacidad"
            name="discapacidad"
            v-model="form.discapacidad"
            :validator="v$"
            :disabled="form.status.id !== 4"
            :allowEmpty="false"
            :options="optionsDiscapacidad"
          />
          <CommonInput v-if="form.discapacidad === '1'"
            label="¿Cual?"
            name="otroDisc"
            v-model="form.otroDisc"
            :validator="v$"
            :disabled="form.status.id !== 4"
          />
          <CommonSelect
            label="Patologia"
            name="patologia"
            v-model="form.patologia"
            :validator="v$"
            :disabled="form.status.id !== 4"
            :allowEmpty="false"
            :options="optionsPatologia"
          />
          <CommonInput v-if="form.patologia === '1'"
            label="¿Cual?"
            name="otroPato"
            v-model="form.otroPato"
            :validator="v$"
            :disabled="form.status.id !== 4"
          />
          <CommonSelect
            label="Tipo de sangre"
            name="sangre"
            v-model="form.sangre"
            :validator="v$"
            :disabled="form.status.id !== 4"
            :allowEmpty="false"
            :options="optionsSangre"
          />
          <CommonSelect
            label="Vivo con"
            name="vivoCon"
            v-model="form.vivoCon"
            :validator="v$"
            :disabled="form.status.id !== 4"
            :allowEmpty="false"
            :options="optionsVivo"
          />
          
        </div>
        
        <CommonSelect
          class="mt-5"
          label="Escolaridad"
          name="escolaridad"
          v-model="form.escolaridad"
          :validator="v$"
          :disabled="form.status.id !== 4"
          :allowEmpty="false"
          :options="optionsEscolaridad"
        />

        <div v-if="form.escolaridad === '1'" class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            
          <CommonSelect
              label="Nivel de Escolaridad"
              name="nivel_escolaridad"
              v-model="form.nivel_escolaridad"
              :validator="v$"
              :disabled="form.status.id !== 4"
              :allowEmpty="false"
              :options="optionsNivelEscolaridad"
            />
            
          <CommonInput
              label="Institución Educativa"
              name="institucion"
              v-model="form.institucion"
              :validator="v$"
              :disabled="form.status.id !== 4"
            />
        </div>

        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">

          <CommonSelect
            label="Tipo afiliacion(EPS)"
            name="afiliacion"
            v-model="form.afiliacion"
            :validator="v$"
            :disabled="form.status.id !== 4"
            :allowEmpty="false"
            :options="optionsAfiliacion"
          />

          <CommonSelect v-if="form.afiliacion && form.afiliacion !== 'NA'"
            label="Entidad de Salud"
            name="health_entity"
            v-model="form.health_entity"
            :validator="v$"
            :disabled="form.status.id !== 4"
            :allowEmpty="false"
            :options="healthEntities"
          />

          
        </div>

        <div class="m-4 text-center mt-10">
          <Button variant="outline-secondary" type="button" @click="onNext( v$ )">Continuar</Button>
        </div>
        
      </div>
    </div>

    <!-- <div class="p-5 mt-5 intro-y box" v-show="panelTamizaje">
      <h1 class="my-4 text-xl bold text-left text-gray-800 cursor-pointer" @click=" step > 2 ? next_step(2) : null ">
        Ficha de Tamizaje
      </h1>
      <div v-show="step === 2">
        <div class="mt-6 divide-y divide-slate-200">
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">
                Información Morfológica
            </h3>
            <ul role="list" class="divide-y pt-3">
                <li class="box border border-slate-200 px-4 py-4 sm:p-4 mb-3">
                  <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                      <CommonInput type="number" placeholder="Ingrese"
                          label="Estatura (Cm) *"
                          name="estatura" v-model="form.estatura"
                          step='0.01'
                          :disabled="form.status.id !== 4"
                      />

                      <CommonInput type="text" placeholder="Ingrese"
                          label="Envergadura (Cm) *"
                          name="envergadura" v-model="form.envergadura"
                          :disabled="form.status.id !== 4"
                      />

                      <CommonInput type="text" placeholder="Ingrese"
                          label="Masa Corporal (Kg)"
                          name="masa" v-model="form.masa"
                          :disabled="form.status.id !== 4"
                      />
                  </div>

                </li>
            </ul>

            <h3 class="mt-8 text-lg font-medium leading-6 text-gray-900">
                Información Físico Nutricional
            </h3>
            <ul role="list" class="divide-y pt-3">
                <li class="box border border-slate-200 px-4 py-4 sm:p-4 mb-3">
                  <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-4">
                      <CommonInput type="number" placeholder="Ingrese"
                          label="Test Flexibilidad (Wells) *"
                          name="flexibilidad" v-model="form.flexibilidad"
                          :disabled="form.status.id !== 4"
                      />

                      <CommonInput type="text" placeholder="Ingrese"
                          label="Velocidad (20 Mts) *"
                          name="velocidad" v-model="form.velocidad"
                          :disabled="form.status.id !== 4"
                      />

                      <CommonInput type="text" placeholder="Ingrese"
                          label="Fuerza (Lanzamiento de Balón 2k) (Mts)"
                          name="fuerza" v-model="form.fuerza"
                          :disabled="form.status.id !== 4"
                      />
                      
                      <CommonInput type="text" placeholder="Ingrese"
                          label="Oculomanual (Agarre)"
                          name="oculomanual" v-model="form.oculomanual"
                          :disabled="form.status.id !== 4"
                      />
                  </div>

                </li>

            </ul>
          </div>
        </div>

        <div class="m-4 text-center">
          <Button type="button" @click="onNext( v2$ )">Continuar</Button>
        </div>

      </div>
    </div> -->

    <div class="p-5 mt-5 intro-y box">
      <h1 class="my-4 text-xl bold text-left text-gray-800 cursor-pointer" @click="next_step(3)">
        Datos del acudiente
      </h1>
      <div  v-show="step === 3">
        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-3 gap-6 justify-evenly">
          <CommonInput
            label="Nombres"
            name="nombresAcudiente"
            v-model="form.nombresAcudiente"
            :validator="v3$"
            :disabled="form.status.id !== 4"
          />
          <CommonInput
            label="Apellidos"
            name="apellidosAcudiente"
            v-model="form.apellidosAcudiente"
            :validator="v3$"
            :disabled="form.status.id !== 4"
          />
          <CommonInput
            label="Numero de documento"
            name="nDocuAcudiente"
            v-model="form.nDocuAcudiente"
            type="number"
            min="0"
            :validator="v3$"
            :disabled="form.status.id !== 4"
          />
          <CommonInput
            label="Parentesco"
            name="parentesco"
            v-model="form.parentesco"
            :validator="v3$"
            :disabled="form.status.id !== 4"
          />
          <CommonInput 
            label="Email"
            name="email"
            v-model="form.email"
            type="email"
            :validator="v3$"
            :disabled="form.status.id !== 4"
          />
          <!-- <FormCheckInput label="No tiene" name="checkEmail" v-model="checkEmail" type="checkbox" @click="check"/> -->
          <CommonInput
            label="Numero de celular"
            name="nCelularAcudiente"
            v-model="form.nCelularAcudiente"
            :validator="v3$"
            :disabled="form.status.id !== 4"
          />
          <!-- <FormCheck label="No tiene" name="checkNCel" v-model="form.checkNCel" />  -->
        </div>
        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
          <CommonSelect
            label="Redes sociales"
            name="redesAcudiente"
            v-model="form.redesAcudiente"
            :multiple="true"
            :validator="v3$"
            :disabled="form.status.id !== 4"
            :allowEmpty="false"
            :options="optionsRedes"
          />
          <CommonSelect
            label="¿Como se entero del proyecto?"
            name="enterado"
            v-model="form.enterado"
            multiple
            :validator="v3$"
            :disabled="form.status.id !== 4"
            :allowEmpty="false"
            :options="optionsEnterado"
          />
        </div>
        <div class="m-4 text-center" v-if="form.status.id === 4">
          <Button variant="primary" :class="'mt-10'" type="submit"> Modificar </Button>
        </div>
      </div>
    </div>

  </form>
</template>

<script setup lang="ts">
// import interfaces from '../interfaces/beneficiary';
import axios from "@/services/beneficiary/beneficiary";
import { helpers } from '@vuelidate/validators'
import useVuelidate, { Validation } from "@vuelidate/core";
import { defineComponent } from "vue";
import { required, nestedRequired, maxDecimalsLength } from '@/utils/validators'
import FormCheckInput from "@/base-components/Form/FormCheck/FormCheckInput.vue";
import { onboardingStore } from "@/stores/onboardingStore";
import { getHealthentities }  from "@/composables/getHealthentities";

import Swal from "sweetalert2";
const store = onboardingStore();

const healthEntities = computedAsync( async () => {
  return await getHealthentities();
}, null)

const form = reactive({
  mensaje: '',
  idx: "",
  fechaInscripcion: "",
  municipio: "",
  disciplinas: "",
  nombres: "",
  apellidos: "",
  fechaNacimiento: "",
  lugarNacimiento: "",
  tipoIdentificacion: "",
  numeroDocumento: "",
  direccionResidencia: "",
  numeroCel: "",
  estrato: "",
  zona: "",
  victimaConflicto: "",
  pueblo: "",
  genero: "",
  etnia: "",
  discapacidad: "",
  otroDisc: "",
  patologia: "",
  otroPato: "",
  sangre: "",
  escolaridad: "",
  nivel_escolaridad: "",
  institucion: "",
  vivoCon: "",
  afiliacion: "",
  health_entity: "",
  nombresAcudiente: "",
  apellidosAcudiente: "",
  nDocuAcudiente: "",
  parentesco: "",
  email: "",
  nCelularAcudiente: "",
  redesAcudiente: "",
  enterado: "",
  estatura: '',
  envergadura: '',
  masa: '',
  flexibilidad: '',
  velocidad: '',
  fuerza: '',
  oculomanual: '',
  panelTamizaje: false,
  status: {
    id: 0,
    name: '',
    slug: ''
  }
});

const form_rules = computed(() => ({
  mensaje: {},
  fechaInscripcion:   { required },
  municipio:          { required },
  disciplinas:        { required },
  nombres:            { required },
  apellidos:          { required },
  fechaNacimiento:    { required },
  lugarNacimiento:    { required },
  tipoIdentificacion: { required },
  numeroDocumento:    { required },
  direccionResidencia:{ required },
  numeroCel:          { required },
  estrato:            { required },
  zona:               { required },
  victimaConflicto:   { required },
  pueblo:             form.zona === 'U' ? {} : { required },
  genero:             { required },
  etnia:              { required },
  discapacidad:       { required },
  otroDisc:           form.discapacidad === '0' ? {} : { required },
  patologia:          { required },
  otroPato:           form.patologia === '0' ? {} : { required },
  sangre:             { required },
  escolaridad:        { required },
  nivel_escolaridad:  form.escolaridad === '0' ? {} : { required },
  institucion:        form.escolaridad === '0' ? {} : { required },
  vivoCon:            { required },
  afiliacion:         { required },
  health_entity:   form.afiliacion && form.afiliacion !== 'NA' ? { required } : {},
}));

// const form_rules_tamizaje = computed(() => ({
//   estatura: '',
//   envergadura: '',
//   masa: '',
//   flexibilidad: '',
//   velocidad: '',
//   fuerza: '',
//   oculomanual: ''
// }));

const form_rules_acudiente = computed(() => ({
  nombresAcudiente:   { required },
  apellidosAcudiente: { required },
  nDocuAcudiente:     { required },
  parentesco:         { required },
  email:              {  },
  // checkEmail:      { required },
  nCelularAcudiente:  { required },
  // checkNCel:       { required },
  redesAcudiente:     { required },
  enterado:           { required },
}));

const municipalitiesList = ref([]);
const diciplinesList = ref([]);
const ethniacityList = ref([]);
const step = ref(1)

//---------------------------//
onMounted(async () => {
  //peticion a la api para las listas desplegables, by rick.
  store.getListSelect().then((response) => {
    if (response?.status == 200) {
      municipalitiesList.value = JSON.parse(JSON.stringify(response.data['my_municipalities']));
      diciplinesList.value = JSON.parse(JSON.stringify(response.data['diciplines']));
      ethniacityList.value = JSON.parse(JSON.stringify(response.data['ethniacity']));
    } else {
      Swal.fire("", "No se pudieron obtener los datos", "error");
    }
  });
});

const v$ = useVuelidate(form_rules, form, { $lazy: true, $autoDirty: true });
// const v2$ = useVuelidate(form_rules_tamizaje, form, { $lazy: true, $autoDirty: true });
const v3$ = useVuelidate(form_rules_acudiente, form, { $lazy: true, $autoDirty: true });

const onNext = async ( validation: Validation ) => {
  await validation.$validate()
  .then((valid) => {
      (valid) ? next_step(3) : alerts.validation()
  })
}

const next_step = (step_to?: number) => {
    if (step_to) {
        step.value = step_to
    }
    else {
        if (step.value < 6) {
            step.value++
        }
    }
};

const route  = useRoute()

const fetch = async () => {
    await axios.get(route.params.id as string)
    .then((response) => {
      console.log(response);
        if (response?.status == 200 || response?.status == 201) {
          form.mensaje = route.query.msg as string;

          form.idx = response.data.items.id;
          form.fechaInscripcion = response.data.items.registration_date;
          form.afiliacion = response.data.items.affiliation_type;
          const full_name = response.data.items.full_name.split('  ');
          form.nombres = full_name[0];
          form.apellidos = full_name[1];
          form.institucion = response.data.items.institution;
          form.tipoIdentificacion = response.data.items.type_document;
          form.numeroDocumento = response.data.items.document_number;
          form.zona = response.data.items.zone;
          form.estrato = response.data.items.stratum;
          form.numeroCel = response.data.items.phone;
          form.email = response.data.items.email;
          form.municipio = response.data.items.municipality.id;
          form.disciplinas = response.data.items.disciplines_id;
          form.fechaNacimiento = response.data.items.birth_date;
          form.lugarNacimiento = response.data.items.origin_place;
          form.direccionResidencia = response.data.items.home_address;
          form.victimaConflicto = response.data.items.conflict_victim;
          form.pueblo = response.data.items.distric;
          form.genero = response.data.items.gender;
          form.etnia = response.data.items.ethnicities_id;
          form.discapacidad = response.data.items.disability;
          form.otroDisc = response.data.items.other_disability;
          form.patologia = response.data.items.pathology;
          form.otroPato = response.data.items.what_pathology;
          form.sangre = response.data.items.blood_type;
          form.vivoCon = response.data.items.live_with;
          form.escolaridad = response.data.items.scholarship;
          form.nivel_escolaridad = response.data.items.scholar_level;
          form.health_entity = response.data.items.health_entity_id;

          form.nombresAcudiente = response.data.items.acudiente.firts_name
          form.apellidosAcudiente = response.data.items.acudiente.last_name
          form.nDocuAcudiente = response.data.items.acudiente.cedula
          form.email = response.data.items.acudiente.email
          form.nCelularAcudiente = response.data.items.acudiente.phone_number
          form.parentesco = response.data.items.know_guardian.relationship
          form.redesAcudiente = JSON.parse(response.data.items.know_guardian.social_media)
          form.enterado = JSON.parse(response.data.items.know_guardian.find_out)
          
          // SE HA QUITADO LO RELACIONADO CON TAMIZAJE
          // form.estatura = response.data.items.tamizaje.estatura,
          // form.envergadura = response.data.items.tamizaje.envergadura,
          // form.masa = response.data.items.tamizaje.masa
          
          // form.flexibilidad = response.data.items.tamizaje.flexibilidad,
          // form.velocidad = response.data.items.tamizaje.velocidad,
          // form.fuerza = response.data.items.tamizaje.fuerza,
          // form.oculomanual = response.data.items.tamizaje.oculomanual
          form.status = response.data.items.status

          // alerts.custom('', response?.data.message, 'info');
        } else {
          alerts.custom("", "No se pudieron obtener los datos", "error");
        }
        console.log(form);
    });
}

onBeforeMount(async () => {
    await fetch();
})

</script>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      optionsMunicipio: [
        { label: "cali", value: "1" },
        { label: "caicedonia", value: "2" },
        { label: "cartago", value: "3" },
        { label: "yumbo", value: "4" },
        { label: "alcala", value: "5" },
        { label: "florida", value: "6" },
        { label: "jamundi", value: "7" },
      ],
      optionsDisciplinas: [
        { label: "futbol", value: "1" },
        { label: "baloncesto", value: "2" },
        { label: "ajedrez", value: "3" },
        { label: "atletismo", value: "4" },
        { label: "badminton", value: "5" },
        { label: "boxeo", value: "6" },
        { label: "hapkido", value: "7" },
      ],
      // optionsIdentificacion: [
      //   { label: "cedula", value: "CC" },
      //   { label: "nit", value: "NIT" },
      //   { label: "tarjeta de identidad", value: "TI" },
      //   { label: "pasaporte", value: "PP" },
      // ],
      optionsIdentificacion: [
        { label: "Registro Civil", value: "RC" },
        { label: "tarjeta de identidad", value: "TI" },
        { label: "Permiso especial de permanencia", value: "PEP" },
      ],
      optionsEstrato: [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
      ],
      zonesList: [
        { label: "RURAL", value: "R" },
        { label: "URBANA", value: "U" },
      ],
      optionsVictima: [
        { label: "SI", value: "1" },
        { label: "NO", value: "0" },
      ],
      optionsGenero: [
        { label: "Masculino", value: "M" },
        { label: "Femenino", value: "F" },
      ],
      optionsEtnia: [
        { label: "Indigena", value: "1" },
        { label: "Afro", value: "2" },
        { label: "Mestizo", value: "3" },
        { label: "Blanco", value: "4" },
      ],
      optionsDiscapacidad: [
        { label: "Si", value: "1" },
        { label: "No", value: "0" },
      ],
      optionsPatologia: [
        { label: "Si", value: "1" },
        { label: "No", value: "0" },
      ],
      optionsSangre: [
        { label: "A+", value: "1" },
        { label: "A-", value: "2" },
        { label: "B+", value: "3" },
        { label: "B-", value: "4" },
        { label: "AB+", value: "5" },
        { label: "O+", value: "6" },
        { label: "O-", value: "7" },
      ],
      optionsEscolaridad: [
        { label: "Si", value: "1" },
        { label: "No", value: "0" },
      ],
      optionsNivelEscolaridad: [
        { label: "Primaria", value: "1" },
        { label: "Secundaria", value: "2" },
        { label: "Graduado", value: "3" },
      ],
      optionsVivo: [
        { label: "Padre", value: "Padre" },
        { label: "Madre", value: "Madre" },
        { label: "Abuela", value: "Abuela" },
        { label: "Hermanos", value: "Hermanos" },
        { label: "Tios", value: "Tios" },
        { label: "Otros", value: "Otros" },
      ],
      optionsAfiliacion: [
        { label: "Subsidiado", value: "SUB" },
        { label: "Contributivo", value: "CON" },
        { label: "No tiene", value: "NA" },
      ],
      optionsRedes: [
        { label: "Facebook", value: "Facebook" },
        { label: "Instagram", value: "Instagram" },
        { label: "Telegram", value: "Telegram" },
        { label: "Twitter", value: "Twitter" },
      ],
      optionsEnterado: [
        { label: "Ente municipal", value: "Ente municipal" },
        // { label: "Contributivo", value: "Ente deportivo" },
        { label: "Redes sociales", value: "Redes sociales" },
        { label: "Radio", value: "Radio" },
        { label: "Television", value: "Television" },
        { label: "Monitor deportivo", value: "Monitor deportivo" },
      ],
      checkEmail: false,
      checkNCel: false,
    };
  },
  computed: {
    maxDate: () => {
      const yearsAgo = new Date().getFullYear() - 7;
      return `${yearsAgo}-12-31`
    }
  },
  methods: {
    checkMaxDecimals( evt: any ){
      evt.preventDefault();
      console.log( evt.target.value );
      return false;
    },
    async onIngreso( evt: any, validation: any, form: any ) {
      evt.preventDefault();

      await validation.$validate()
      .then((valid: boolean) => {
          (valid) ? this.ingreso(form) : alerts.validation()
      })

    },
    ingreso( form: any ) {
      const data = {
        registration_date: form.fechaInscripcion,
        municipalities_id: form.municipio,
        disciplines_id: form.disciplinas,

        beneficiary_name: form.nombres,
        beneficiary_last_name: form.apellidos,
        full_name: `${form.nombres}  ${form.apellidos}`,        
        
        birth_date: form.fechaNacimiento,
        origin_place: form.lugarNacimiento,
        type_document: form.tipoIdentificacion,
        document_number: form.numeroDocumento,
        home_address: form.direccionResidencia,
        phone: form.numeroCel,
        stratum: form.estrato,
        zone: form.zona,
        conflict_victim: form.victimaConflicto,
        distric: form.pueblo,
        gender: form.genero,
        ethnicities_id: form.etnia,
        disability: form.discapacidad,
        other_disability: form.otroDisc,
        pathology: form.patologia,
        what_pathology: form.otroPato,
        blood_type: form.sangre,
        live_with: form.vivoCon,
        scholarship: form.escolaridad,
        scholar_level: form.nivel_escolaridad,
        institution: form.institucion,
        affiliation_type: form.afiliacion,
        health_entity_id: form.health_entity,

        // Tamizaje
        envergadura: form.envergadura,
        estatura: form.estatura,
        masa: form.masa,  
        velocidad: form.velocidad,
        flexibilidad: form.flexibilidad,
        oculomanual: form.oculomanual,
        fuerza: form.fuerza,
        
        // Datos del Acudiente
        attendant_name: form.nombresAcudiente,
        attendant_last_name: form.apellidosAcudiente,
        attendant_number_document: form.nDocuAcudiente,
        parentesco: form.parentesco,
        email: form.email,
        phone_number: form.nCelularAcudiente,
        social_media: form.redesAcudiente,
        find_out: form.enterado,

        // created_by: 1,
        accept: 1,
        linkage_project: 1,
        status_id: 2,
      };
      axios.setBeneficiary(form.idx, data).then((res: any) => {
        if(res)
        {
          Swal.fire('', res.data.message, 'success').finally(() => {
            if(form.mensaje!=null){window.history.go(-1);}
          })
          this.limpiar();
        }    
      });
    },
    limpiar() {
      
    },
    regresar() {
      window.alert("Regresa");
    },
    check() {
      this.checkEmail = !this.checkEmail;
    },
  },
  components: { FormCheckInput },
});
</script>
