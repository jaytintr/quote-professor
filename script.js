// DOM Selection
const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");

// Show Loading Spinner
function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

// Hide Loading Spinner
function hideLoadingSpinner() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

// Get Quote from API
async function getQuote() {
    let errorTimes = 0;
    // Show the loading spinner while pulling the quote 
    showLoadingSpinner();

    // We need to use a Proxy URL to make our API call in order to avoid overload
    const proxyUrl = 'https://agile-mountain-80691.herokuapp.com/';
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    try {
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();
        
        // Check if author field is blank and replace it with 'Unknown'
        if (data.quoteAuthor === '') {
            authorText.innerText = 'Unknown';
        } else {
            authorText.innerText = data.quoteAuthor;
        }

        // Dynamically reduce font size for long quotes pulled from the API
        if (data.quoteText.length > 120) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }      
        quoteText.innerText = data.quoteText;   

        // Finished pulling the quote then stop the loading spinner
        hideLoadingSpinner();
    } 
    
    // Restart the process of getting quote if there's any error from the API
    catch (error) {
        // This is a recursive funtion - a function calls itself
        errorTimes++;
        errorTimes >= 10 ? getQuote() : alert('The website is corrupted. Please try again sometimes');
    }
}

// Tweet Quote
function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitter = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitter, '_blank');
}

// Event Listeners - All buttons is listening for any click
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);


// On Loading
getQuote();