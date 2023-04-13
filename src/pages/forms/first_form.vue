<template>
  <div class="flex items-center mt-8 intro-y">
    <div class="flex items-center space-x-4">
            <CommonBackButton :to="'beneficiaries.index'" title="Listado" />
            <h2 class="mr-auto text-lg font-medium">BENEFICIARIOS</h2>
        </div>
  </div>
  <!-- BEGIN: Page Layout -->
  <form @submit="ingreso">
    <div class="p-5 mt-5 intro-y box">
      <h1 class="my-4 text-xl bold text-left text-gray-800">
        Datos del beneficiario
      </h1>
      <div v-show="accordion[0].shown">
        <CommonInput
          label="Fecha de inscripcion"
          name="fechaInscripcion"
          v-model="fechaInscripcion"
          :validator="v$"
          :required="true"
          type="date"
        />
        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-3 justify-evenly">
          <CommonSelect
            label="Municipio"
            name="municipio"
            v-model="municipio"
            :validator="v$"
            :allowEmpty="false"
            :options="municipalitiesList"
          />
          <CommonSelect
            label="disciplinas"
            name="disciplinas"
            v-model="disciplinas"
            :validator="v$"
            :required="true"
            :options="diciplinesList"
          />
          <CommonInput
            label="nombres"
            name="nombres"
            v-model="nombres"
            :validator="v$"
            :required="true"
          />
          <CommonInput
            label="Apellidos"
            name="apellidos"
            v-model="apellidos"
            :validator="v$"
            :required="true"
          />
          <CommonInput
            label="Fecha de nacimiento"
            name="fechaNacimiento"
            :max="maxDate"
            type="date"
            v-model="fechaNacimiento"
            :validator="v$"
            :required="true"
          />
          <CommonInput
            label="Lugar de nacimiento"
            name="lugarNacimiento"
            v-model="lugarNacimiento"
            :validator="v$"
            :required="true"
          />
          <CommonSelect
            label="identificacion"
            name="tipoIdentificacion"
            v-model="tipoIdentificacion"
            :validator="v$"
            :required="true"
            :options="optionsIdentificacion"
          />
          <CommonInput
            label="Numero de documento"
            name="numeroDocumento"
            v-model="numeroDocumento"
            type="number"
            min="0"
            :validator="v$"
            :required="true"
          />
        </div>
        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-3 gap-6 justify-evenly">
          <CommonInput
            label="Direccion de residencia"
            name="direccionResidencia"
            v-model="direccionRes"
            :validator="v$"
            :required="true"
          />
          <CommonInput
            label="Numero de celular"
            name="numeroCel"
            v-model="numeroCel"
            :validator="v$"
            :required="true"
          />
          <CommonSelect
            label="Estrato"
            name="estrato"
            v-model="estrato"
            :validator="v$"
            :required="true"
            :options="optionsEstrato"
          />
          <CommonSelect
            label="Zona"
            name="zona"
            v-model="zona"
            :validator="v$"
            :required="true"
            :options="zonesList"
          />
          <CommonSelect
            label="Victima de conflicto"
            name="victimaConflicto"
            v-model="victimaConf"
            :validator="v$"
            :required="true"
            :options="optionsVictima"
          />
          <CommonInput
            label="Corregimiento/Barrio/Vereda"
            name="pueblo"
            v-model="pueblo"
            :validator="v$"
            :required="true"
          />
        </div>
        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
          <CommonSelect
            label="Genero"
            name="genero"
            v-model="genero"
            :validator="v$"
            :required="true"
            :options="optionsGenero"
          />
          <CommonSelect
            label="Etnia"
            name="etnia"
            v-model="etnia"
            :validator="v$"
            :required="true"
            :options="ethniacityList"
          />
          <CommonSelect
            label="Discapacidad"
            name="discapacidad"
            v-model="discapacidad"
            :validator="v$"
            :required="true"
            :options="optionsDiscapacidad"
          />
          <CommonInput v-if="discapacidad === '1'"
            label="¿Cual?"
            name="otroDisc"
            v-model="otroDiscapacidad"
            :validator="v$"
            :required="true"
          />
          <CommonSelect
            label="Patologia"
            name="patologia"
            v-model="patologia"
            :validator="v$"
            :required="true"
            :options="optionsPatologia"
          />
          <CommonInput v-if="patologia === '1'"
            label="¿Cual?"
            name="otroPato"
            v-model="otroPatologia"
            :validator="v$"
            :required="true"
          />
          <CommonSelect
            label="Tipo de sangre"
            name="sangre"
            v-model="sangre"
            :validator="v$"
            :required="true"
            :options="optionsSangre"
          />
          <CommonSelect
            label="Vivo con"
            name="vivoCon"
            v-model="vivoCon"
            :validator="v$"
              :required="true"
            :options="optionsVivo"
          />
          
        </div>
        
        <CommonSelect
          class="mt-5"
          label="Escolaridad"
          name="escolaridad"
          v-model="escolaridad"
          :validator="v$"
          :required="true"
          :options="optionsEscolaridad"
        />

        <div v-if="escolaridad === '1'" class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            
          <CommonSelect
              label="Nivel de Escolaridad"
              name="nivel_escolaridad"
              v-model="nivel_escolaridad"
              :validator="v$"
              :required="true"
              :options="optionsNivelEscolaridad"
            />
            
          <CommonInput
              label="Institución Educativa"
              name="institucion"
              v-model="institucion"
              :validator="v$"
              :required="true"
            />
        </div>

        <CommonSelect class="mt-5"
          label="Tipo afiliacion(EPS)"
          name="afiliacion"
          v-model="afiliacion"
          :validator="v$"
            :required="true"
          :options="optionsAfiliacion"
        />
        
          <div class="m-4 text-center">
            <Button type="button" @click="showV()">Continuar</Button>
          </div>
        
      </div>
    </div>
    <div class="p-5 mt-5 intro-y box">
      <h1 class="my-4 text-xl bold text-left text-gray-800">
        Datos del acudiente
      </h1>
      <div v-show="accordion[1].shown">
        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-3 gap-6 justify-evenly">
          <CommonInput
            label="Nombres"
            name="nombresAcudiente"
            v-model="nombresAcudiente"
            :validator="v$"
            :required="true"
          />
          <CommonInput
            label="Apellidos"
            name="apellidosAcudiente"
            v-model="apellidosAcudiente"
            :validator="v$"
            :required="true"
          />
          <CommonInput
            label="Numero de documento"
            name="nDocuAcudiente"
            v-model="nDocuAcudiente"
            type="number"
            min="0"
            :validator="v$"
            :required="true"
          />
          <CommonInput
            label="Parentesco"
            name="parentesco"
            v-model="parentesco"
            :validator="v$"
            :required="true"
          />
          <CommonInput 
            label="Email"
            name="email"
            v-model="email"
            type="email"
            :validator="v$"
            :required="true"
          />
          <!-- <FormCheckInput label="No tiene" name="checkEmail" v-model="checkEmail" type="checkbox" @click="check"/> -->
          <CommonInput
            label="Numero de celular"
            name="nCelularAcudiente"
            v-model="nCelularAcudiente"
            :validator="v$"
            :required="true"
          />
          <!-- <FormCheck label="No tiene" name="checkNCel" v-model="form.checkNCel" />  -->
        </div>
        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
          <CommonSelect
            label="Redes sociales"
            name="redesAcudiente"
            v-model="redesAcudiente"
            :multiple="true"
            :validator="v$"
            :required="true"
            :options="optionsRedes"
          />
          <CommonSelect
            label="¿Como se entero del proyecto?"
            name="enterado"
            v-model="enterado"
            :multiple="true"
            :validator="v$"
            :required="true"
            :options="optionsEnterado"
          />
        </div>
        <div class="m-4 text-center">
          <Button type="submit">Ingresar</Button>
        </div>
      </div>

    </div>
  </form>
