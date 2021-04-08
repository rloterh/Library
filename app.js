class Book {
  constructor(title, author, pages, read ) {
    this.title = title;
    this.author = author;
    this.pages = pages
    this.read = read;
  }
}
// UI Class: Handle UI Tasks/features
class UI {
  static displayLibrary() {
    const library; // Get library content from localStorage
    library.forEach((book) => UI.addBookToLibrary(book));
  }
  static addBookToLibrary(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');
    row.innerHTML =`
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.pages}</td>
      <td><div class="read-toggle btn btn-info">${book.read}</div></td>
      <td><a href="#" class="btn  btn-danger btn-sm delete">X</a></td>
    `;
    list.appendChild(row);
  }
  static deleteBook(el) {
    if(el.classList.contains('delete')){
      el.parentElement.parentElement.remove();
    }
  }
  static toggleRead(readBtn) {
    readBtn.textContent = readBtn.textContent === 'Read' ? 'Unread' : 'Read';
  }
}

class Store {
  static addBook(book) {
    const library = Store.getLibrary();
    library.push(book);
    localStorage.setItem('library', JSON.stringify(library));
  }
}



// Event: Display books list
document.addEventListener('DOMContentLoaded', UI.displayLibrary);
// Add new book
document.querySelector('#book-form').addEventListener('click', (e) => {
  //Prevent actual submit
  e.preventDefault();
  //Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const pages = document.querySelector('#pages').value;
  const read = document.querySelector('#read').value;
  //Validate
  if(title === '' || author === '' || pages === '' || read === 'Have you read it?'){
    UI.showAlert('please fill in all fields', 'danger');
  } else {
    // Instatiate book
    const book = new Book(title, author, pages, read);
    //Add Book to UI
    UI.addBookToLibrary(book);
    //Clear Fileds
    UI.clearFields();
  }
});