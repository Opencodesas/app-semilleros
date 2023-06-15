import qs from 'qs'

export const getMunicipalitiesByZone = async (zone_id: string | number) => {
    if (!zone_id) return []
    const response = await api.get(`api/v1/regions/${zone_id}/municipalities`)
    return response.data
}