import qs from 'qs'

export const getMonitorByMunicipality = async (user_id: string | number) => {
    if (!user_id) return []
    const response = await api.get(`/api/v1/monitor/methodologist/${user_id}`)

    return response.data as Array<{ label: string, value: string | number }>
}

export const getUserRegionsMunicipalities = async (user_id: string | number) => {
    if (!user_id) return []
    const response = await api.get(`/api/v1/User/Municipalities/${user_id}`)
    const data = response.data
    return data
}

export const getMunicipalitiesUserDisciplines = async (municipality_id: string | number) => {
    if (!municipality_id) return []
    const response = await api.get(`/api/v1/Municipalities/User/Disciplines/${municipality_id}`)
    const data = response.data
    
    return  data as []
}