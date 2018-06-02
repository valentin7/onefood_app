export const PRECIO_BOTELLA = 49;

export function convertirFecha(date) {
  var cs = date.split(" ");
  if (cs.length != 5) {
    return date;
  }
  var monthToSpanish = {"January": "enero", "February" : "febrero", "March": "marzo", "April": "abril", "May": "mayo", "June":"junio", "July":"julio", "August":"agosto", "September":"septiembre", "October":"octubre", "November":"noviembre", "December":"diciembre"};
  var dayToSpanish = {"Monday,": "lunes", "Tuesday,":"martes", "Wednesday,":"miércoles", "Thursday,":"jueves", "Friday,":"viernes", "Saturday,":"sábado", "Sunday,":"domingo"};

  console.log("check up ", dayToSpanish[cs[0]]);
  var fecha = dayToSpanish[cs[0]] + " " + cs[1] + " " + monthToSpanish[cs[2]] + " " + cs[3] + " " + cs[4];

  return  fecha;
}

export function convertirFechaCorta(date) {
  var cs = date.split(" ");
  if (cs.length != 5) {
    return date;
  }
  var monthToSpanish = {"January": "enero", "February" : "febrero", "March": "marzo", "April": "abril", "May": "mayo", "June":"junio", "July":"julio", "August":"agosto", "September":"septiembre", "October":"octubre", "November":"noviembre", "December":"diciembre"};
  var dayToSpanish = {"Monday,": "lunes", "Tuesday,":"martes", "Wednesday,":"miércoles", "Thursday,":"jueves", "Friday,":"viernes", "Saturday,":"sábado", "Sunday,":"domingo"};

  console.log("check up ", dayToSpanish[cs[0]]);

  var fecha = cs[1] + " " + monthToSpanish[cs[2]] + " " + cs[3].substr(0, cs[3].length - 1);

  return  fecha;
}


export function addDaysToDate(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
