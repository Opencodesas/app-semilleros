import qs from 'qs'

export const getMonitorByMunicipality = async (municipality_id: string | number) => {
    console.log('getMonitorByMunicipality', municipality_id)
    if (!municipality_id) return []
    const response = await api.get(`/api/v1/getMonitoringMunicipality/${municipality_id}`)

    return response.data as Array<{ label: string, value: string | number }>
}