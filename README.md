# BUY COINS: MY SOLUTION

Ok, so I am going to explain the steps I took to solve the pagination and display all the coins.

## The HTML File

So, the first step is adding the pagination on the index.html file. I made it this way:

```
<!-- ✅ Add your navigation elements here  -->
<div class="pagination">
	<a href="#" class="page first current">1</a>
	<a href="#" class="prev">...</a>
	<a href="#" class="page">2</a>
	<a href="#" class="page">3</a>
	<a href="#" class="page">4</a>
	<a href="#" class="page">5</a>
	<a href="#" class="next">...</a>
	<a href="#" class="page last"></a>
</div>
```

There are two pages which will be always displayed: the first and the last one. The first will be always displayed as a number 1 but the last page we can't know it yet as it depends on the number of coins and the number of them that we will want to be displayed by page.

note: I didn't do it, but maybe changing the class names "r1, r2, r3 and r4" to "col1, col2, col3 and col4" respectively is the best idea since they refer to the columns and r could lead us to think they are the rows. 

## The Variables

There are a bunch of variables here at the top of the file:

```
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
```

`tabler` (coin), `tables` (code), `tablev` (price) and `tablep` (total supply) are the columns. We use the `columns` variable to group them and make like a mental table. It will make more sense later.

The reason why I declare `pages` that way is because if I would use just querySelectorAll, I would get a NodeList which wouldn't be iterable and we couldn't use array methods. With that `[...elements]` I transform that NodeList into an array so it can be handled more easily.

`prev`/`next` are actually the links to the previous or next pages, and `prevPage`/`nextPage` variables store the numbers of that pages.

`coins` will help us to keep the data fetched from the API. 

## Fetching Data from the API

I fetch the data from the API with this function:

```
const fetchCoins = async () => {
  coins = await fetch(
    'https://api.coinlore.com/api/tickers/'
  ).then(result => result.json()
  ).then(data => data.data)
};
```

so I can use it in the next step.

## Actually Showing the Coins

Let's make it step by step.

```
const showCoins = async () => {
  if (!coins) {
    await fetchCoins();
  }

	/* ...more code */
```

The first thing we need is to make this function asynchronous in order to use await when we call `fetchCoins`. If we don't do that, JavaScript will keep reading the next lines of code without waiting for the data to be ready, and we couldn't access it. This way, it waits and keeps waiting until and only until `fetchCoins` has ended and coins has a value.

I use a conditional to fetch only once.

```
let maxCoin = (5 * currentPage) - 1;
let minCoin = maxCoin - 4;
```

Now we calculate, from the array of coins we fetched from the API, which are the coins that are being displayed in the current page. For example, I am displaying 5 coins by page, so in the first page (`currentPage` being 1) the index of the 5th coin being displayed would be `(5 * 1) - 1 = 4`. And the index of the first coin displayed is whatever the value of that `maxCoin` minus 4 (0 in this case).

If you would like to display a different number of coins for each page, you should change that 5 for that number, and the 4 for the new number minus 1.

In the next step we are taking these variables to loop thorugh the rows of the table and display the right data.

```
for (let i = 0; i <= columns.length; i++) {
  let coin = coins[minCoin + i];
  let price = Math.round(coin.price_usd);

  columns[0][i].innerText = coin.name;
  columns[1][i].innerText = coin.symbol;
  columns[2][i].innerText = `$ ${price}`;
  columns[3][i].innerText = coin.tsupply;
}
```

Do you remember that `columns` variable? Well, it becomes handful here. We actually could use the table variables individually, but I think it's clearer this way. 

So we display the name of the coin in the first column, the symbol in the second, the price (which we rounded with `Math.round`) in the third and the total supply in the fourth. And the index (`i`) just indicates the row we are in.

I used this function too to calculate and display the last page:

```
lastPage = Math.ceil(coins.length / 5);
last.innerText = lastPage;
```

Again, 5 is the number of coins that are displayed in each page. 

The whole function would look like this:

```
const showCoins = async () => {
  if (!coins) {
    await fetchCoins();
  }

  let maxCoin = (5 * currentPage) - 1;
  let minCoin = maxCoin - 4;

  for (let i = 0; i <= columns.length; i++) {
    let coin = coins[minCoin + i];
    let price = Math.round(coin.price_usd);

    columns[0][i].innerText = coin.name;
    columns[1][i].innerText = coin.symbol;
    columns[2][i].innerText = `$ ${price}`;
    columns[3][i].innerText = coin.tsupply;
  }

	lastPage = Math.ceil(coins.length / 5);
	last.innerText = lastPage;
}
```

## Event Listeners

Ok, we need some event listeners to make everything work.

```
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
```

Here I am using a `forEach` method to loop through every page and add an event listener so when a page number is clicked, the coins displayed change, calling `showCoins`. I also add a `current` state to style the current page.

```
prev.addEventListener('click', () => createPagination('-'));
next.addEventListener('click', () => createPagination('+'));
```

For the `prev` and `next` links, I am calling a function `createPagination`. I will explaing this one later.

I also add an event listener to the first and the last pages:

```
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
```

We basically calculate the pages that we display when these links are clicked and then call a function `prevNext` which will be explained later.

## Display the Pagination

When the `prev` or `next` links are clicked, we call `createPagination` that, in turn, call two different functions:

```
const createPagination = (calculation) => {
  displayPages(calculation);
  prevNext();
};
```

`displayPages` displayes the right numbers of the pages in the pagination: 

```
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
```

We don't change the value of the first and the last pages, since they will always be the same. We also calculate what is the current page based on the link clicked (`next` or `prev`). And we add the `current` class name to the `currentPage` so we can style it.

Now, `prevNext` just figures out if the `prev` or the `next` links need to be displayed (if, for example, we are in the first page, there wouldn't exist numbers between 1 and the next page, 2, so it wouldn't be needed to show the `prev` link).

```
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
```


