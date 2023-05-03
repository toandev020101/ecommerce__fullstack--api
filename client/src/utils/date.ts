export const monthToString = (month: number) => {
  switch (month + 1) {
    case 1:
      return 'Tháng một';

    case 2:
      return 'Tháng hai';

    case 3:
      return 'Tháng ba';

    case 4:
      return 'Tháng bốn';

    case 5:
      return 'Tháng năm';

    case 6:
      return 'Tháng sáu';

    case 7:
      return 'Tháng bảy';

    case 8:
      return 'Tháng tám';

    case 9:
      return 'Tháng chín';

    case 10:
      return 'Tháng mười';

    case 11:
      return 'Tháng mười một';

    case 12:
      return 'Tháng mười hai';

    default:
      return '';
  }
};

export const dateToString = (date: any, type: number = 0) => {
  const newDate = new Date(date);
  if (type === 0) {
    return `${newDate.getDate()} ${monthToString(newDate.getMonth())}, ${newDate.getFullYear()}`;
  }

  if (type === 1) {
    return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
  }

  return `Ngày ${newDate.getDate()} tháng ${newDate.getMonth() + 1} năm ${newDate.getFullYear()}`;
};

export const fullDateToString = (date: any) => {
  const newDate = new Date(date);
  return `${newDate.getHours() % 12}:${newDate.getMinutes()} ${
    newDate.getHours() < 12 ? 'AM' : 'PM'
  }, ${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
};

export const toDate = (date: any) => {
  return new Date(date);
};

export const toDateString = (date: any) => {
  const newDate = new Date(date);
  return `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`;
};
