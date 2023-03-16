import axios from 'axios';
// import { reject } from 'lodash';
// import { resolve } from 'path';

export default {
    addBeneficiary(data: any) {
        return api.post(`${apiPath}/beneficiaries`, data)
    },
    municipio() {
        return api.get(`${apiPath}/municipalities`)
    }
}