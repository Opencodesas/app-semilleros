import qs from 'qs'

export const getOneWithPick = async (table: string, id: number | string, fields: string[]) => {
    const parse = qs.stringify({
        table,
        id,
        fields
    })
    const response = await api.get(`/api/v1/getOneWithPick?${parse}`)

    return response.data.items
}