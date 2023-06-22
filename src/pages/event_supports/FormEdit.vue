<script setup lang="ts">
import FormSwitch from "@/base-components/Form/FormSwitch";
import { onboardingStore } from "@/stores/onboardingStore";
import useVuelidate from "@vuelidate/core";
import Swal from "sweetalert2";
import { required } from "@vuelidate/validators";

const route = useRoute();
const store = onboardingStore();
const { multiple } = useFilepondEvents();

const form = reactive({
  date_visit: "",
  hour_visit: "",
  municipalitie_id: "",
  correct: "", //
  event: "",
  observation: "",
});

const form_rules = computed(() => ({
  date_visit: { required },
  hour_visit: { required },
  municipalitie_id: { required },
  correct: { required },
  event: { required },
  observation: { required },
}));

const v$ = useVuelidate(form_rules, form);

const router = useRouter();

// Consulta todos los municipios
const municipalities = asyncComputed(async () => {
  return await getSelect(["municipalities"], false);
}, null);

/**
 * Para los archivos, vas a desestructurar el objeto form
 *      { file, ...rest } = form
 *      let fd = formdataParser(rest)
 *
 *      for (let i = 0; i < files.length; i++) {
 *          fd.append('files[]', files[i])
 *      }
 *
 *      servicios.create(fd)
 */

const formdataParser = (form: any) => {
  const formData = new FormData();
  Object.keys(form).forEach((key) => {
    formData.append(key, form[key]);
  });
  return formData;
};

// const selectFiles = (event: any) => {
//   form.file = Array.from(event.target.files);
// };

const selectFile = (event: any, field: keyof typeof form) => {
  form[field] = event.target.files[0];
};

const onSubmit = async () => {
  const valid = await v$.value.$validate();
  if (valid) {
    console.log(form);
    await eventSupportsService
      .update(route.params.id as string, formdataParser(form))
      .then((response) => {
        if (response) {
          if (response.status >= 200 && response.status <= 300) {
            alerts.create();
            setLoading(true);
            router.push({ name: "event_supports.index" }).finally(() => {
              setLoading(false);
            });
          }
        }
      });
  } else {
    alerts.validation();
  }
};

const fetch = async () => {
  //console.log(3);
  await eventSupportsService.get(route.params.id as string).then((response) => {
    console.log(response?.data.items);
    if (response?.status == 200 || response?.status == 201) {
      Swal.fire("", response?.data.message, "info").finally(() => {});

      form.date_visit = response?.data?.items?.date_visit;
      form.hour_visit = response?.data?.items?.hour_visit;
      form.correct = response?.data?.items?.correct;
      form.event = response?.data?.items?.event;

      form.municipalitie_id = response?.data?.items?.municipalitie_id;
      form.observation = response?.data?.items?.observation;
      console.log(response?.data?.items?.observation);
    } else {
      Swal.fire("", "No se pudieron obtener los datos", "error");
    }
    console.log(form);
  });
};

onMounted(async () => {
  await fetch();
  // dataLoaded.value = true;
});
</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <div class="flex items-center space-x-4">
      <CommonBackButton to="event_supports.index" title="Listado" />
      <h2 class="mr-auto text-lg font-medium">Editar soporte de evento</h2>
    </div>
  </div>

  <div class="p-5 mt-5 intro-y box grid gap-6">
    <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
      <CommonInput
        type="date"
        label="Fecha  *"
        name="date_visit"
        v-model="form.date_visit"
        :validator="v$"
      />
      <CommonInput
        type="time"
        label="Hora  *"
        name="hour_visit"
        v-model="form.hour_visit"
        :validator="v$"
      />
      <CommonSelect
        label="Municipio *"
        name="municipalitie_id"
        v-model="form.municipalitie_id"
        :validator="v$"
        :options="municipalities"
      />

      <CommonInput
        label="Corregimiento / Vereda *"
        name="correct"
        placeholder="Ingrese el corregimiento o vereda"
        v-model="form.correct"
        :validator="v$"
      />
    </div>
    <CommonTextarea
      label="Observaciones *"
      rows="5"
      placeholder="Ingrese las observaciones"
      name="observation"
      v-model="form.observation"
      :validator="v$"
    />
    <CommonInput
      type="text"
      placeholder="Ingrese el nombre del evento"
      label="Cual evento? *"
      name="event"
      v-model="form.event"
      :validator="v$"
    />
  </div>
  <div class="mt-6 flex justify-center col-span-1 md:col-span-2">
    <Button variant="primary" class="btn btn-primary" @click="onSubmit">
      Actualizar
    </Button>
  </div>
</template>
