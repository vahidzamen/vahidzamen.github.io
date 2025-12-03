/*
  c3.js
  Simple interactivity for C3 client project
  Author: Vahid Zamen
*/

// Run setup functions after the HTML has loaded
document.addEventListener("DOMContentLoaded", function () {
  updateYear();
  setupJoinForm();
  setupEventFilters();
  setupRandomGalleryPhoto();
});

/* ---------------- YEAR IN FOOTER ---------------- */

function updateYear() {
  var yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/* ---------------- JOIN FORM ---------------- */

function setupJoinForm() {
  var form = document.getElementById("join-form");
  if (!form) return; // Not on join page

  var messageBox = document.getElementById("message");
  var countBox = document.getElementById("char-count");
  var statusBox = document.getElementById("form-status");

  // Update character count as user types
  if (messageBox && countBox) {
    messageBox.addEventListener("input", function () {
      countBox.textContent = messageBox.value.length;
    });
  }

  // Handle submit
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = form.elements["name"].value.trim();
    var email = form.elements["email"].value.trim();
    var year = form.elements["year"].value.trim();

    if (!name || !email || !year) {
      if (statusBox) {
        statusBox.textContent = "Please fill out all required fields.";
        statusBox.className = "form-status form-status-error";
      }
      return;
    }

    // Show success message
    if (statusBox) {
      statusBox.textContent =
        "Thanks, " + name + "! We will contact you at " + email + ".";
      statusBox.className = "form-status form-status-success";
    }

    // Clear the form
    form.reset();
    if (countBox) countBox.textContent = "0";
  });
}

/* ---------------- EVENT FILTERS ---------------- */

function setupEventFilters() {
  var buttons = document.querySelectorAll(".filter-btn");
  var cards = document.querySelectorAll(".event-card");

  if (buttons.length === 0 || cards.length === 0) return; // Not on events page

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      buttons.forEach(function (b) {
        b.classList.remove("filter-active");
      });

      // Add active to clicked button
      btn.classList.add("filter-active");

      var filter = btn.getAttribute("data-filter");

      // Show/hide event cards
      cards.forEach(function (card) {
        var type = card.getAttribute("data-type");

        if (filter === "all" || filter === type) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/* ---------------- GALLERY RANDOM PHOTO ---------------- */

function setupRandomGalleryPhoto() {
  var button = document.getElementById("random-photo-btn");
  var img = document.getElementById("random-photo-image");
  var caption = document.getElementById("random-photo-caption");

  if (!button || !img || !caption) {
    return; // Not on gallery page
  }

  // Approved images (images folder is one level above c3/)
  var photos = [
    { src: "../images/what-cars.JPG", text: "Meet lineup on campus." },
    { src: "../images/who-community.jpg", text: "Club community at a meet." },
    { src: "../images/where-spot.jpg", text: "Our usual campus meet spot." },
    { src: "../images/when-sunrise.jpg", text: "A sunrise cruise moment." },
    { src: "../images/why-enjoy.jpg", text: "Enjoying car culture together." },
    { src: "../images/how-garage.jpg", text: "Garage time and car work." }
  ];

  button.addEventListener("click", function () {
    var index = Math.floor(Math.random() * photos.length);
    var photo = photos[index];

    img.src = photo.src;
    img.alt = photo.text;
    caption.textContent = photo.text;
  });
}