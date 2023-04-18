import qs from 'qs'

export const getBeneficiariesByDepartment = async (department_id: string | number) => {
    const department = qs.stringify({ department: department_id })
    const response = await api.get(`/api/v1/getBeneficiariesMunicipality/${department}`)
    console.log(response.data)

    return response.data as Array<{ label: string, value: string | number }>
}