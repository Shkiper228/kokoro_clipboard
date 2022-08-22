const log = require('../classes/Logger.js');

function cutNum(num) {
    if(typeof num === 'undefined' || typeof num === 'object' || typeof num === 'boolean'|| typeof num === 'symbol'|| typeof num === 'function'){
        log(`Функції cutNum не підходить тип \"${typeof num}\"`, 'error');
        return;
    } else {
        
    }




    if(num >= 1000000) {
        return `${Math.floor(num / 100000) / 10}M`;
    } else  if(num >= 1000) {
        return `${Math.floor(num / 100) / 10}K`;
    } else {
        return num;
    }
}

module.exports.cutNum = cutNum;


function checkAndConvertOfType(obj, type) {
    switch (type) {
        case undefined:
            if(obj === type){
                return obj;
            } else {
                return;
            }
            break;

        case 'undefined':
            if(typeof obj === type){
                return obj;
            } else {
                return;
            }
            break;

        case 'object':
            if(typeof obj === type){
                return obj;
            } else {
                return;
            }
            break;

        case 'boolean':
            if(typeof obj === type){
                return obj;
            } else if(obj === 'true' || obj === 1){
                return true;
            } else if(obj === 'false' || obj === 0){
                return false;
            } else {
                return;
            }
            break;

        case 'number':
            if(typeof obj === type){
                return obj;
            } else{
                if(`${Number(obj)}` != 'NaN') {
                    return Number(obj);
                } else {
                    return;
                }
            }
            break;

        case 'int':
            if(typeof obj === 'number' && obj % 1 == 0){
                return obj;
            } else{
                if(`${Number(obj)}` != 'NaN' && Number(obj) % 1 == 0) {
                    return Number(obj);
                } else {
                    return;
                }
            }
            break;

        case 'bigint':
            if(typeof obj === type){
                return obj;
            } else{
                try {
                    return BigInt(obj);
                } catch (error) {
                    return;
                }
            }
            break;

        case 'string':
            if(typeof obj === type){
                return obj;
            } else {
                return String(obj)
            }
            break;

        case 'function':
            if(typeof obj === type){
                return obj;
            } else {
                return;
            }
            break;
    
        default:
            log(`В функцію \'${arguments.callee.name}\' треба передати строку з назвою типу даних`, 'error')
            break;
    }
}

module.exports.checkAndConvertOfType = checkAndConvertOfType;