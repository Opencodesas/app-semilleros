import qs from 'qs'
type Select = 'municipalities' | 'groups' | 'validity_periods' | 'zones' | 'statuses' | 'disciplines' | 'roles' | 'departments' | 'bank_account_types' | 'identification_types' | 'banks' | 'objects' | 'months';

export const getSelect = async (selects: Select[]) => {
    const parse = qs.stringify({ selects: selects })
    const response = await api.get(`/api/v1/selects?${parse}`)

    return response.data.at(0) as Array<{ label: string, value: string | number }>
}