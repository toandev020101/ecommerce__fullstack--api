"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDateString = exports.toDate = exports.fullDateToString = exports.dateToString = exports.monthToString = void 0;
const monthToString = (month) => {
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
exports.monthToString = monthToString;
const dateToString = (date) => {
    const newDate = new Date(date);
    return `${newDate.getDate()} ${(0, exports.monthToString)(newDate.getMonth())}, ${newDate.getFullYear()}`;
};
exports.dateToString = dateToString;
const fullDateToString = (date) => {
    const newDate = new Date(date);
    return `${newDate.getHours() % 12}:${newDate.getMinutes()} ${newDate.getHours() < 12 ? 'AM' : 'PM'}, ${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
};
exports.fullDateToString = fullDateToString;
const toDate = (date) => {
    return new Date(date);
};
exports.toDate = toDate;
const toDateString = (date) => {
    const newDate = new Date(date);
    return `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`;
};
exports.toDateString = toDateString;
//# sourceMappingURL=date.js.map