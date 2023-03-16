const labels = {
    clause1: '1. Objeto',
    clause2: '2. Plazo',
    clause3: '3. Obligaciones generales de las partes',
    clause4: '4. Actividades especificas de la Contratista',
    clause5: '5. Valor',
    clause6: '6. Forma de Pago',
    clause7: '7. Garantía',
    clause8: '8. Información bancaria',
    clause9: '9. Independencia',
    clause10: '10. Supervisión',
    clause11: '11. Causales de Terminación',
    clause12: '12. Prorrogas',
    clause13: '13. Suspensión del Contrato',
    clause14: '14. Cesión del Contrato',
    clause15: '15. Propiedad',
    clause16: '16. Multas',
    clause17: '17. Cláusula penal',
    clause18: '18. Confidencialidad',
    clause19: '19. Controversias',
    clause20: '20. Documentos integrantes del contrato',
    clause21: '21. Requisitos de perfeccionamiento y ejecución',
    clause22: '22. Declaraciones',
    clause23: '23. Domicilio',
    clause24: '24. Notificaciones'
}

type Keys = keyof typeof labels

export default (name: string) => labels[name as Keys]