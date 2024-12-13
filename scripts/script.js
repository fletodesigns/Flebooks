// Targeting necessary elements
const downloadNowBtn = document.getElementById("downloadNowIframe"); // Target the iframe
const downloadNowPage = document.getElementById("downloadNowPage");

// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";

// Firebase config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpNiBfj1WPVputBiSLBsdOnm0MFLjVYlE",
  authDomain: "flebooks.firebaseapp.com",
  projectId: "flebooks",
  storageBucket: "flebooks.firebasestorage.app",
  messagingSenderId: "458785971847",
  appId: "1:458785971847:web:ed6138c7df952c9f3d6222",
  measurementId: "G-XMD1VDPZGT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const booksCollection = collection(db, "Books");

// Function to create a book card dynamically
function createBookCard(book) {
  return `
    <div class="book-card">
      <div class="cover">
        <img src="${book.imgSrc}" alt="Book Cover" />
      </div>
      <div class="details">
        <h5>${book.bookNo}</h5>
        <h2>${book.title}</h2>
        <h3>${book.authorName}</h3>
        <h4>${book.language}</h4>
        <h6>${book.subtitle}</h6>
      </div>
      <div class="actions">
        <a href="${book.fileLink}" target="_blank">
            <button class="read-now-btn">
                <i class="fa-solid fa-book"></i> Read now
            </button>
        </a>
        <button class="download-btn" data-download-link="${book.fileLink}">
            <i class="fa-solid fa-download"></i>
        </button>
      </div>
    </div>
  `;
}

// Function to display books from Firestore
async function displayBooks(book) {
  const booksContainer = document.getElementById("booksContainer");

  try {
    const snapshot = await getDocs(booksCollection);

    snapshot.forEach((doc) => {
      const bookData = doc.data();
      const bookCard = createBookCard(bookData);
      booksContainer.innerHTML += bookCard; // Append card to container
    });

    // Add click event listeners to all read-now buttons after they are rendered
    const downloadButton = document.querySelectorAll(".download-btn");
    downloadButton.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const downloadNowLink = document.getElementById("downloadNowLink");
        const downloadLink = e.currentTarget.getAttribute("data-download-link");

        // Show the downloadNowPage
        if (downloadNowPage) {
          downloadNowPage.style.display = "flex"; // Change the display to flex
        }

        // Set the iframe src to the book's downloadLink
        if (downloadNowLink) {
          downloadNowLink.href = downloadLink;
        }
      });
    });
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Ensure DOM is ready before calling displayBooks
document.addEventListener("DOMContentLoaded", displayBooks);

// Search functionality
function searchBooks() {
  const query = document.getElementById("searchBar").value.toLowerCase();
  const bookCards = document.querySelectorAll(".book-card");

  bookCards.forEach((card) => {
    const title = card.querySelector("h2").textContent.toLowerCase();
    const subtitle = card.querySelector("h6").textContent.toLowerCase();
    const authorName = card.querySelector("h3").textContent.toLowerCase();
    const language = card.querySelector("h4").textContent.toLowerCase();
    const bookNo = card.querySelector("h5").textContent.toLowerCase();

    if (
      title.includes(query) ||
      subtitle.includes(query) ||
      bookNo.includes(query) ||
      authorName.includes(query) ||
      language.includes(query)
    ) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// Connect search functionality to search bar
document.getElementById("searchBar").addEventListener("keyup", searchBooks);

// Close the "read now" page when the close button is clicked
const readCloseButton = document.getElementById("readCloseBtn");
if (readCloseButton) {
  readCloseButton.addEventListener("click", () => {
    // Hide the downloadNowPage when the close button is clicked
    if (downloadNowPage) {
      downloadNowPage.style.display = "none";
      downloadNowIframe.src = ""; // Reset iframe src to prevent showing previous book
    }
  });
}
