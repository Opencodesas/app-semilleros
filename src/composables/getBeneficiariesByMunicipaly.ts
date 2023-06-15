import qs from 'qs'

export const getBeneficiariesByDepartment = async (municipality_id: string | number) => {
    if (municipality_id) {
        const response = await api.get(`/api/v1/getBeneficiariesMunicipality/${municipality_id}`)
        console.log(response.data)

        return response.data as Array<{ label: string, value: string | number }>
    }
    return []
}