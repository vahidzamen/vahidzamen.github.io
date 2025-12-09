// scripts/intro_viewer.js
// Viewer for the "Pull Introduction from JSON" assignment with
// search, field filters, counter, and slideshow.

(function () {
    // ====== CONFIG: update this path to your JSON file ======
    // Expecting an ARRAY of objects shaped like generate_json.js creates.
    // Example: [ { firstName: "...", lastName: "...", ... }, { ... } ]
    var JSON_URL = "data/introductions.json"; // <-- change if needed
  
    // ====== Grab DOM elements ======
    var searchInput = document.getElementById("search-name");
    var resultsCount = document.getElementById("results-count");
    var slidePosition = document.getElementById("slide-position");
    var introCard = document.getElementById("intro-card");
    var prevBtn = document.getElementById("prev-intro");
    var nextBtn = document.getElementById("next-intro");
    var filterCheckboxes = document.querySelectorAll("[data-section]");
  
    if (
      !searchInput ||
      !resultsCount ||
      !slidePosition ||
      !introCard ||
      !prevBtn ||
      !nextBtn
    ) {
      return; // safety
    }
  
    // ====== Helpers (define BEFORE use so linter is happy) ======
    function escapeHTML(str) {
      return String(str || "").replace(/[&<>"']/g, function (s) {
        var map = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        };
        return map[s] || s;
      });
    }
  
    function escapeAttr(str) {
      // also escape double-quotes for attribute context
      return escapeHTML(str).replace(/"/g, "&quot;");
    }
  
    // ====== State ======
    var allStudents = []; // full array from JSON
    var filteredStudents = []; // after search filter
    var currentIndex = 0;
  
    function getActiveFilters() {
      var active = {};
      filterCheckboxes.forEach(function (cb) {
        active[cb.getAttribute("data-section")] = cb.checked;
      });
      return active;
    }
  
    // ====== Rendering ======
    function renderCurrent() {
      var total = filteredStudents.length;
  
      // Update counter and slide text
      resultsCount.textContent = String(total);
      slidePosition.textContent =
        total === 0 ? "0 of 0" : currentIndex + 1 + " of " + total;
  
      // Disable buttons if no or single result
      prevBtn.disabled = total <= 1;
      nextBtn.disabled = total <= 1;
  
      if (total === 0) {
        introCard.innerHTML =
          '<p class="small-note">No introductions match that search.</p>';
        return;
      }
  
      var s = filteredStudents[currentIndex];
      var filters = getActiveFilters();
  
      // Build sections conditionally
      var parts = [];
  
      // Name
      if (filters.name) {
        var displayName = s.preferredName || s.firstName || "";
        var middle = s.middleInitial ? " " + s.middleInitial + "." : "";
        var last = s.lastName ? " " + s.lastName : "";
        parts.push(
          '<header class="intro-header">' +
            "<h3>" +
            escapeHTML(displayName + middle + last) +
            "</h3>" +
            (filters.mascot
              ? '<p class="muted">' +
                escapeHTML(
                  (s.mascotAdjective || "") + " " + (s.mascotAnimal || "")
                ) +
                "</p>"
              : "") +
          "</header>"
        );
      } else if (filters.mascot) {
        // Mascot only
        parts.push(
          '<header class="intro-header">' +
            '<p class="muted">' +
            escapeHTML(
              (s.mascotAdjective || "") + " " + (s.mascotAnimal || "")
            ) +
            "</p>" +
          "</header>"
        );
      }
  
      // Image
      if (filters.image && s.image) {
        parts.push(
          "<figure>" +
            '<img src="' +
            escapeAttr(s.image) +
            '" alt="' +
            escapeAttr(s.imageCaption || "Student introduction image") +
            '" />' +
            (s.imageCaption
              ? "<figcaption>" + escapeHTML(s.imageCaption) + "</figcaption>"
              : "") +
          "</figure>"
        );
      }
  
      // Personal statement
      if (filters.personalStatement && s.personalStatement) {
        parts.push(
          '<section class="intro-section">' +
            "<h4>Personal Statement</h4>" +
            "<p>" +
            escapeHTML(s.personalStatement) +
            "</p>" +
          "</section>"
        );
      }
  
      // Backgrounds block: personal, professional, academic, subject
      if (
        filters.backgrounds &&
        (s.personalBackground ||
          s.professionalBackground ||
          s.academicBackground ||
          s.subjectBackground)
      ) {
        parts.push('<section class="intro-section"><h4>Backgrounds</h4><ul>');
        if (s.personalBackground) {
          parts.push(
            "<li><strong>Personal:</strong> " +
              escapeHTML(s.personalBackground) +
            "</li>"
          );
        }
        if (s.professionalBackground) {
          parts.push(
            "<li><strong>Professional:</strong> " +
              escapeHTML(s.professionalBackground) +
            "</li>"
          );
        }
        if (s.academicBackground) {
          parts.push(
            "<li><strong>Academic:</strong> " +
              escapeHTML(s.academicBackground) +
            "</li>"
          );
        }
        if (s.subjectBackground) {
          parts.push(
            "<li><strong>Subject:</strong> " +
              escapeHTML(s.subjectBackground) +
            "</li>"
          );
        }
        parts.push("</ul></section>");
      }
  
      // Classes
      if (filters.classes && Array.isArray(s.courses) && s.courses.length) {
        parts.push('<section class="intro-section"><h4>Current Classes</h4><ul>');
        s.courses.forEach(function (c) {
          var label =
            (c.department || "") +
            (c.number ? " " + c.number : "") +
            (c.name ? " – " + c.name : "");
          parts.push(
            "<li><strong>" +
              escapeHTML(label) +
              ":</strong> " +
              escapeHTML(c.reason || "") +
            "</li>"
          );
        });
        parts.push("</ul></section>");
      }
  
      // Extras: computer info from JSON
      if (filters.extras && s.primaryComputer) {
        parts.push(
          '<section class="intro-section">' +
            "<h4>Computer / Extras</h4>" +
            "<p><strong>Primary computer:</strong> " +
            escapeHTML(s.primaryComputer) +
            "</p>" +
          "</section>"
        );
      }
  
      // Quote (optional – only if you later add quoteText/quoteAuthor into JSON)
      if (filters.quote && s.quoteText) {
        parts.push(
          '<section class="intro-section">' +
            "<h4>Favorite Quote</h4>" +
            "<blockquote>“" +
            escapeHTML(s.quoteText) +
            "” — " +
            escapeHTML(s.quoteAuthor || "") +
            "</blockquote>" +
          "</section>"
        );
      }
  
      // Links
      if (
        filters.links &&
        Array.isArray(s.links) &&
        s.links.some(function (lnk) {
          return lnk && lnk.href;
        })
      ) {
        parts.push('<section class="intro-section"><h4>Links</h4><ul>');
        s.links.forEach(function (lnk) {
          if (!lnk || !lnk.href) return;
          var label = lnk.name || lnk.href;
          parts.push(
            '<li><a href="' +
              escapeAttr(lnk.href) +
              '" target="_blank" rel="noopener">' +
              escapeHTML(label) +
            "</a></li>"
          );
        });
        parts.push("</ul></section>");
      }
  
      introCard.innerHTML = parts.join("\n") || "<p>No content selected.</p>";
    }
  
    // ====== Filtering & search ======
    function applyFilters() {
      var term = searchInput.value.trim().toLowerCase();
  
      if (!term) {
        filteredStudents = allStudents.slice();
      } else {
        filteredStudents = allStudents.filter(function (s) {
          var first = (s.firstName || "").toLowerCase();
          var last = (s.lastName || "").toLowerCase();
          var pref = (s.preferredName || "").toLowerCase();
          return (
            first.indexOf(term) !== -1 ||
            last.indexOf(term) !== -1 ||
            pref.indexOf(term) !== -1
          );
        });
      }
  
      currentIndex = 0;
      renderCurrent();
    }
  
    // ====== Event listeners ======
    searchInput.addEventListener("input", function () {
      applyFilters();
    });
  
    filterCheckboxes.forEach(function (cb) {
      cb.addEventListener("change", function () {
        renderCurrent();
      });
    });
  
    prevBtn.addEventListener("click", function () {
      if (filteredStudents.length === 0) return;
      currentIndex =
        (currentIndex - 1 + filteredStudents.length) % filteredStudents.length;
      renderCurrent();
    });
  
    nextBtn.addEventListener("click", function () {
      if (filteredStudents.length === 0) return;
      currentIndex = (currentIndex + 1) % filteredStudents.length;
      renderCurrent();
    });
  
    // ====== Load JSON on page load ======
    fetch(JSON_URL)
      .then(function (resp) {
        if (!resp.ok) {
          throw new Error("HTTP " + resp.status);
        }
        return resp.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) {
          // if they accidentally saved a single object, wrap it
          data = data ? [data] : [];
        }
        allStudents = data;
        applyFilters();
      })
      .catch(function (err) {
        console.error("Error loading introductions JSON:", err);
        introCard.innerHTML =
          "<p>Could not load introductions JSON. Check the file path and format.</p>";
      });
  })();  