let quotes = JSON.parse(localStorage.getItem("quotes")) [
  { text: 'The best way to predict the future is to invent it.', category: 'Inspiration' },
  { text: 'Life is what happens when you’re busy making other plans.', category: 'Life' },
  { text: 'Success is not final, failure is not fatal: it’s the courage to continue that counts.', category: 'Motivation' },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Do not pray for an easy life, pray for the strength to endure a difficult one.", category: "Wisdom" },
  { text: "An investment in knowledge pays the best interest.", category: "Education" },
  { text: "The journey of a thousand miles begins with a single step.", category: "Motivation" }
];
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
}
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerText = `"${randomQuote.text}" — ${randomQuote.category}`;
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}



function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";
  textInput.id = "dynamicQuoteText";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.id = "dynamicQuoteCategory";

  const addButton = document.createElement("button");
  addButton.innerText = "Add Quote (Dynamic)";
  addButton.onclick = function () {
    const text = document.getElementById("dynamicQuoteText").value.trim();
    const category = document.getElementById("dynamicQuoteCategory").value.trim();

    if (text && category) {
      quotes.push({ text, category });
      localStorage.setItem("quotes", JSON.stringify(quotes));
      populateCategories();
      alert("Quote added successfully!");
      document.getElementById("dynamicQuoteText").value = "";
      document.getElementById("dynamicQuoteCategory").value = "";
    } else {
      alert("Please enter both text and category.");
    }
  };

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}


function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    localStorage.setItem("quotes", JSON.stringify(quotes));
    alert("Quote added successfully!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    populateCategories();
    postQuoteToServer(newQuote);
  } else {
    alert("Please enter both text and category.");
  }
}
 function exportToJsonFile() {
      const dataStr = JSON.stringify(quotes, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "quotes.json";
      a.click();
      URL.revokeObjectURL(url);
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
window.onload = function () {
  if (sessionStorage.getItem("lastQuote")) {
    const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
    document.getElementById("quoteDisplay").innerText = `"${lastQuote.text}" — ${lastQuote.category}`;
  }
}


document.getElementById("newQuote").addEventListener("click", showRandomQuote);


createAddQuoteForm();
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
   const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
    filterQuotes();
  }
}
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    document.getElementById("quoteDisplay").innerText =
      `"${randomQuote.text}" — ${randomQuote.category}`;
  } else {
    document.getElementById("quoteDisplay").innerText =
      "No quotes available for this category.";
  }
    localStorage.setItem("selectedCategory", selectedCategory);
}
window.onload = () => {
  
  const lastViewed = sessionStorage.getItem("lastViewedQuote");
  if (lastViewed) {
    const quote = JSON.parse(lastViewed);
    document.getElementById("quoteDisplay").innerText =
      `"${quote.text}" — ${quote.category}`;
  }
  
  populateCategories();
  fetchQuotesFromServer();
  startDataSync();
};

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";


async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));

    mergeQuotes(serverQuotes);
    console.log("Quotes synced from server:", serverQuotes);
  } catch (error) {
    console.error("Error fetching from server:", error);
  }
}
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      body: JSON.stringify(quote),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

    const data = await response.json();
    console.log("Quote posted to server:", data);
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}


function mergeQuotes(serverQuotes) {
  let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  let merged = [...localQuotes];

  serverQuotes.forEach(sq => {
    if (!localQuotes.some(lq => lq.text === sq.text)) {
      merged.push(sq);
    }
  });

  localStorage.setItem("quotes", JSON.stringify(merged));
  quotes = merged;
  populateCategories();
}
function startDataSync() {
  setInterval(async () => {
    console.log(" Syncing with server...");
    await syncWithServer();
  }, 30000); // 30 seconds
}
async function syncWithServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();
 const serverQuotes = serverData.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
     const isConflict = JSON.stringify(localQuotes) !== JSON.stringify(serverQuotes);

    if (isConflict) {
      
      document.getElementById("conflictNotification").style.display = "block";



    localStorage.setItem("quotes", JSON.stringify(serverQuotes));
    quotes = serverQuotes;

    populateCategories();
    console.log("Conflict detected. Server data overwrote local.");
    } else {
      console.log(" No conflicts. Data is in sync.");
    }
  } catch (error) {
    console.error(" Sync error:", error);
  }
}
function resolveConflictsManually() {
  const choice = confirm("Conflict detected! Click OK to keep LOCAL data, or Cancel to keep SERVER data.");

  if (choice) {
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    quotes = localQuotes;
    console.log(" User kept LOCAL quotes.");
  } else {
  
    fetchQuotesFromServer(); 
    console.log("User kept SERVER quotes.");
  }

  populateCategories();
  document.getElementById("conflictNotification").style.display = "none"; // hide notice
}













