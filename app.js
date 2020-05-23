const tabler = document.querySelectorAll(".r1") 
const tables = document.querySelectorAll(".r2") 
const tablev = document.querySelectorAll(".r3")
const tablep = document.querySelectorAll(".r4")
let columns = [
	[...tabler],
	[...tables],
	[...tablev],
	[...tablep]
];
let coins;
let currentPage = 1;

/*fetch('https://api.coinlore.com/api/tickers/')
.then(result =>{
    //console.log(result)
    return result.json();
}).then(data =>{
    //console.log(data)
    const coinsArr = data.data;
// 08074665617 Bro Bolu
	console.log(coinsArr);
})

let arr= [1,2,2,3,5,7]
//console.log(arr[1])*/

// Step 1: We create a function to fetch the data from the API
const fetchCoins = async () => {
	coins = await fetch(
		'https://api.coinlore.com/api/tickers/'
	).then(result => result.json()
	).then(data => data.data)
};

// Step 2: We create the function that will display the data
const showCoins = async () => {
	if (!coins) {
		await fetchCoins();
	}

	// we calculate the first and the last item from coins we need to show
	// based on the current page
	currentPage = 5;
	let maxCoin = (5 * currentPage) - 1;
	let minCoin = maxCoin - 4;

	// then we loop through the rows array
	for (let i = 0; i < columns.length; i++) {
		let coin = coins[minCoin + i];
		let price = Math.round(coin.price_usd);

		columns[0][i].innerText = coin.name;
		columns[1][i].innerText = coin.symbol;
		columns[2][i].innerText = `$ ${price}`;
		columns[3][i].innerText = coin.tsupply;
	}
	//console.log(coins[minCoin]);
	
}

showCoins();

//console.log(columns[1][0].innerText);
