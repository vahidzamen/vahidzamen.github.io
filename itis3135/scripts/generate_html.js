// scripts/generate_html.js
(function () {
    // Grab elements
    var form = document.getElementById('intro-form');
    var generateHtmlBtn = document.getElementById('generate-html-btn');
    var outputSection = document.getElementById('html-output');
    var codeBlock = document.getElementById('html-code');
    var heading = document.getElementById('intro-heading');
    var coursesWrap = document.getElementById('courses');
  
    // Safety check – if anything is missing, just stop
    if (!form || !generateHtmlBtn || !outputSection || !codeBlock || !heading || !coursesWrap) {
      return;
    }
  
    generateHtmlBtn.addEventListener('click', function (event) {
      event.preventDefault();
  
      // Basic required validation (similar to generate_json.js / introduction.js)
      var required = Array.prototype.slice.call(form.querySelectorAll('[required]'));
      var missing = required.filter(function (el) {
        return !el.value.trim();
      });
  
      if (missing.length) {
        missing[0].focus();
        alert('Please complete all required fields before generating HTML.');
        return;
      }
  
      // ---------- Collect values from the form ----------
  
      // Acknowledgment
      var ackStatement = form.ackStatement.value.trim();
      var ackDate = form.ackDate.value.trim();
  
      // Name pieces
      var firstName = form.firstName.value.trim();
      var middleName = form.middleName.value.trim();
      var lastName = form.lastName.value.trim();
      var nickname = form.nickname.value.trim();
  
      var displayName = nickname || firstName;
      if (middleName) {
        displayName += ' ' + middleName;
      }
      if (lastName) {
        displayName += ' ' + lastName;
      }
  
      // Mascot line
      var mascotAdj = form.mascotAdj.value.trim();
      var mascotAnimal = form.mascotAnimal.value.trim();
      var divider = form.divider.value.trim() || ' | ';
      var mascotLine = mascotAdj + ' ' + mascotAnimal;
  
      // Picture
      var pictureUrl = form.pictureUrl.value.trim();
      var pictureCaption = form.pictureCaption.value.trim();
  
      // Bullets
      var bullet1 = form.bullet1.value.trim();
      var bullet2 = form.bullet2.value.trim();
      var bullet3 = form.bullet3.value.trim();
      var bullet4 = form.bullet4.value.trim();
      var bullet5 = form.bullet5.value.trim();
      var bullet6 = form.bullet6.value.trim();
      var bullet7 = form.bullet7.value.trim();
  
      // Quote
      var quoteText = form.quoteText.value.trim();
      var quoteAuthor = form.quoteAuthor.value.trim();
  
      // Extras
      var funnyThing = form.funnyThing.value.trim();
      var shareThing = form.shareThing.value.trim();
  
      // Links (only keep non-empty)
      var links = [];
      ['link1', 'link2', 'link3', 'link4', 'link5'].forEach(function (name) {
        var v = (form[name].value || '').trim();
        if (v) {
          links.push(v);
        }
      });
  
      // Courses (from dynamic rows)
      var courseLis = [];
      var rows = Array.prototype.slice.call(
        coursesWrap.querySelectorAll('[data-course-id]')
      );
      rows.forEach(function (row) {
        var deptInput = row.querySelector('input[name="courseDept"]');
        var numInput = row.querySelector('input[name="courseNum"]');
        var nameInput = row.querySelector('input[name="courseName"]');
        var reasonInput = row.querySelector('input[name="courseReason"]');
  
        if (!deptInput || !numInput || !nameInput || !reasonInput) {
          return;
        }
  
        var dept = deptInput.value.trim();
        var num = numInput.value.trim();
        var cname = nameInput.value.trim();
        var reason = reasonInput.value.trim();
  
        if (dept || num || cname || reason) {
          courseLis.push(
            '        <li><strong>' +
            (dept || '') + (num ? ' ' + num : '') +
            (cname ? ' – ' + cname : '') +
            ':</strong> ' + reason + '</li>'
          );
        }
      });
  
      var coursesHtml = courseLis.length
        ? courseLis.join('\n')
        : '        <li>No courses listed.</li>';
  
      // ---------- Build the HTML snippet ----------
  
      var lines = [];
  
      lines.push('<h2>Introduction</h2>');
      lines.push('<h3>' + mascotLine + ' ' + divider + ' ' + displayName + '</h3>');
      lines.push('');
      lines.push('<p><em>' + ackStatement + ' (' + ackDate + ')</em></p>');
      lines.push('');
      lines.push('<figure>');
      lines.push('  <img src="' + pictureUrl + '" alt="' + pictureCaption + '">');
      lines.push('  <figcaption>' + pictureCaption + '</figcaption>');
      lines.push('</figure>');
      lines.push('');
      lines.push('<ul>');
      lines.push('  <li><strong>Personal Background:</strong> ' + bullet1 + '</li>');
      lines.push('  <li><strong>Professional Background:</strong> ' + bullet2 + '</li>');
      lines.push('  <li><strong>Academic Background:</strong> ' + bullet3 + '</li>');
      lines.push('  <li><strong>Primary Computer:</strong> ' + bullet4 + '</li>');
      lines.push('  <li><strong>Additional Detail 5:</strong> ' + bullet5 + '</li>');
      lines.push('  <li><strong>Additional Detail 6:</strong> ' + bullet6 + '</li>');
      lines.push('  <li><strong>Additional Detail 7:</strong> ' + bullet7 + '</li>');
      lines.push('  <li><strong>Current Courses:</strong>');
      lines.push('    <ul>');
      lines.push(coursesHtml);
      lines.push('    </ul>');
      lines.push('  </li>');
  
      if (funnyThing) {
        lines.push('  <li><strong>Funny thing:</strong> ' + funnyThing + '</li>');
      }
      if (shareThing) {
        lines.push('  <li><strong>Something I’d like to share:</strong> ' + shareThing + '</li>');
      }
      lines.push('</ul>');
      lines.push('');
      lines.push('<h3>Favorite Quote</h3>');
      lines.push('<blockquote>"' + quoteText + '" — ' + quoteAuthor + '</blockquote>');
      lines.push('');
  
      if (links.length) {
        lines.push('<h3>Links</h3>');
        lines.push('<ul>');
        links.forEach(function (url) {
          lines.push('  <li><a href="' + url + '">' + url + '</a></li>');
        });
        lines.push('</ul>');
      }
  
      var htmlOutput = lines.join('\n');
  
      // ---------- Show result, hide form ----------
  
      heading.textContent = 'Introduction HTML';
      form.hidden = true;
      outputSection.hidden = false;
  
      codeBlock.textContent = htmlOutput;
  
      // Highlight.js formatting
      if (window.hljs) {
        window.hljs.highlightElement(codeBlock);
      }
    });
  })();  