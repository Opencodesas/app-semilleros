export const getConsecutive = async (table: string, abbreviation: string ) => {
    const response = await api.get(`/api/v1/consecutive/generate/${table}/${abbreviation}`)

    return response.data as string
}