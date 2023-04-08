import qs from 'qs'

export const getMonitorByMunicipality = async (municipality_id: string | number) => {
    const municipality = qs.stringify({ municipality: municipality_id })
    const response = await api.get(`/api/v1/monitorByMunicipality/${municipality}`)

    return response.data as Array<{ label: string, value: string | number }>
}