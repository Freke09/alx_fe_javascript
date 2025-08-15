document.addEventListener("DOMContentLoaded", function() {

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    
    const quotes = [
        { text: "With ALX, you are signed up to do hard things", category: "Motivation" },
        { text: "In life, not a taking is risk is taking an even more risk", category: "Life" },
        { text: "The future depends on the actions you take today", category: "Inspiration" }
    ];

    function displayQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;
    }

    function showRandomQuote() {
        displayQuote();
    }
    newQuoteButton.addEventListener("click", showRandomQuote);
    showRandomQuote();

    
})