</template>

<script setup lang="ts">
// import interfaces from '../interfaces/beneficiary';
import axios from "@/services/beneficiary/beneficiary";
import useVuelidate from "@vuelidate/core";
import { defineComponent } from "vue";
import { required } from "@vuelidate/validators";
import FormCheckInput from "@/base-components/Form/FormCheck/FormCheckInput.vue";
import { onboardingStore } from "@/stores/onboardingStore";
import Swal from "sweetalert2";
const store = onboardingStore();
const form = reactive({
  fechaInscripcion: "",
  municipio: "",
  disciplinas: "",
  nombres: "",
  apellidos: "",
  fechaNacimiento: "",
  lugarNacimiento: "",
  tipoIdentificacion: "",
  numeroDocumento: "",
  direccionRes: "",
  numeroCel: "",
  estrato: "",
  zona: "",
  victimaConf: "",
  pueblo: "",
  genero: "",
  etnia: "",
  discapacidad: "",
  otroDiscapacidad: "",
  patologia: "",
  otroPatologia: "",
  sangre: "",
  escolaridad: "",
  nivel_escolaridad: "",
  institucion: "",
  vivoCon: "",
  afiliacion: "",
  nombresAcudiente: "",
  apellidosAcudiente: "",
  nDocuAcudiente: "",
  parentesco: "",
  email: "",
  nCelularAcudiente: "",
  redesAcudiente: "",
  enterado: "",
});

const form_rules = computed(() => ({
  fechaInscripcion: { required },
  municipio: { required },
  disciplinas: { required },
  nombres: { required },
  apellidos: { required },
  fechaNacimiento: { required },
  lugarNacimiento: { required },
  tipoIdentificacion: { required },
  numeroDocumento: { required },
  direccionResidencia: { required },
  numeroCel: { required },
  estrato: { required },
  zona: { required },
  victimaConflicto: { required },
  pueblo: { required },
  genero: { required },
  etnia: { required },
  discapacidad: { required },
  otroDisc: { required },
  patologia: { required },
  otroPato: { required },
  sangre: { required },
  escolaridad: { required },
  nivel_escolaridad: { required },
  institucion:{required },
  vivoCon: { required },
  afiliacion: { required },
  nombresAcudiente: { },
  apellidosAcudiente: { required },
  nDocuAcudiente: { required },
  parentesco: { required },
  email: { required },
  // checkEmail: required{},
  nCelularAcudiente: { required },
  // checkNCel: required{},
  redesAcudiente: { required },
  enterado: { required },
}));

