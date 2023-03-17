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

export const dateToString = (date: any) => {
  const newDate = new Date(date);
  return `${newDate.getDay()} ${monthToString(newDate.getMonth())}, ${newDate.getFullYear()}`;
};

export const toDate = (date: any) => {
  return new Date(date);
};
