
import { City } from "./logic.js";

let libertyCity = new City(4, 4);
libertyCity.toggle(1, 2);
libertyCity.toggle(2, 1);
libertyCity.toggle(2, 2);
libertyCity.toggle(3, 2);
/**
 
let step1 = [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 1], [0, 1, 1, 0]]
let step2 = [[0, 0, 0, 0], [0, 1, 0, 1], [1, 0, 0, 1], [0, 1, 0, 1]]
let step3 = [[0, 0, 0, 0], [0, 0, 1, 0], [1, 1, 0, 1], [0, 0, 1, 0]]
let step4 = [[0, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 1], [0, 1, 1, 0]]

*/


console.log(libertyCity.currentCity);
// console.log(libertyCity.getCountArray())
console.log(libertyCity.nextState())
// console.log(libertyCity.getCountArray())
console.log(libertyCity.nextState())
// console.log(libertyCity.getCountArray())
console.log(libertyCity.nextState())
console.log(libertyCity.getCountArray())
console.log(libertyCity.nextState())

