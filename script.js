document.addEventListener("DOMContentLoaded", function () {
  console.log(
    "ID" + Math.floor(Math.random() * 1000000 * 100000000).toString()
  );
  console.log(Math.floor(Math.random() * 1000000 * 100000));

  //What this is doing is taking the entire document , which is the whole HTML page we are working on, and listens for the event of 'DOMContentLoaded' which is basically when the entire DOM has finished loading in. Once that event is heard, it then runs whatever code we put inside the curly brackets
  const bookContainer = document.querySelector("#book-container");
  const bookURL = `http://localhost:3000/books`;

  fetch(`${bookURL}`)
    .then((response) => response.json())
    .then((bookData) =>
      bookData.forEach(function (book) {
        allBooks = bookData;
        bookContainer.innerHTML += `
      <div id=${book.id}>
        <h2>${book.title}</h2>
        <h4>Author: ${book.author}</h4>
        <img src="${book.coverImage}" width="333" height="500">
        <p>${book.description}</p>
        <button data-id="${book.id}" id="edit-${book.id}" data-action="edit">Edit</button>
        <button data-id="${book.id}" id="delete-${book.id}" data-action="delete">Delete</button>
      </div>`;
      })
    ); // end of book fetch

  const bookForm = document.querySelector("#book-form");
  let allBooks = [];

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(e.target);
    const titleInput = bookForm.querySelector("#title").value;
    const authorInput = bookForm.querySelector("#author").value;
    const coverImageInput = bookForm.querySelector("#coverImage").value;
    const descInput = bookForm.querySelector("#description").value;

    fetch(`${bookURL}`, {
      method: "POST",
      body: JSON.stringify({
        title: titleInput,
        author: authorInput,
        coverImage: coverImageInput,
        description: descInput,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((book) => {
        bookContainer.innerHTML += `
        <div id=${book.id}>
          <h2>${book.title}</h2>
          <h4>Author: ${book.author}</h4>
          <img src="${book.coverImage}" width="333" height="500">
          <p>${book.description}</p>
          <button data-id="${book.id}" id="edit-${book.id}" data-action="edit">Edit</button>
          <button data-id="${book.id}" id="delete-${book.id}" data-action="delete">Delete</button>
        </div>`;
      });
  });

  bookContainer.addEventListener("click", (e) => {
    if (e.target.dataset.action === "edit") {
      console.log("you pressed edit");
      const editButton = document.querySelector(`#edit-${e.target.dataset.id}`);
      editButton.disabled = true;
      const bookData = allBooks.find((book) => {
        return book.id == e.target.dataset.id;
      });
      e.target.parentElement.innerHTML += `
      <div id='edit-form'>
        <form id="book-form">
          <input  id="edit-title" placeholder="${bookData.title}">
          <input  id="edit-author" placeholder="${bookData.author}">
          <input  id="edit-coverImage" placeholder="${bookData.coverImage}">
          <input  id="edit-description" placeholder="${bookData.description}">
          <input type="submit"  value="Edit Book">
      </div>`;
      console.log(bookData);
      const editForm = document.querySelector("#edit-form");
      editForm.addEventListener("submit", (e) => {
        event.preventDefault();
        const titleInput = document.querySelector("#edit-title").value;
        const authorInput = document.querySelector("#edit-author").value;
        const coverImageInput = document.querySelector("#edit-coverImage")
          .value;
        const descInput = document.querySelector("#edit-description").value;
        const editedBook = document.querySelector(`#book-${bookData.id}`);
        fetch(`${bookURL}/${bookData.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            title: titleInput,
            author: authorInput,
            coverImage: coverImageInput,
            description: descInput,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((book) => {
            editedBook.innerHTML = `
            <div id=book-${book.id}>
              <h2>${book.title}</h2>
              <h4>Author: ${book.author}</h4>
              <img src="${book.coverImage}" width="333" height="500">
              <p>${book.description}</p>
              <button data-id=${book.id} id="edit-${book.id}" data-action="edit">Edit</button>
              <button data-id=${book.id} id="delete-${book.id}" data-action="delete">Delete</button>
            </div>
            <div id=edit-book-${book.id}>
            </div>`;
            editForm.innerHTML = "";
          });
      }); // end of this event Listener for edit submit
    } else if (e.target.dataset.action === "delete") {
      console.log("you pressed delete");
      document.querySelector(`#book-${e.target.dataset.id}`).remove();
      fetch(`${bookURL}/${e.target.dataset.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => response.json());
    }
  }); // end of eventListener for editing and deleting a book
  console.log(jsonReader("./books.json"));
});
