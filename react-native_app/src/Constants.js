export const PRECIO_BOTELLA = 49;
export const PRECIO_SNACK = 29;
export const PRECIO_SNACK_REP = 23.2;
export const PRECIO_BOTELLA_REP = 39.2;
export const serverlessURL = 'https://d88zd3d2ok.execute-api.us-east-1.amazonaws.com';
export const CONEKTA_PUBLIC_KEY = 'key_KoqjzW5XMEVcwxdqHsCFY4Q';

export function convertirFecha(date) {
  if (date == null) {
    return date;
  }

  var cs = date.split(" ");
  if (cs.length != 5) {
    return date;
  }
  var monthToSpanish = {"January": "enero", "February" : "febrero", "March": "marzo", "April": "abril", "May": "mayo", "June":"junio", "July":"julio", "August":"agosto", "September":"septiembre", "October":"octubre", "November":"noviembre", "December":"diciembre"};
  var dayToSpanish = {"Monday,": "lunes", "Tuesday,":"martes", "Wednesday,":"miércoles", "Thursday,":"jueves", "Friday,":"viernes", "Saturday,":"sábado", "Sunday,":"domingo"};
  var fecha = dayToSpanish[cs[0]] + " " + cs[1] + " " + monthToSpanish[cs[2]] + " " + cs[3] + " " + cs[4];

  return  fecha;
}

export function convertirFechaCorta(date) {
  if (date == null) {
    return date;
  }

  var cs = date.split(" ");
  if (cs.length != 5) {
    return date;
  }
  var monthToSpanish = {"January": "enero", "February" : "febrero", "March": "marzo", "April": "abril", "May": "mayo", "June":"junio", "July":"julio", "August":"agosto", "September":"septiembre", "October":"octubre", "November":"noviembre", "December":"diciembre"};
  var dayToSpanish = {"Monday,": "lunes", "Tuesday,":"martes", "Wednesday,":"miércoles", "Thursday,":"jueves", "Friday,":"viernes", "Saturday,":"sábado", "Sunday,":"domingo"};
  var fecha = cs[1] + " " + monthToSpanish[cs[2]] + " " + cs[3].substr(0, cs[3].length - 1);

  return  fecha;
}

export function convertirFechaParaSubscripcion(date) {
  if (date == null) {
    return date;
  }

  var cs = date.split(" ");
  if (cs.length != 5) {
    return date;
  }
  var minDay = parseInt(cs[1]) + 5;
  var maxDay = minDay + 6;

  var fecha = "Entre el " + minDay + " y el " + maxDay + " de cada mes.";

  return  fecha;
}

export function addDaysToDate(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
