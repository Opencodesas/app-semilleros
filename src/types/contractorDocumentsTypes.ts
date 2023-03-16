export type DocumentName = 'doc_1' |
    'doc_2' |
    'doc_3' |
    'doc_4' |
    'doc_5' |
    'doc_6' |
    'doc_7' |
    'doc_8' |
    'doc_9' |
    'doc_10' |
    'doc_11' |
    'doc_12' |
    'doc_13' |
    'doc_14' |
    'doc_15' |
    'doc_15_1' |
    'doc_15_2' |
    'doc_15_3' |
    'doc_16' |
    'doc_17' |
    'doc_18';

interface ContractorDocumentsType {
    contractor_id: number
    id: number | string
    name: DocumentName
    path: string
    status: { slug: string, id: number, name: string, description: string }
}

export default ContractorDocumentsType