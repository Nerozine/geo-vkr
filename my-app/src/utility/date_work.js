function convertDate(date) {
    // Mon Mar 28 2022 02:15:41 GMT+0700 (Новосибирск, стандартное время) input
    // yyyy-mm-ddThh:mm:ss output
    let result = `${date.getFullYear()}-`;

    if (date.getMonth() + 1 > 9) {
        result += `${date.getMonth() + 1}-`;
    }
    else {
        result += `0${date.getMonth() + 1}-`;
    }

    if (date.getDate() > 9) {
        result += `${date.getDate()}T`;
    }
    else {
        result += `0${date.getDate()}T`;
    }

    if (date.getHours() > 9) {
        result += `${date.getHours()}:`;
    }
    else {
        result += `0${date.getHours()}:`;
    }

    if (date.getMinutes() > 9) {
        result += `${date.getMinutes()}:`;
    }
    else {
        result += `0${date.getMinutes()}:`;
    }

    if (date.getSeconds() > 9) {
        result += `${date.getSeconds()}`;
    }
    else {
        result += `0${date.getSeconds()}`;
    }

    return result;
}

function toReadableDate(date) {
    // yyyy-mm-ddThh:mm:ss input
    // Wed Oct 27 2021 10:52:50 GMT+0700 (Новосибирск, стандартное время) output
    return new Date(date).toString();
}


export {convertDate, toReadableDate};