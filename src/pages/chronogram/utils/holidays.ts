
const getHolidays = (date: string, nameHoliday: string) => {
  const week = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const fecha = date.split("-");
  const dia = new Date(
    parseInt(fecha[0]),
    parseInt(fecha[1]) - 1,
    parseInt(fecha[2])
  );
  return `${week[dia.getDay()]} ${dia.getDate()} ${nameHoliday}`;
};

const holidays = computedAsync(async () => {
  const year = new Date().getFullYear();
  const holidaysYear = await fetch(
    `https://date.nager.at/api/v3/publicholidays/${year}/CO`
  );
  const res = await holidaysYear.json();
  const holidays = res.map((holiday: any) => {
    if (holiday.localName.includes("Battle of Boyacá")) {
      holiday.localName = "Batalla de Boyacá";
    }
    if (holiday.localName == "Carnival") {
      holiday.localName = "Caranaval de Barranquilla";
    }
    return {
      date: holiday.date,
      name: holiday.localName,
    };
  });
  return holidays;
}, null);

export const organizeHolidays = (value: any) => {
  const res = holidays.value.filter((holiday: any) => {
    const month = holiday.date.split('-')[1];
    return month == value;
  });
  const holidaysRes = res.map((holiday: any) => {
    return getHolidays(holiday.date, holiday.name);
  });
  const date = new Date();
  date.setMonth(value - 1);
  const nameMonth = date.toLocaleString('CO', { month: 'long' });
  return `Festivos de ${nameMonth}: ${holidaysRes.join(' - ')}`;
};
