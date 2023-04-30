import qs from 'qs'

export const getDisciplinesByMonitor = async (monitor_id: string | number) => {
    if (!monitor_id) return []
    const response = await api.get(`/api/v1/getdisiplinesMonitoring/${monitor_id}`)

    return response.data as Array<{ label: string, value: string | number }>
}