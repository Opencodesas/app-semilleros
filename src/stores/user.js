import { defineStore } from "pinia";
import {
  required,
  sameAs,
  helpers,
  minLength,
  email,
} from "@vuelidate/validators";
// import { requiredChangePassword, checkMinMaxHours, minLength } from '../utils/validations'

export const useUser = defineStore("user", {
  state: () => ({
    form: {
      name: '',
      lastname: '',
      document_number: '',
      document_type: '',
      email: '',
      gender: '',
      municipalities: '',
      period: '',
      phone: '',
      email: "",
      roles: '',
      address: '',
      zones: '',
    },
    validator: {},
  }),
  getters: {},
  actions: {
    clearInputs() {
      this.$reset();
    },
    fillData(data) {
      this.$state.form.name = data?.name;
      this.$state.form.email = data?.email;
    },
  },
});
