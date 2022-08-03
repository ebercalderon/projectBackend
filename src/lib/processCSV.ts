export const ProcessCSV = (str: string, delim = ','): any[] => {
    let headers = str.slice(0, str.indexOf('\n')).split(delim);
    headers[headers.length - 1] = headers[headers.length - 1].replace(/(\r\n|\n|\r)/gm, "");

    let rows = str.slice(str.indexOf('\n') + 1).split('\n');

    const newArray = rows.map(row => {
        const values = row.split(delim);
        const eachObject = headers.reduce((_obj: { [k: string]: any }, header: string, i: number) => {
            _obj[header] = values[i]?.replace(/(\r\n|\n|\r)/gm, "");
            return _obj;
        }, {})

        return eachObject;
    })

    return newArray;
}