const tabler = document.querySelector(".r1") 
const tables = document.querySelector(".r2") 
const tablev = document.querySelector(".r3")
const tablep = document.querySelector(".r4")

fetch('https://api.coinlore.com/api/tickers/')
.then(result =>{
    console.log(result)
    return result.json();
}).then(data =>{
    console.log(data)
    const coinsArr = Array.from(data)
// 08074665617 Bro Bolu
})

let arr= [1,2,2,3,5,7]
console.log(arr[1])