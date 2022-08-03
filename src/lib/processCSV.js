"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessCSV = void 0;
const ProcessCSV = (str, delim = ',') => {
    let headers = str.slice(0, str.indexOf('\n')).split(delim);
    headers[headers.length - 1] = headers[headers.length - 1].replace(/(\r\n|\n|\r)/gm, "");
    let rows = str.slice(str.indexOf('\n') + 1).split('\n');
    const newArray = rows.map(row => {
        const values = row.split(delim);
        const eachObject = headers.reduce((_obj, header, i) => {
            var _a;
            _obj[header] = (_a = values[i]) === null || _a === void 0 ? void 0 : _a.replace(/(\r\n|\n|\r)/gm, "");
            return _obj;
        }, {});
        return eachObject;
    });
    return newArray;
};
exports.ProcessCSV = ProcessCSV;
