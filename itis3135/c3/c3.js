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

/* ---------------- JOIN FORM INTERACTION ---------------- */

function setupJoinForm() {
  var form = document.getElementById("join-form");
  if (!form) {
    return; // Not on the join page
  }

  var nameInput = document.getElementById("name");
  var emailInput = document.getElementById("email");
  var messageInput = document.getElementById("message");
  var counterSpan = document.getElementById("message-counter");
  var statusBox = document.getElementById("form-status");

  // Live character counter for the textarea
  if (messageInput && counterSpan) {
    counterSpan.textContent = "0";

    messageInput.addEventListener("input", function () {
      var count = messageInput.value.length;
      counterSpan.textContent = String(count);
    });
  }

  // Handle form submit
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop actual submit (demo only)

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();

    // Basic check for required fields
    if (name === "" || email === "") {
      if (statusBox) {
        statusBox.textContent = "Please enter both your name and email.";
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
    if (counterSpan) {
      counterSpan.textContent = "0";
    }
  });
}

/* ---------------- EVENTS FILTER BUTTONS ---------------- */

function setupEventFilters() {
  var filterContainer = document.getElementById("event-filter");
  if (!filterContainer) {
    return; // Not on the events page
  }

  var buttons = filterContainer.querySelectorAll("button[data-filter]");
  var cards = document.querySelectorAll("[data-event-type]");

  if (buttons.length === 0 || cards.length === 0) {
    return;
  }

  // Attach click handler to each filter button
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      var filter = this.getAttribute("data-filter");

      // Highlight active button
      for (var j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove("filter-active");
      }
      this.classList.add("filter-active");

      // Show/hide event cards
      for (var k = 0; k < cards.length; k++) {
        var type = cards[k].getAttribute("data-event-type");

        if (filter === "all" || filter === type) {
          cards[k].style.display = "";
        } else {
          cards[k].style.display = "none";
        }
      }
    });
  }
}

/* ---------------- GALLERY RANDOM PHOTO ---------------- */

function setupRandomGalleryPhoto() {
  var button = document.getElementById("random-photo-btn");
  var img = document.getElementById("random-photo-image");
  var caption = document.getElementById("random-photo-caption");

  if (!button || !img || !caption) {
    return; // Not on gallery page
  }

  // Only using approved images from the images folder (one level up)
  var photos = [
    {
      src: "../images/when-sunrise.jpg",
      text: "Early morning lineup before a campus cruise."
    },
    {
      src: "../images/where-spot.jpg",
      text: "Our go-to rooftop photo spot."
    },
    {
      src: "../images/who-community.jpg",
      text: "C3 members hanging out after a campus meet."
    },
    {
      src: "../images/how-garage.jpg",
      text: "Learning basic maintenance at Garage Day."
    },
    {
      src: "../images/why-enjoy.jpg",
      text: "Because driving should be fun."
    },
    {
      src: "../images/what-cars.JPG",
      text: "Lineup of cars at a campus meet."
    }
  ];

  button.addEventListener("click", function () {
    var index = Math.floor(Math.random() * photos.length);
    var photo = photos[index];

    img.src = photo.src;
    img.alt = photo.text;
    caption.textContent = photo.text;
  });
}