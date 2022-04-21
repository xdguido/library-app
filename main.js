class Library {
  constructor() {
    this.books = [];
  }
  addBook(newBook) {
    if (!this.isInLibrary(newBook)) {
      this.books.push(newBook);
    }
  }
  removeBook(Title) {
    this.books = this.books.filter((book) => book.title !== Title);
  }
  isInLibrary(newBook) {
    return this.books.some(
      (book) => book.title === newBook.title && book.author === newBook.author
    );
  }
}
class Book {
  constructor(Title, Author = "Unknown", Pages = "-", Read = "false") {
    this.title = Title;
    this.author = Author;
    this.pages = Pages;
    this.read = Read;
  }
}

const my_library = new Library();

//get user inputs, create object and append to library.

document.getElementById("book_form").addEventListener("submit", (e) => {
  e.preventDefault();

  Title = document.getElementById("title").value;
  Author = document.getElementById("author").value;
  Pages = document.getElementById("pages").value;
  Read = document.getElementById("read").checked;
  const newBook = new Book(Title, Author, Pages, Read);

  my_library.addBook(newBook);
  document.forms[0].reset();
  updateBookCards();

  console.log(newBook);
  console.log(my_library);
});

//user interface.

const container = document.querySelector(".card-container");
const addBtn = document.querySelector("#add-btn");
const closeBtn = document.querySelector("#close-btn");
const modal = document.querySelector(".modal");

addBtn.addEventListener("click", () => {
  modal.classList.add("modal--active");
});
closeBtn.addEventListener("click", () => {
  modal.classList.remove("modal--active");
});

function createBookCard(book) {
  const bookCard = document.createElement("div");
  const content = document.createElement("div");
  const title = document.createElement("div");
  const author = document.createElement("div");
  const pages = document.createElement("div");
  const cardBtn = document.createElement("div");
  const deleteBtn = document.createElement("button");
  const readBtn = document.createElement("button");

  bookCard.classList.add("book-card");
  deleteBtn.classList.add("delete-btn");
  content.classList.add("card-content");
  cardBtn.classList.add("card-btn");

  title.textContent = `"${book.title}"`;
  author.textContent = book.author;
  pages.textContent = `${book.pages} pages`;
  deleteBtn.textContent = "remove";
  readBtn.textContent = "READ";

  content.appendChild(title);
  content.appendChild(author);
  content.appendChild(pages);
  cardBtn.appendChild(readBtn);
  cardBtn.appendChild(deleteBtn);
  bookCard.appendChild(content);
  bookCard.appendChild(cardBtn);
  container.appendChild(bookCard);
}

function resetCards() {
  container.innerHTML = "";
}

function updateBookCards() {
  resetCards();
  for (let book of my_library.books) {
    createBookCard(book);
  }
}
