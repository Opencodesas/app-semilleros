import qs from 'qs'

export const getMonitorByMunicipality = async (user_id: string | number) => {
    if (!user_id) return []
    const response = await api.get(`/api/v1/monitor/methodologist/${user_id}`)

    return response.data as Array<{ label: string, value: string | number }>
}