function getColorByTime () {
    function hexToDec (hex) {
        let dec = 0;
        switch (hex[0]) {
            case 'A':
                dec += 10 * 16
                break;
            case 'B':
                dec += 11 * 16
                break;
            case 'C':
                dec += 12 * 16
                break;
            case 'D':
                dec += 13 * 16
                break;
            case 'E':
                dec += 14 * 16
                break;
            case 'F':
                dec += 15 * 16
                break;
            default:
                dec += Number(hex[0]) * 16
                break;
        }
    
        switch (hex[1]) {
            case 'A':
                dec += 10
                break;
            case 'B':
                dec += 11
                break;
            case 'C':
                dec += 12
                break;
            case 'D':
                dec += 13
                break;
            case 'E':
                dec += 14
                break;
            case 'F':
                dec += 15
                break;
            default:
                dec += Number(hex[1])
                break;
        }
    
        return dec;
    }
    
    
    function decToHex (dec) {
        let hexChars = [];
        if(dec >= 16) {
            hexChars.unshift(`${dec % 16}`);
            dec = (dec - (dec % 16)) / 16
            hexChars.unshift(`${dec}`)
        } else {
            hexChars.unshift('0');
            hexChars.unshift('0');
        }
    
    
    
        switch (hexChars[0]) {
            case '10':
                hexChars[0] = 'a';
                break;
            case '11':
                hexChars[0] = 'b';
                break;
            case '12':
                hexChars[0] = 'c';
                break;
            case '13':
                hexChars[0] = 'd';
                break;
            case '14':
                hexChars[0] = 'e';
                break;
            case '15':
                hexChars[0] = 'f';
                break;
        }
    
    
    
        switch (hexChars[1]) {
            case '10':
                hexChars[1] = 'a';
                break;
            case '11':
                hexChars[1] = 'b';
                break;
            case '12':
                hexChars[1] = 'c';
                break;
            case '13':
                hexChars[1] = 'd';
                break;
            case '14':
                hexChars[1] = 'e';
                break;
            case '15':
                hexChars[1] = 'f';
                break;
        }
    
    
        
        let hex = hexChars.join('');
        return hex;
        
    }
    
    const date = new Date();
    const colorLight = '4878CC', colorDark = '000C18';
    const timeString = date.toLocaleTimeString('uk-UA', { timeZone: 'Europe/Kiev' });
    const middleHour = 12;
    const maxDifference = (24 - middleHour) * 60;

    let difference = Math.abs(Number(timeString.slice(0, 2)) - middleHour) * 60 + Number(timeString.slice(3, 5));

    const redL = colorLight.slice(0, 2), greenL = colorLight.slice(2, 4), blueL = colorLight.slice(4, 6);
    const redD = colorDark.slice(0, 2), greenD = colorDark.slice(2, 4), blueD = colorDark.slice(4, 6);

    let red = decToHex(Math.floor((1 - difference/maxDifference) * (Math.abs(hexToDec(redL) - hexToDec(redD) + hexToDec(redD)))));
    let green = decToHex(Math.floor((1 - difference/maxDifference) * (Math.abs(hexToDec(greenL) - hexToDec(greenD) + hexToDec(greenD)))));
    let blue = decToHex(Math.floor((1 - difference/maxDifference) * (Math.abs(hexToDec(blueL) - hexToDec(blueD) + hexToDec(blueD)))));
    
    return `#${red}${green}${blue}`

}


module.exports = getColorByTime;