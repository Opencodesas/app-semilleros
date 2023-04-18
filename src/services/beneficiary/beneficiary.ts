import axios from 'axios';
// import { reject } from 'lodash';
// import { resolve } from 'path';

export default {
    get(id: string) {
        return api.get(`${apiPath}/beneficiaries/${id}`)
    },
    addBeneficiary(data: any) {
        return api.post(`${apiPath}/beneficiaries`, data)
    },
    setBeneficiary(id:string, data: any) {
        return api.put(`${apiPath}/beneficiaries/${id}`, data)
    },
    municipio() {
        return api.get(`${apiPath}/municipalities`)
    }
}