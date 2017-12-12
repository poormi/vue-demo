import moment from 'moment'

export const formatDate = (value, type) => {
    let format = ''
    switch (type) {
        case 'day':
            format = 'YYYY-MM-DD'
            break
        case 'second':
            format = 'HH:MM:SS'
            break
        default:
            format = type
            break
    }
    return moment(value).format(format)

}
export const fromNow = (value) => {
    return moment(value).fromNow();
}

export const hex2Rgb = (hex) => {
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    if (hex && reg.test(hex)) {
        if (hex.length === 4) {
            var hexNew = "#";
            for (var i = 1; i < 4; i += 1) {
                hexNew += hex.slice(i, i + 1).concat(hex.slice(i, i + 1));
            }
            hex = hexNew;
        }
        //handle hex color
        var hexChange = [];
        for (var i = 1; i < 7; i += 2) {
            hexChange.push(parseInt("0x" + hex.slice(i, i + 2)));
        }
        return hexChange.join(",")
    }
}

export const replaceFormatter = (str, args) => {
    const pattern = /\{(\d+)\}/g
    return str.replace(pattern, (key, index) => {
        return args[index]
    })
}