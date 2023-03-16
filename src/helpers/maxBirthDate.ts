import dayjs from 'dayjs'

const maxBirthDate = computed(() => {

    const [month, day, year] = dayjs().format('MM-DD-YYYY').split('-')

    const mm = Number(month)
    const dd = Number(day)

    const d = reactive({
        year: Number(year) - 18,
        month: (mm < 10) ? `0${mm}` : mm,
        day: (dd < 10) ? `0${dd}` : dd,
    })

    return `${d.year}-${d.month}-${d.day}`
})

export default maxBirthDate