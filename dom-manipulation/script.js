document.addEventListener("DOMContentLoaded", function() {

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");

    // Load existing quotes if there are any
    
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "With ALX, you are signed up to do hard things", category: "Motivation" },
        { text: "In life, not a taking is risk is taking an even more risk", category: "Life" },
        { text: "The future depends on the actions you take today", category: "Inspiration" }
    ];

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    

    // Select and display a random quote
    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `"${quote.text}" - ${quote.category}`;
    }

    // Dynamically create a form to add new quotes
    function createAddQuoteForm() {
        const form = document.createElement("div");

        // const textInput = document.getElementById("newQuoteText");
        const textInput = document.createElement("input");
        textInput.id = "newQuoteText";
        textInput.type = "text";
        textInput.placeholder = "Enter a new quote";

        // const categoryInput = document.getElementById("newQuoteCategory");
        const categoryInput = document.createElement("input");
        categoryInput.id = "newQuoteCategory";
        categoryInput.type = "text";
        categoryInput.placeholder = "Enter quote category";

        const addButton = document.createElement("button");
        addButton.id = "addQuoteButton";
        addButton.textContent = "Add Quote";

        form.appendChild(textInput);
        form.appendChild(categoryInput);
        form.appendChild(addButton);

        document.body.appendChild(form);

        addButton.addEventListener("click", function() {
            const newText = textInput.value.trim();
            const newCategory = categoryInput.value.trim();
            
            
            if(newText && newCategory) {
                quotes.push({ text: newText, category: newCategory });
    
                saveQuotes();
                textInput.value = "";
                categoryInput.value = "";
                
                quoteDisplay.innerHTML = `"${newText}" - ${newCategory}`;
            } else {
                alert("Please enter both text and category for the new quote.");
            }
        })




    }

    // Export Quotes
    function exportQuotes() {
        const exportButton = document.getElementById("exportQuotes");

        exportButton.addEventListener("click", function() {
            const quotesDataStr = JSON.stringify(quotes, null, 2);
            const blob = new Blob([quotesDataStr], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement("a");
            a.href = url;
            a.download = "quotes.json";
            // a.textContent = "Download Quotes";
            // document.body.appendChild(a);
            a.click();

            URL.revokeObjectURL(url);
        })
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
        fileReader.readAsText(event.target.files[0]);
  }

    // const addQuoteButton = document.getElementById("addQuoteButton");
    // addQuoteButton.addEventListener("click", createAddQuoteForm);

    newQuoteButton.addEventListener("click", showRandomQuote);
    showRandomQuote();

    createAddQuoteForm();

    exportQuotes();

    
})