import * as validators from '@vuelidate/validators'
import i18n from '@/utils/i18n'

const { createI18nMessage } = validators

const withI18nMessage = createI18nMessage({ t: i18n.global.t })

export const required = withI18nMessage(validators.required)
export const nestedRequired = validators.helpers.withMessage('Campo requerido.', required)
export const email = withI18nMessage(validators.email)
export const numeric = withI18nMessage(validators.numeric)
export const minLength = withI18nMessage(validators.minLength, { withArguments: true })
export const maxLength = withI18nMessage(validators.maxLength, { withArguments: true })

const _unique = (group: Array<any>, key: string) => {
    return (value: string) => {
        const found = group.filter(item => {
            if (key) {
                return item[key] == value
            }
            return item == value
        })
        return found.length <= 1
    }
}

export const unique = (group: Array<any>, key: string) => validators.helpers.withMessage('No se permiten valores duplicados.', _unique(group, key))

export const phone = validators.helpers.withMessage('Debes colocar un numero de teléfono valido.', validators.helpers.regex(/^[0-9()-]+$/))

const only_numbers = validators.helpers.withMessage('Solo se admiten números', validators.helpers.regex(/^[0-9]+$/))
const editorEmpty = validators.helpers.withMessage('Campo requerido.', validators.not(validators.sameAs('<p></p>')) )

export const identification = { only_numbers, minLength: minLength(7), maxLength: maxLength(10) }
export const clause = { required, editorEmpty }