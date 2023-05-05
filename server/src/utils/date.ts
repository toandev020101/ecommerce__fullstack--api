export const toDate = (date: any) => {
  return new Date(date);
};

export const toDateString = (date: any) => {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const day = newDate.getDate();

  let monthStr: string = month.toString();
  let dayStr: string = day.toString();

  if (month < 10) {
    monthStr = '0' + monthStr;
  }

  if (day < 10) {
    dayStr = '0' + dayStr;
  }

  return `${year}-${monthStr}-${dayStr}`;
};
