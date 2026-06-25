export function setYear(date = new Date(), year: number) {
  date.setFullYear(date.getFullYear() + year);
  return date;
}
export function setMonth(date = new Date(), month: number) {
  date.setMonth(date.getMonth() + month);
  return date;
}
export function setDate(date = new Date(), day: number) {
  date.setDate(date.getDate() + day);
  return date;
}
export function setHour(date = new Date(), hour: number) {
  date.setHours(date.getHours() + hour);
  return date;
}
export function setMinute(date = new Date(), minute: number) {
  date.setMinutes(date.getMinutes() + minute);
  return date;
}

export function createIntervals(start: Date, end: Date, size: number = 5) {
  const tempStart = new Date(start.getTime());
  const intervals = [];
  // const size = 5;
  for (let i = 0; i < size; i++) {
    if (tempStart.getFullYear() + 1 < end.getFullYear()) {
      tempStart.setFullYear(tempStart.getFullYear() + 1);
      intervals.push(tempStart.toISOString());
    } else {
      break;
    }
  }
  tempStart.setFullYear(end.getFullYear());
  tempStart.setMonth(end.getMonth() - 1);
  for (let i = 0; i < size; i++) {
    if (tempStart >= end || tempStart <= start) {
      break;
    }
    intervals.push(tempStart.toISOString());
    tempStart.setMonth(tempStart.getMonth() - 1);
  }

  tempStart.setFullYear(end.getFullYear());
  tempStart.setMonth(end.getMonth());
  tempStart.setDate(end.getDate() - 1);
  for (let i = 0; i < size; i++) {
    if (tempStart >= end || tempStart <= start) {
      break;
    }
    intervals.push(tempStart.toISOString());
    tempStart.setDate(tempStart.getDate() - 1);
  }
  tempStart.setFullYear(end.getFullYear());
  tempStart.setMonth(end.getMonth());
  tempStart.setDate(end.getDate());
  tempStart.setHours(end.getHours() - 1);
  for (let i = 0; i < size; i++) {
    if (tempStart >= end || tempStart <= start) {
      break;
    }
    intervals.push(tempStart.toISOString());
    tempStart.setHours(tempStart.getHours() - 1);
  }
  tempStart.setFullYear(end.getFullYear());
  tempStart.setMonth(end.getMonth());
  tempStart.setDate(end.getDate());
  tempStart.setHours(end.getHours());
  tempStart.setMinutes(end.getMinutes() - 1);
  for (let i = 0; i < size; i++) {
    if (tempStart >= end || tempStart <= start) {
      break;
    }
    intervals.push(tempStart.toISOString());
    tempStart.setMinutes(tempStart.getMinutes() - 1);
  }
  return intervals;
}
