// scripts/generate_json.js
(function () {
    var form = document.getElementById('intro-form');
    var heading = document.getElementById('intro-heading');
    var jsonSection = document.getElementById('json-output');
    var jsonCode = document.getElementById('json-code');
    var generateJsonBtn = document.getElementById('generate-json-btn');
    var coursesWrap = document.getElementById('courses');
  
    if (!form || !heading || !jsonSection || !jsonCode || !generateJsonBtn || !coursesWrap) {
      return;
    }
  
    generateJsonBtn.addEventListener('click', function () {
      // Basic required validation (same idea as introduction.js)
      var required = Array.prototype.slice.call(form.querySelectorAll('[required]'));
      var missing = required.filter(function (el) {
        return !el.value.trim();
      });
  
      if (missing.length) {
        missing[0].focus();
        alert('Please complete all required fields before generating JSON.');
        return;
      }
  
      // Collect courses from the dynamic rows
      var rows = Array.prototype.slice.call(
        coursesWrap.querySelectorAll('[data-course-id]')
      );
  
      var courses = rows.map(function (row) {
        return {
          department: row.querySelector('input[name="courseDept"]').value.trim(),
          number: row.querySelector('input[name="courseNum"]').value.trim(),
          name: row.querySelector('input[name="courseName"]').value.trim(),
          reason: row.querySelector('input[name="courseReason"]').value.trim()
        };
      });
  
      // Name pieces
      var firstName = form.firstName.value.trim();
      var lastName = form.lastName.value.trim();
      var preferredName = form.nickname.value.trim() || firstName;
      var middleFull = form.middleName.value.trim();
      var middleInitial = middleFull ? middleFull.charAt(0) : '';
  
      // Build JSON object using the exact keys from the assignment
      var jsonData = {
        firstName: firstName,
        preferredName: preferredName,
        middleInitial: middleInitial,
        lastName: lastName,
        divider: form.divider.value.trim() || '—',
        mascotAdjective: form.mascotAdj.value.trim(),
        mascotAnimal: form.mascotAnimal.value.trim(),
        image: form.pictureUrl.value.trim(),
        imageCaption: form.pictureCaption.value.trim(),
        personalStatement: form.personalStatement.value.trim(),
        personalBackground: form.bullet1.value.trim(),
        professionalBackground: form.bullet2.value.trim(),
        academicBackground: form.bullet3.value.trim(),
        subjectBackground: form.bullet5.value.trim(),   // using bullet 5 as “subject” background
        primaryComputer: form.bullet4.value.trim(),
        courses: courses,
        links: [
          { name: 'Webspace',     href: form.link1.value.trim() },
          { name: 'GitHub',       href: form.link2.value.trim() },
          { name: 'LinkedIn',     href: form.link3.value.trim() },
          { name: 'freeCodeCamp', href: form.link4.value.trim() },
          { name: 'Codecademy',   href: form.link5.value.trim() }
        ]
      };
  
      // Pretty JSON string
      var jsonText = JSON.stringify(jsonData, null, 2);
  
      // Put text into <code> so it shows as code, not executed
      jsonCode.textContent = jsonText;
  
      // Hide the form, show the JSON output
      form.hidden = true;
      jsonSection.hidden = false;
  
      // Change heading (their instructions say "Introduction HTML", but this is JSON)
      heading.textContent = 'Introduction JSON';
  
      // Highlight.js pretty colors
      if (window.hljs) {
        hljs.highlightElement(jsonCode);
      }
    });
  })();  