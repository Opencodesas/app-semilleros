import axios from 'axios';
// import { reject } from 'lodash';
// import { resolve } from 'path';

export default {
    getAll() {
        return api.get(`${apiPath}/beneficiaries`) //metodo ya existente en beneficiary_Services
    },
    async getAllUR() {
        try {
            setLoading(true)

            const response = await api.get(`${apiPath}/getAllByUserRegion`).finally(() => {
                setLoading(false)
            })

            return response
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
        return api.get(`${apiPath}/getAllByUserRegion`)
    },
    async changeStatusUR(data:any, id:string) {
        try {
            setLoading(true)

            const response = await api.put(`${apiPath}/beneficiaries/changeStatus/${id}`, data).finally(() => {
                setLoading(false)
            })

            return response
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
        return api.get(`${apiPath}/getAllByUserRegion`)
    },
    get(id: string) {
        return api.get(`${apiPath}/beneficiaries/${id}`)
    },
    addBeneficiary(data: any) {
        return api.post(`${apiPath}/beneficiaries`, data)
    },
    setBeneficiary(id:string, data: any) {
        return api.put(`${apiPath}/beneficiaries/${id}`, data)
    },
    changeStatus(data:any, id:string){
        return api.put(`${apiPath}/beneficiaries/changeStatus/${id}`, data)
    },
    municipio() {
        return api.get(`${apiPath}/municipalities`)
    },
    getBeneficiariesFile: async(id:string) => {
        try {
            setLoading(true)
            const response = await api.get(`${apiPath}/getReportBenefisiaries/${id}`).finally(() => {
                setLoading(false)
            })
            return response
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
    },
}