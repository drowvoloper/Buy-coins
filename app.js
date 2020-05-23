const tabler = document.querySelectorAll(".r1"); 
const tables = document.querySelectorAll(".r2");
const tablev = document.querySelectorAll(".r3");
const tablep = document.querySelectorAll(".r4");
const pagination = document.querySelector(".pagination");
const pages = [...document.querySelectorAll(".page")];
const last = document.querySelector(".last");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

let prevPage;
let nextPage;
let columns = [
	[...tabler],
	[...tables],
	[...tablev],
	[...tablep]
];
let coins;
let currentPage = 1;

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
	//currentPage = 5;
	let maxCoin = (5 * currentPage) - 1;
	let minCoin = maxCoin - 4;

	// then we loop through the rows array
	for (let i = 0; i <= columns.length; i++) {
		let coin = coins[minCoin + i];
		let price = Math.round(coin.price_usd);

		columns[0][i].innerText = coin.name;
		columns[1][i].innerText = coin.symbol;
		columns[2][i].innerText = `$ ${price}`;
		columns[3][i].innerText = coin.tsupply;
	}

	createPagination(minCoin, maxCoin);

	//console.log(coins[minCoin]);
	
};

// We use this function to calculate and display how many 
// pages will have
const createPagination = (min, max) => {
	const numberOfPages = Math.ceil(coins.length / 5); // 5 is the number of coins displayed in each page
	if (min == 0) {
		prev.style.display = "none";
	} else {
		prev.style.display = "inline";
		prevPage = min - 2;
	}

	if (max == coins.length - 1) {
		next.style.display = "none";
	} else {
		next.style.display = "inline";
		nextPage = max + 2;
	}

	console.log(nextPage);

	pages.forEach((page) => {
		
	});

	last.innerText = numberOfPages;
};

showCoins();

//console.log(columns[1][0].innerText);
