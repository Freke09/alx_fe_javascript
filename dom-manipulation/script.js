let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "With ALX, you are signed up to do hard things", category: "Motivation" },
    { text: "In life, not a taking is risk is taking an even more risk", category: "Life" },
    { text: "The future depends on the actions you take today", category: "Inspiration" }
];

document.addEventListener("DOMContentLoaded", function() {

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");

    // Load existing quotes if there are any
    

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

                saveServerQuotes({ text: newText, category: newCategory });
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

    function populateCategories() {
        const categories = document.getElementById("categoryFilter");

        categories.innerHTML = '<option value="all">All Categories</option>';
        
        const uniqueCategories = [...new Set(quotes.map(q => q.category))];

        uniqueCategories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categories.appendChild(option);
        });
    }

    function filterQuotes() {
        const selectedCategory = document.getElementById("categoryFilter").value;

        let filteredQuotes = quotes;
        if(selectedCategory !== "all") {
            filteredQuotes = quotes.filter(q => q.category === selectedCategory);
        }

        if(filteredQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            const quote = filteredQuotes[randomIndex];
            quoteDisplay.innerHTML = `"${quote.text}" - ${quote.category}`;
        } else {
            quoteDisplay.innerHTML = "No quotes to display fo this category."
        }
    }

    // const addQuoteButton = document.getElementById("addQuoteButton");
    // addQuoteButton.addEventListener("click", createAddQuoteForm);

    newQuoteButton.addEventListener("click", showRandomQuote);

    syncQuotes().then(() => {
        populateCategories();
        showRandomQuote();
        
    })
    
    createAddQuoteForm();
    exportQuotes();

    window.filterQuotes = filterQuotes;
    window.importFromJsonFile = importFromJsonFile;

    
})

// Simulate server Interaction:
let serverQuotes = [
    {text: "This life is whatever you make of it, and whenever you make it", category: "Life"},
    {text: "The only way to do great work is to love what you do", category: "Inspiration"}
];

// Fake server API
function fetchQuotesFromServer() {
    return fetch("https://jsonplaceholder.typicode.com/posts")
        .then(response => response.json())
        .then(data => {

            return data.map(post => ({
                text: post.title,
                category: "imported"
            }));
        });
}

function saveServerQuotes(newQuotes) {
    return fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newQuotes)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Quotes saved to server:", data);
        return data;
    })
    .catch(error => {
        console.error("Error saving quotes to server:", error);
    });
}


async function syncQuotes() {
    try {
        const serverData = await fetchQuotesFromServer();


        // compare with local quotes
        const localData = JSON.parse(localStorage.getItem("quotes")) || [];

        const mergedData = resolveConflict(localData, serverData);

        localStorage.setItem("quotes", JSON.stringify(mergedData));
        quotes = mergedData;

        await saveServerQuotes(mergedData);
        alert("Quotes synced successfully from server!");
    } catch (error) {
        console.error("Error syncing from server:", error);
    }
}

function resolveConflict(local, server) {
    const merged = [];

    const map = new Map();

    [...local, ...server].forEach(q => {
        if (!map.has(q.text)) {
            map.set(q.text, q);
        } else {
            const existing = map.get(q.text);

            // keep the newest one
            map.set(q.text, existing ? q : existing);
        }
    });
    return Array.from(map.values());
}