const municipalitiesList = ref([]);
const diciplinesList = ref([]);
const ethniacityList = ref([]);
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
const v$ = useVuelidate(form_rules, form);

const showV = () => {
  console.log( v$.value.$invalid, v$.value );
}

</script>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      accordion: [
        {
          shown: true
        },
        {
          shown: true
        }
      ],
      fechaInscripcion: "",
      municipio: "",
      disciplinas: "",
      nombres: "",
      apellidos: "",
      fechaNacimiento: "",
      lugarNacimiento: "",
      tipoIdentificacion: "",
      numeroDocumento: "",
      direccionRes: "",
      numeroCel: "",
      estrato: "",
      zona: "",
      victimaConf: "",
      pueblo: "",
      genero: "",
      etnia: "",
      discapacidad: "",
      otroDiscapacidad: "",
      patologia: "",
      otroPatologia: "",
      sangre: "",
      escolaridad: "",
      nivel_escolaridad: "",
      institucion: "",
      vivoCon: "",
      afiliacion: "",
      nombresAcudiente: "",
      apellidosAcudiente: "",
      nDocuAcudiente: "",
      parentesco: "",
      email: "",
      nCelularAcudiente: "",
      redesAcudiente: "",
      enterado: "",
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
      optionsIdentificacion: [
        { label: "cedula", value: "CC" },
        { label: "nit", value: "NIT" },
        { label: "tarjeta de identidad", value: "TI" },
        { label: "pasaporte", value: "PP" },
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
        { label: "Contributivo", value: "Ente deportivo" },
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
    toggleAccordion( pos: number ) {
      this.accordion.map( item => item.shown = false )
      this.accordion[ pos ].shown = !this.accordion[ pos ].shown
    },
    ingreso( evt: any ) {
      evt.preventDefault();
      
      const data = {
        registration_date: this.fechaInscripcion,
        municipalities_id: this.municipio,
        disciplines_id: this.disciplinas,

        beneficiary_name: this.nombres,
        beneficiary_last_name: this.apellidos,
        full_name: `${this.nombres} ${this.apellidos}`,        
        
        birth_date: this.fechaNacimiento,
        origin_place: this.lugarNacimiento,
        type_document: this.tipoIdentificacion,
        document_number: this.numeroDocumento,
        home_address: this.direccionRes,
        phone: this.numeroCel,
        stratum: this.estrato,
        zone: this.zona,
        conflict_victim: this.victimaConf,
        distric: this.pueblo,
        gender: this.genero,
        ethnicities_id: this.etnia,
        disability: this.discapacidad,
        other_disability: this.otroDiscapacidad,
        pathology: this.patologia,
        what_pathology: this.otroPatologia,
        blood_type: this.sangre,
        live_with: this.vivoCon,
        scholarship: this.escolaridad,
        scholar_level: this.nivel_escolaridad,
        institution: this.institucion,
        affiliation_type: this.afiliacion,

        // Datos del Acudiente
        attendant_name: this.nombresAcudiente,
        attendant_last_name: this.apellidosAcudiente,
        attendant_number_document: this.nDocuAcudiente,
        parentesco: this.parentesco,
        email: this.email,
        phone_number: this.nCelularAcudiente,
        social_media: this.redesAcudiente,
        find_out: this.enterado,

        // created_by: 1,
        accept: 1,
        linkage_project: 1,
        status: "REC",
      };
      axios.addBeneficiary(data).then((res: any) => {
        if(res){
          Swal.fire('', res.data.message, 'success').finally(() => {
          })
          this.limpiar();
        }

        
      });
    },
    limpiar() {
      this.fechaInscripcion = "";
      this.municipio = "";
      this.disciplinas = "";
      this.nombres = "";
      this.apellidos = "";
      this.fechaNacimiento = "";
      this.lugarNacimiento = "";
      this.tipoIdentificacion = "";
      this.numeroDocumento = "";
      this.direccionRes = "";
      this.numeroCel = "";
      this.estrato = "";
      this.zona = "";
      this.victimaConf = "";
      this.pueblo = "";
      this.genero = "";
      this.etnia = "";
      this.discapacidad = "";
      this.otroDiscapacidad = "";
      this.patologia = "";
      this.otroPatologia = "";
      this.sangre = "";
      this.nivel_escolaridad = "";
      this.institucion = "";
      this.escolaridad = "";
      this.vivoCon = "";
      this.afiliacion = "";
      this.nombresAcudiente = "";
      this.apellidosAcudiente = "";
      this.nDocuAcudiente = "";
      this.parentesco = "";
      this.email = "";
      this.nCelularAcudiente = "";
      this.redesAcudiente = "";
      this.enterado = "";
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
