export const PRECIO_BOTELLA = 49;

export function convertirFecha(date) {
  var cs = date.split(" ");
  console.log("BRUTAL ", cs);

  if (cs.length != 5) {
    return date;
  }
  var monthToSpanish = {"January": "Enero", "February" : "Febrero", "March": "Marzo", "April": "Abril", "May": "Mayo", "June":"Junio", "July":"Julio", "August":"Agosto", "September":"Septiembre", "October":"Octubre", "November":"Noviembre", "December":"Diciembre"};
  var dayToSpanish = {"Monday,": "Lunes", "Tuesday,":"Martes", "Wednesday,":"Miércoles", "Thursday,":"Jueves", "Friday,":"Viernes", "Saturday,":"Sábado", "Sunday,":"Domingo"};

  console.log("check up ", dayToSpanish[cs[0]]);
  var fecha = dayToSpanish[cs[0]] + " " + cs[1] + " " + monthToSpanish[cs[2]] + " " + cs[3] + " " + cs[4];

  return  fecha;
}
