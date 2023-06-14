import qs from 'qs'

export const getMonitorByAuth = async () => {
    const response = await api.get(`/api/v1/getMonitorByAuth`)

    return response.data as Array<{ label: string, value: string | number }>
}