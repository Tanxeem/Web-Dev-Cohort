const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const newQuoteButton = document.getElementById('new-quote');
const copyQuoteButton = document.getElementById('copy-quote');
const shareTwitterButton = document.getElementById('share-twitter');
const exportQuoteButton = document.getElementById('export-quote');

// <!-- ========== Fetch Data Start Section ========== -->
async function fetchQuote() {
    const url = 'https://api.freeapi.app/api/v1/public/quotes/quote/random';
const options = {method: 'GET', headers: {accept: 'application/json'}};

    try {
        const response = await fetch(url, options);
    const data = await response.json();

    if(data.success) {
        quoteElement.textContent = data.data.content;
    authorElement.textContent = `Author : ${data.data.author}`;
    }else {
        quoteElement.textContent = "Failed to fetch quote. please try again";
    authorElement.textContent = "";
    }

    } catch (error) {
        console.error("Error fetching quote:", error);
    quoteElement.textContent = "An error occurred. Please try again.";
    authorElement.textContent = "";
    }
}

newQuoteButton.addEventListener('click', fetchQuote);

// <!-- ========== Fetch Data End Section ========== -->


// <!-- ========== Copy Quote Start Section ========== -->

copyQuoteButton.addEventListener('click', () => {
    const quoteText = `"${quoteElement.textContent}" - ${authorElement.textContent}`;
    navigator.clipboard.writeText(quoteText).then(() => {
        alert('Quote copied to clipboard!');
    }).catch((error) => {
        console.error('Error copying quote:', error);
    });
});

// <!-- ========== Copy Quote End Section ========== -->


// <!-- ========== Share Twitter Start Section ========== -->

shareTwitterButton.addEventListener('click', () => {
    const quoteText = `"${quoteElement.textContent}" - ${authorElement.textContent}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText)}`;
    window.open(twitterUrl, '_blank');
});

// <!-- ========== Share Twitter End Section ========== -->


// <!-- ========== Export Button Start Section ========== -->

exportQuoteButton.addEventListener('click', () => {
    const quoteText = `"${quoteElement.textContent}" - ${authorElement.textContent}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = `data:text/plain;charset=utf-8,${encodeURIComponent(quoteText)}`;
    downloadLink.download = 'quote_of_the_day.txt';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});

// <!-- ========== Export Button End Section ========== -->

// fetchQuote(); if you want to fetch the quote on page load