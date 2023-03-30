export const formdataParser = (payload: any): FormData => {
    const dt = new FormData()

    for (const [name, value] of Object.entries(payload)) {
        if( typeof value == 'object') {
            dt.append(name, JSON.stringify( value )  )
        } else {
            dt.append(name, value as string | Blob)
        }
    }

    return dt
}