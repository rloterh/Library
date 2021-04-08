class Book {
  constructor(title, author, pages, read ) {
    this.title = title;
    this.author = author;
    this.pages = pages
    this.read = read;
  }
}

class UI {
  static displayLibrary() {
    const library = Store.getLibrary();
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
  static showAlert(el, message, className) {
    const div  = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    // if (el.classList.contains('delete')) {
      const container =  document.querySelector('.container');
      const table =  document.querySelector('.table');
      container.insertBefore(div, table);
      setTimeout(( )=> document.querySelector('.alert').remove(), 3000);
    } 
    // else if (el.classList.contains('submit')) { 
    //   const modalBody = document.querySelector('.modal-body');
    //   const form = document.querySelector('#book-form');
    //   modalBody.insertBefore(div, form);
    //   setTimeout(( )=> document.querySelector('.alert').remove(), 3000);
    // }

  static toggleRead(readBtn) {
    readBtn.textContent = readBtn.textContent === 'Read' ? 'Unread' : 'Read';
  }
  static clearFields(){
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#pages').value = '';
    document.querySelector('#read').value = 'Have You Read It?';
  }
}

class Store {
  static getLibrary (){
    let library;
    if(localStorage.getItem('library') === null) {
      library = [];
    } else {
      library = JSON.parse(localStorage.getItem('library'));
    }
    return library;
  }
  static addBook(book) {
    const library = Store.getLibrary();
    library.push(book);
    localStorage.setItem('library', JSON.stringify(library));
  }
  static updateRead(title) {
    const library = Store.getLibrary();
    library.forEach((book, index) => {
      if(book.title === title){
        const readSwitch = library[index].read === 'Read' ? 'Unread' : 'Read';
        library[index].read = readSwitch;
      }
    });
    localStorage.setItem('library', JSON.stringify(library));
  }
  static removeBook(title) {
    const library = Store.getLibrary();
    library.forEach((book, index) => {
      if(book.title === title){
        library.splice(index, 1);
      }
    });
    localStorage.setItem('library', JSON.stringify(library));
  }
}

document.addEventListener('DOMContentLoaded', UI.displayLibrary);

document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const pages = document.querySelector('#pages').value;
  const read = document.querySelector('#read').value;
  if (title === '' || author === '' || pages === '' || read === 'Have You Read It?') {
    UI.showAlert('please fill in all fields', 'danger');
  } else {
    const book = new Book(title, author, pages, read);
    UI.addBookToLibrary(book);
    Store.addBook(book);
    UI.showAlert('Book Added', 'success');
    UI.clearFields();
  }
});

document.querySelector('#book-list').addEventListener('click',(e) =>{
  if (e.target.classList.contains('delete')) {
    UI.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.parentElement.firstElementChild.textContent);
    UI.showAlert('Book Removed', 'success');
  } else if (e.target.classList.contains('read-toggle')) {
    UI.toggleRead(e.target);
    Store.updateRead(e.target.parentElement.parentElement.firstElementChild.textContent);
  }
});