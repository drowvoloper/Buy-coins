const tabler = document.querySelectorAll(".r1"); 
const tables = document.querySelectorAll(".r2");
const tablev = document.querySelectorAll(".r3");
const tablep = document.querySelectorAll(".r4");
const pagination = document.querySelector(".pagination");
const pages = [...document.querySelectorAll(".page")];
const first = document.querySelector(".first");
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
let lastPage;


// function to fetch the data from the API
const fetchCoins = async () => {
	coins = await fetch(
		'https://api.coinlore.com/api/tickers/'
	).then(result => result.json()
	).then(data => data.data)
};

// function that will display the data
const showCoins = async () => {
	if (!coins) {
		await fetchCoins();
	}

	// we calculate the first and the last item from coins we need to show
	// based on the current page
	let maxCoin = (5 * currentPage) - 1;
	let minCoin = maxCoin - 4;

	// then we loop through the columns array
	for (let i = 0; i <= columns.length; i++) {
		let coin = coins[minCoin + i];
		let price = Math.round(coin.price_usd);

		columns[0][i].innerText = coin.name;
		columns[1][i].innerText = coin.symbol;
		columns[2][i].innerText = `$ ${price}`;
		columns[3][i].innerText = coin.tsupply;
	}

	lastPage = Math.ceil(coins.length / 5); // 5 is the number of coins displayed in each page
	last.innerText = lastPage;
};

// function to show the number of pages in the pagination
const displayPages = (calculation) => {
	pages.forEach((page) => {
		page.classList.remove('current');
		if (!page.classList.contains('first') &&
				!page.classList.contains('last')) {
			let lastValue = parseInt(page.innerText);
			page.innerText = calculation == '+' ?
				lastValue + 4 :
				lastValue - 4;
		}
	});

	if (calculation == '+') {
		currentPage = parseInt(pages[1].innerText);
	}
	else {
		currentPage = pages[4].innerText - 3;
	}

	pages[1].classList.add('current');
};

// function to show or hide the "prev" and "next" links
const prevNext = () => {
	
	if (currentPage == 1 || currentPage == 2) {
		prev.style.display = "none";
	} else {
		prev.style.display = "inline";
	}

	if (currentPage == lastPage || currentPage == lastPage - 1) {
		next.style.display = "none";
	} else {
		next.style.display = "inline";
	}
}

// We use this function to calculate and display how many 
// pages will have
const createPagination = (calculation) => {
	displayPages(calculation);
	prevNext();
};

showCoins();


/* Event Listeners */
pages.forEach((page) => {
	page.addEventListener('click', (event) => {
		let value = event.target.innerText;
		currentPage = parseInt(value);
		
		pages.forEach((page) => {
			page.classList.remove('current');
		});
		page.classList.add('current');

		showCoins();
	});
});
prev.addEventListener('click', () => createPagination('-'));
next.addEventListener('click', () => createPagination('+'));
first.addEventListener('click', () => {
	
	for (let x = 1; x < 5; x++) {
		pages[x].innerText = x + 1;
	}

	prevNext();
});

last.addEventListener('click', () => {
	for (let x = 1; x < 5; x++) {
		pages[x].innerText = lastPage - 5 + x;
	}	

	prevNext();
});
