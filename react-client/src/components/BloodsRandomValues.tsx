// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

export function getRandomInt(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

export function getRandomDecimalLarge(min,max){
    return Math.floor(((Math.random()*(max-min))+min))/100;
}

export function getRandomDecimalSmall(min,max){
    return Math.floor((Math.random()*(max-min)+min))/10;
}
