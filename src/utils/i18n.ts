import { createI18n } from 'vue-i18n'

const messages = {
    es: {
        validations: {
            required: 'Campo requerido.',
            minLength: 'Debe tener por lo menos {min} caracteres.',
            maxLength: 'Debe tener {max} caracteres como máximo.',
            email: 'Debes colocar un email valido.',
            alpha: 'Solo se admiten letras.',
            numeric: 'Solo se admiten números.',
            checkMinMaxHours: 'La hora inicial no puede ser mayor a la hora final.',
            phone: 'Debes colocar un numero de teléfono valido.'
        },
    },
}

const i18n = createI18n({
    locale: 'es',
    messages,
})

export default i18n
