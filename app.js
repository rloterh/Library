class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
}

const Store = (() => {
  const getLibrary = () => {
    let library;
    if (localStorage.getItem('library') === null) {
      library = [];
    } else {
      library = JSON.parse(localStorage.getItem('library'));
    }
    return library;
  };

  const addBook = (book) => {
    const library = Store.getLibrary();
    library.push(book);
    localStorage.setItem('library', JSON.stringify(library));
  };
  const updateRead = (title) => {
    const library = Store.getLibrary();
    library.forEach((book, index) => {
      if (book.title === title) {
        const readSwitch = library[index].read === 'Read' ? 'Unread' : 'Read';
        library[index].read = readSwitch;
      }
    });
    localStorage.setItem('library', JSON.stringify(library));
  };

  const removeBook = (title) => {
    const library = Store.getLibrary();
    library.forEach((book, index) => {
      if (book.title === title) {
        library.splice(index, 1);
      }
    });
    localStorage.setItem('library', JSON.stringify(library));
  };

  return {
    getLibrary, addBook, updateRead, removeBook,
  };
})();

const UI = (() => {
  const displayLibrary = () => {
    const library = Store.getLibrary();
    library.forEach((book) => UI.addBookToLibrary(book));
  };

  const addBookToLibrary = (book) => {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');
    row.innerHTML = `
    <td style="vertical-align:middle;">${book.title}</td>
    <td style="vertical-align:middle;">${book.author}</td>
    <td style="vertical-align:middle;">${book.pages}</td>
    <td style="table-layout:fixed; width:200px;"><div class="read-toggle btn btn-secondary font-weight-bold">${book.read}</div></td>
    <td style="vertical-align:middle;"><a href="#" class="btn  btn-danger btn-sm delete">X</a></td>
    `;
    list.appendChild(row);
  };

  const deleteBook = (el) => {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  };

  const showAlert = (el, message, className) => {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    if (el.classList.contains('delete')) {
      const container = document.querySelector('.container');
      const table = document.querySelector('.table');
      container.insertBefore(div, table);
      setTimeout(() => document.querySelector('.alert').remove(), 3000);
    } else if (el.classList.contains('submit')) {
      const modalBody = document.querySelector('.modal-body');
      const form = document.querySelector('#book-form');
      modalBody.insertBefore(div, form);
      setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
  };

  const toggleRead = (readBtn) => {
    readBtn.textContent = readBtn.textContent === 'Read' ? 'Unread' : 'Read';
  };

  const clearFields = () => {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#pages').value = '';
    document.querySelector('#read').value = 'Have You Read It?';
  };

  return {
    displayLibrary, addBookToLibrary, deleteBook, showAlert, toggleRead, clearFields,
  };
})();

document.addEventListener('DOMContentLoaded', UI.displayLibrary());

document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const pages = document.querySelector('#pages').value;
  const read = document.querySelector('#read').value;
  if (title === '' || author === '' || pages === '' || read === 'Have You Read It?') {
    UI.showAlert(e.target.lastElementChild, 'Please Fill In All Fields.', 'danger');
  } else {
    const book = new Book(title, author, pages, read);
    UI.addBookToLibrary(book);
    Store.addBook(book);
    UI.showAlert(e.target.lastElementChild, 'Book Succesfully Added.', 'success');
    UI.clearFields();
  }
});

document.querySelector('#book-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    UI.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.parentElement.firstElementChild.textContent);
    UI.showAlert(e.target, 'Book Succesfully Removed.', 'success');
  } else if (e.target.classList.contains('read-toggle')) {
    UI.toggleRead(e.target);
    Store.updateRead(e.target.parentElement.parentElement.firstElementChild.textContent);
  }
});