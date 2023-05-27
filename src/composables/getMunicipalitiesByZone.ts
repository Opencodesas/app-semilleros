import qs from 'qs'

export const getMunicipalitiesByZone = async (zone_id: string | number) => {
    if (!zone_id) return []
    const response = await api.get(`api/v1/regions/${zone_id}/municipalities`)
    console.log(response.data)
    const res = response.data.map((municipality: any, key : any) => {
        return {
            value: key,
            label: municipality,
        }
    })
      console.log(res)  
    return res as Array<{ label: string, value: string | number }>
    //return response.data as Array<{ label: string, value: string | number }>
}