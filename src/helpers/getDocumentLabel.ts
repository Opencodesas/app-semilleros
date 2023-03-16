const labels = {
    doc_1: '1. Propuesta de prestación de servicios',
    doc_2: '2. Fotocopia cédula de ciudadanía al 150%',
    doc_3: '3. Fotocopia libreta militar al 150%',
    doc_4: '4. Formato único hoja de vida',
    doc_5: '5. Soportes educativos',
    doc_6: '6. Fotocopia de la tarjeta profesional',
    doc_7: '7. Certificado de vigencia de la tarjeta profesional',
    doc_8: '8. Certificado de antecedentes de la tarjeta profesional',
    doc_9: '9. Certificado laborales',
    doc_10: '10. Antecedentes penales(Policía Nacional)',
    doc_11: '11. Antecedentes disciplinarios (Procuraría general)',
    doc_12: '12. Antecedentes fiscales (Contraloría general)',
    doc_13: '13. Sistema de registro nacional de medidas correctivas',
    doc_14: '14. Consulta inhabilidades (Policía nacional - ley 1918 de 2018)',
    doc_15: '15. Verificación De afiliación y/o pago de aportes al sistema de seguridad social',
    doc_15_1: '15.1 Certificado de afiliación a la EPS',
    doc_15_2: '15.2 Certificado de afiliación a pensión',
    doc_15_3: '15.3 Planilla pagada de seguridad social',
    doc_16: '16. Registros único tributario (RUT)',
    doc_17: '17. Exámenes medico ocupacional',
    doc_18: '18. Certificado cuenta bancaria',
}

type Keys = keyof typeof labels

export default (name: string) => labels[name as Keys]