let quoteDisplay, newQuoteBtn;

const quotes = [
  { text: 'The best way to predict the future is to invent it.', category: 'Inspiration' },
  { text: 'Life is what happens when you’re busy making other plans.', category: 'Life' },
  { text: 'Success is not final, failure is not fatal: it’s the courage to continue that counts.', category: 'Motivation' }
];


function showRandomQuote() {
  if (!quotes.length) {
    quoteDisplay.textContent = 'No quotes yet. Add one below!';
    return;
  }

  const index = Math.floor(Math.random() * quotes.length);
  const { text, category } = quotes[index];


  quoteDisplay.innerHTML = `
    <p>${text}</p>
    <small>Category: ${category}</small>
    `;
}

function createAddQuoteForm() {
  // Wrapper
  const wrapper = document.createElement('div');
  wrapper.id = 'addQuoteSection';

  const quoteInput = document.createElement('input');
  quoteInput.type = 'text' ;
  quoteInput.id = 'newQuoteText';
  quoteInput.placeholder = 'Enter a new quote';


  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';
  
  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.textContent = 'Add Quote';
  wrapper.appendChild(quoteInput);
  wrapper.appendChild(categoryInput);
  wrapper.appendChild(addBtn);


   addBtn.addEventListener('click', () => {
    const text = quoteInput.value.trim();
    const category = (categoryInput.value || 'General').trim();

    if (!text) {
      alert('Please enter a quote.');
      quoteInput.focus();
      return;
    }

    quotes.push({ text, category });
     quoteInput.value = '';
    categoryInput.value = '';
    quoteDisplay.innerHTML = `<p> Quote added!</p><small>Category: ${category}</small>`;
  });
}
document.addEventListener('DOMContentLoaded', () => {
  quoteDisplay = document.getElementById('quoteDisplay');
  newQuoteBtn = document.getElementById('newQuote');

  newQuoteBtn.addEventListener('click', showRandomQuote);
  createAddQuoteForm();
});


