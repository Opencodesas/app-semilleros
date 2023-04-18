export const getHealthentities = async () => {
    try {
        const response = await api.get(`/api/v1/health-entities`);

        const data = response.data.map( (item: any) => {
            return {
                value: item.id,
                label: item.entity,
            }
        })

        return data

    } catch (error: any) {
        alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
    }
}