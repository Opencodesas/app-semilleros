import qs from 'qs'

export const getCitiesByDepartment = async (department_id: string | number) => {
    const department = qs.stringify({ department: department_id })
    const response = await api.get(`/api/v1/citiesByDepartment?${department}`)

    return response.data as Array<{ label: string, value: string | number }>
}