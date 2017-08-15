function int2rgb(c) {
    return 'rgb('
        + ((c >> 16) & 0xff) + ','
        + ((c >> 8) & 0xff) + ','
        + ((c >> 0) & 0xff) + ')';
}

function hex2int(c) {
    if (c[0] == '#') {
        c = c.slice(1);
    }
    return parseInt(c, 16);
}

function int2hex(c) {
    c = parseInt(c).toString(16);
    return '#' + ('000000' + c).slice(-6);
}

const colors = [0xff0000, 0x00ff00, 0x0000ff, 0x808000, 0x008080, 0x800080];
