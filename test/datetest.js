
let line =  "Zulu Time.: 2019/09/23 18:01:45 ";

let zuluTime = line                     // "Zulu Time.: 2019/09/23 11:01:45 "
    .trim()                             // "Zulu Time.: 2019/09/23 11:01:45"
    .replace(/^Zulu Time.\: /g, '')     // "2019/09/23 11:01:45"
    .replace(/\//g, '-')                // "2019-09-23 11:01:45"
    .replace(/ /g, 'T')                 // "2019-09-23T11:01:45"
    .concat(".000Z");                   // "2019-09-23T11:01:45.000Z"

console.log(new Date(Date.parse(zuluTime)));
