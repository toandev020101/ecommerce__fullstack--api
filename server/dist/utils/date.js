"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDateString = exports.toDate = void 0;
const toDate = (date) => {
    return new Date(date);
};
exports.toDate = toDate;
const toDateString = (date) => {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    let monthStr = month.toString();
    let dayStr = day.toString();
    if (month < 10) {
        monthStr = '0' + monthStr;
    }
    if (day < 10) {
        dayStr = '0' + dayStr;
    }
    return `${year}-${monthStr}-${dayStr}`;
};
exports.toDateString = toDateString;
//# sourceMappingURL=date.js.map