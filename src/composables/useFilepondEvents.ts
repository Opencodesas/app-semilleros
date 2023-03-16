export interface filePondValue {
    file: Blob,
    filename: string
}

export interface filePondEvent {
    error: any,
    value: filePondValue
}

function useFilepondEvents() {
    
    /**
     * 
     * @param event Filepond Event (error, value)
     * @param files Array where files are stored
     * @returns Array mutated
     */
    const addfile = (event: filePondEvent, files: Array<Blob>) => {
        if (event.error) return
        const { file } = event.value
        files.push(file)

        return files
    }

    /**
     * 
     * @param event Filepond Event (error, value)
     * @param files Array where file will be removed
     * @returns Array mutated
     */
    const removefile = (event: filePondEvent, files: Array<Blob>) => {
        if (event.error) return files
        const { file } = event.value
        const toRemoveIndex = files.findIndex((value) => value === file)
    
        files.splice(toRemoveIndex, 1)

        return files
    }

    return {
        multiple: {
            addfile,
            removefile
        }
    }
}

export default useFilepondEvents