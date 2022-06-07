//variables.

const bookContainer = document.querySelector(".book-container");
const mainContainer = document.querySelector(".main-container");
const addBookBtn = document.querySelector(".add-book-btn");
const closeModalBtn = document.querySelector(".close-modal-btn");
const modal = document.querySelector(".modal");
const addCollectionBtn = document.querySelector(".add-collection-btn");
const collectionContainer = document.querySelector(".collection-list");
const collectionForm = document.querySelector(".collection-form");
const collectionNav = document.querySelector(".collection-container");
const collectionInput = document.querySelector(".collection-input");
const bookForm = document.querySelector("#book-form");
const navToggle = document.querySelector(".nav-toggle");
const bookInput = document.querySelector("#title");

const LOCAL_STORAGE_LIST_KEY = "book.library";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "book.selectedCollectionId";
let library = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [
  { id: "1", name: "My Collection", books: [] },
];
let selectedCollectionId =
  localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY) || "1";
// let library = [{ id: "1", name: "My Collection", books: [] }];
// let selectedCollectionId = "1";

const createCollection = (Name) => {
  return { id: Date.now().toString(), name: Name, books: [] };
};
const createBook = (Title, Author, Pages, Read) => {
  return {
    id: Date.now().toString(),
    title: Title,
    author: Author,
    pages: Pages,
    read: Read,
  };
};

// BUTTONS

navToggle.addEventListener("click", () => {
  const visibility = collectionNav.getAttribute("data-visible");
  if (visibility === "false") {
    collectionNav.setAttribute("data-visible", "true");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.textContent = "close";
    window.addEventListener(
      "click",
      (e) => {
        if (e.target != navToggle && e.target != collectionInput) {
          collectionNav.setAttribute("data-visible", "false");
          navToggle.setAttribute("aria-expanded", "false");
          navToggle.textContent = "menu";
        }
      },
      true
    );
  }
  if (visibility === "true") {
    collectionNav.setAttribute("data-visible", "false");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.textContent = "menu";
  }
});

addBookBtn.addEventListener("click", () => {
  modal.classList.add("modal--active");
  bookInput.focus();
});
closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("modal--active");
});
document.addEventListener(
  "keydown",
  (e) => {
    if (e.key === "Escape") {
      modal.classList.remove("modal--active");
    }
  },
  true
);
window.addEventListener("click", (e) => {
  if (e.target == modal) {
    modal.classList.remove("modal--active");
  }
});

//get user input and create new collection.

collectionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  collectionName = document.querySelector(".collection-input").value;
  const collection = createCollection(collectionName);
  selectedCollectionId = collection.id;

  library.push(collection);
  document.forms[0].reset();
  saveAndRender();
});

//get user inputs, create book and append to collection.

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;
  const read = document.getElementById("read").checked;

  const checkAuthor = () => {
    if (author === "") {
      return "Unknown Author";
    } else return author;
  };
  const checkPages = () => {
    if (pages === "") {
      return "Unknown";
    } else return pages;
  };

  const newBook = createBook(title, checkAuthor(), checkPages(), read);
  addBook(newBook);

  document.forms[1].reset();
  saveAndRender();
});

//setting selected collection.

collectionContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedCollectionId = e.target.dataset.id;
    saveAndRender();
  }
  if (e.target.tagName.toLowerCase() === "span") {
    let toRemove = e.target.parentNode.dataset;
    // selectedCollectionId = collectionContainer.firstElementChild.dataset.id;
    selectedCollectionId = null;
    removeCollection(toRemove);
    saveAndRender();
  }
});

//user interface.

function createBookCards(book) {
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

  readBtn.dataset.id = book.id;
  deleteBtn.dataset.id = book.id;

  if (book.read === true) {
    readBtn.textContent = "Read";
    readBtn.classList.add("read-btn--read");
  }
  if (book.read === false) {
    readBtn.textContent = "Unread";
    readBtn.classList.add("read-btn--unread");
  }

  title.textContent = `"${book.title}"`;
  author.textContent = book.author;
  pages.textContent = `${book.pages} Pages`;
  deleteBtn.textContent = "Remove";

  content.appendChild(title);
  content.appendChild(author);
  content.appendChild(pages);
  cardBtn.appendChild(readBtn);
  cardBtn.appendChild(deleteBtn);
  bookCard.appendChild(content);
  bookCard.appendChild(cardBtn);
  bookContainer.appendChild(bookCard);

  readBtn.addEventListener(
    "click",
    (e) => {
      let book = selectedBook(e.target.dataset.id);
      changeStatus(book);
      saveAndRender();
    },
    true
  );
  deleteBtn.addEventListener("click", (e) => {
    let toRemove = selectedBook(e.target.dataset.id);
    removeBook(toRemove);
    saveAndRender();
  });
}

function createCollectionCards(collection) {
  const collectionCard = document.createElement("li");
  const removeCollectionBtn = document.createElement("button");
  collectionCard.classList.add("collection-card");
  collectionCard.textContent = collection.name;
  collectionCard.dataset.id = collection.id;
  removeCollectionBtn.innerHTML = `<span class="material-icons del-collection-btn"> delete </span>`;
  removeCollectionBtn.dataset.id = collection.id;
  if (collection.id === selectedCollectionId) {
    collectionCard.classList.add("collection--selected");
  }
  collectionCard.appendChild(removeCollectionBtn);
  collectionContainer.appendChild(collectionCard);
}

//render stuff.

function saveAndRender() {
  save();
  renderCollections();
  renderBooks();
}

function renderCollections() {
  resetElements(collectionContainer);
  for (let collection of library) {
    createCollectionCards(collection);
  }
}

function renderBooks() {
  resetElements(bookContainer);
  if (selectedCollectionId == null) {
    mainContainer.style.display = "none";
  } else {
    mainContainer.style.display = "";
  }
  for (let book of selectedCollection().books) {
    createBookCards(book);
  }
}

function resetElements(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

//storage stuff.

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(library));
  localStorage.setItem(
    LOCAL_STORAGE_SELECTED_LIST_ID_KEY,
    selectedCollectionId
  );
}

//other stuff

function firstLetterToUpper(string) {}

function selectedCollection() {
  return library.find((collection) => collection.id === selectedCollectionId);
}

function selectedBook(id) {
  return selectedCollection().books.find((book) => book.id === id);
}

function changeStatus(book) {
  if (book.read === true) {
    book.read = false;
  } else if (book.read === false) {
    book.read = true;
  }
}
function addBook(newBook) {
  if (!isInCollection(newBook)) {
    selectedCollection().books.push(newBook);
  }
}
function removeBook(toRemove) {
  selectedCollection().books = selectedCollection().books.filter(
    (book) => book.id !== toRemove.id
  );
}
function removeCollection(toRemove) {
  library = library.filter((collection) => collection.id !== toRemove.id);
}

function isInCollection(newBook) {
  return selectedCollection().books.some(
    (book) => book.title === newBook.title && book.author === newBook.author
  );
}

saveAndRender();
