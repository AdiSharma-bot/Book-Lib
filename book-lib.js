// HTML references

const bookButton = document.querySelector(".book-button");
const bookForm = document.querySelector("fieldset");
const addButton = document.querySelector(".add");
const cancelButton = document.querySelector(".remove");
const mainBody = document.querySelector("main");
const bookContainer = document.querySelector(".book-container");

class Book {
  static books = [];

  constructor(title, author, pages, readingStatus) {
    this.id = `Book-${Date.now()}`;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readingStatus = readingStatus;

    Book.books.push(this); // 📚 Add this book to the private collection
  }

  static formData = {
    title: document.querySelector("#title"),
    author: document.querySelector("#author"),
    pages: document.querySelector("#pages"),
    readingStatus: document.querySelector("select"),
  };

  static addBook() {
    const titleValue = this.formData.title.value;
    const authorValue = this.formData.author.value;
    const pagesValue = this.formData.pages.value;
    const readingStatusValue = this.formData.readingStatus;
    const selectedStatus = this.statusValue(readingStatusValue);

    if (
      titleValue.trim() === "" ||
      authorValue.trim() === "" ||
      pagesValue.trim() === ""
    ) {
      alert("Dude! Fill out the required details");
      return;
    }
    const newBook = new Book(
      titleValue,
      authorValue,
      pagesValue,
      selectedStatus
    );
    this.displayBooks();
    this.resetForm(); // to reset the form when the data was submitted
    // I added  these basic styles in this function
    bookForm.classList.remove("show");
  }

  static displayBooks() {
    bookContainer.innerHTML = "";
    Book.books.forEach((book) => {
      this.createBookCard(book);
    });
  }

  static statusValue(button) {
    const status = button.value;

    switch (status) {
      case "1":
        return "Read-it";
      case "2":
        return "Unread-It";
      case "3":
        return "Reading-It";
    }
  }

  static resetForm = () => {
    setTimeout(() => {
      bookForm.classList.remove("show");
    }, 10)
    this.formData.title.value = "";
    this.formData.author.value = "";
    this.formData.pages.value = "";
    this.formData.readingStatus.selectedIndex = 0;
  }
  static showForm() {
    if (bookForm.classList.contains("show")) {
      setTimeout(() => {
        bookForm.classList.remove("show");
      }, 100);
    } else {
      setTimeout(() => {
        bookForm.classList.add("show");
      }, 200);
    }
  }
  static adjustFontSize(element) {
    const maxLength = 20;
    const baseFontSize = 1.8;
    const minFontSize = 1.4;

    const textLength = element.textContent.length;
    const fontSize = textLength > maxLength ? minFontSize : baseFontSize;
    element.style.fontSize = `${fontSize}rem`;
  }
  static createBookCard(book) {
    const markdown = document.createElement("article");
    const cardDiv = document.createElement("div");
    markdown.setAttribute("id", book.id);
    cardDiv.classList.add("content");
    markdown.classList.add("book-card");
    cardDiv.innerHTML = `
        <p class="card-info">Book Info.</p>
        <p class="card-title">${book.title}</p>
        <p class="card-author"><span>By</span> ${book.author}</p>
        <p class="card-pages">${book.pages} pages</p>
      `;
    const titleElement = cardDiv.querySelector(".card-title");
    this.truncatedFromStart(titleElement, 23);
    // to display a text when hovered over the title element in the card if the text is too long
    titleElement.setAttribute("data-fulltext", book.title);
    titleElement.style.display = "none";
    void titleElement.offsetHeight;
    titleElement.style.display = "";

    this.adjustFontSize(titleElement);
    markdown.appendChild(cardDiv);
    bookContainer.prepend(markdown);

    createCardButtons(markdown, book);

    // to create the buttons 'Read-It' and 'Remove-It' button at the end of the card
    function createCardButtons(markdown, book) {
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("card-buttons");
      cardDiv.appendChild(buttonContainer);
      const readButton = document.createElement("button");
      readButton.classList.add("status", "ripple-button");
      readButton.textContent = book.readingStatus;
      buttonContainer.appendChild(readButton);
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("remove-it", "ripple-button");
      deleteButton.textContent = "Remove-It";
      buttonContainer.appendChild(deleteButton);

      readButton.addEventListener("click", () => {
        const currentStatus = readButton.textContent;
        if (currentStatus === "Read-It") {
          readButton.textContent = "Unread-It";
        } else if (currentStatus === "Unread-It") {
          readButton.textContent = "Reading-It";
        } else {
          readButton.textContent = "Read-It";
        }
        book.readingStatus = readButton.textContent;
      });
      deleteButton.addEventListener("click", () => {
        setTimeout(() => {
          if (confirm("Are you sure you want to 'delete-It'?")) {
            // first confirms if the user wants to delete the card
            const index = Book.books.indexOf(book); // finds the index of the book in books array
            if (index !== -1) {
              Book.books.splice(index, 1); // this here removes it
              markdown.remove(); // this here removes it element
            }
          }
        }, 200);
      });
      Book.createRippleEffect();
    }
  }
  static createRippleEffect() {
    document.querySelectorAll(".ripple-button").forEach((button) => {
      button.addEventListener("click", function (event) {
        const ripple = document.createElement("span");
        ripple.classList.add("ripple");

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });
  }
  static truncatedFromStart(element, maxLength) {
    if (element.textContent.length > maxLength) {
      const fullText = element.textContent;
      if (fullText.length > maxLength) {
        const truncatedText = fullText.slice(0, maxLength) + "..."; // slices the text and add ellipses at the end
        element.textContent = truncatedText;
      }
    }
  }
}

Book.formData.pages.addEventListener("input", () => {
  let pageNumbers = Book.formData.pages.value;
  if (pageNumbers.length >= 4 || parseInt(pageNumbers) > 9999) {
    Book.formData.pages.value = Math.min(parseInt(pageNumbers), 9999) // Return minimum out of these numbers
      .toString() // Convert it to string
      .slice(0, 4); // Return four digits only
  }
});

addButton.addEventListener("click", (e) => {
  setTimeout(() => {
    Book.addBook();
  }, 300);
  e.preventDefault(); // to prevent the default behavior for the add button i.e. was it reloaded the whole page
});


bookButton.addEventListener("click", (e) => {
  e.stopPropagation();
  Book.showForm();
});

cancelButton.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation(); // it conflicted with book form button with assigning classes
  
  setTimeout(() => {
    Book.resetForm()
  }, 300);

});

