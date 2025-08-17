document.addEventListener("DOMContentLoaded", function() {

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    
    const quotes = [
        { text: "With ALX, you are signed up to do hard things", category: "Motivation" },
        { text: "In life, not a taking is risk is taking an even more risk", category: "Life" },
        { text: "The future depends on the actions you take today", category: "Inspiration" }
    ];

    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `"${quote.text}" - ${quote.category}`;
    }

    function createAddQuoteForm() {
        const textInput = document.getElementById("newQuoteText");
        const categoryInput = document.getElementById("newQuoteCategory");

        const newText = textInput.value.trim();
        const newCategory = categoryInput.value.trim();

        if(newText && newCategory) {
            quotes.push({ text: newText, category: newCategory });

            textInput.value = "";
            categoryInput.value = "";

            quoteDisplay.innerHTML = `"${newText}" - ${newCategory}`;
        } else {
            alert("Please enter both text and category for the new quote.");
        }
    }

    const addQuoteButton = document.getElementById("addQuoteButton");
    addQuoteButton.addEventListener("click", createAddQuoteForm);

    newQuoteButton.addEventListener("click", showRandomQuote);
    showRandomQuote();

    
})