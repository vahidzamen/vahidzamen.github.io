// scripts/generate_html.js
(function () {
    var form = document.getElementById('intro-form');
    var generateHtmlBtn = document.getElementById('generate-html-btn');
    var outputSection = document.getElementById('html-output');
    var codeBlock = document.getElementById('html-code');
    var heading = document.getElementById('intro-heading');
    var coursesWrap = document.getElementById('courses');
  
    // If anything is missing, just exit quietly
    if (!form || !generateHtmlBtn || !outputSection || !codeBlock || !heading || !coursesWrap) {
      return;
    }
  
    generateHtmlBtn.addEventListener('click', function (e) {
      e.preventDefault();
  
      // Basic required validation (same idea as generate_json.js)
      var required = Array.prototype.slice.call(form.querySelectorAll('[required]'));
      var missing = required.filter(function (el) {
        return !el.value.trim();
      });
  
      if (missing.length) {
        missing[0].focus();
        alert('Please complete all required fields before generating HTML.');
        return;
      }
  
      // ---------- Collect values from THIS form ----------
  
      // Name pieces
      var firstName = form.firstName.value.trim();
      var lastName = form.lastName.value.trim();
      var preferred = form.nickname.value.trim() || firstName;
      var fullName = preferred + (lastName ? ' ' + lastName : '');
  
      // Picture
      var imageUrl = form.pictureUrl.value.trim();
      var imageCaption = form.pictureCaption.value.trim();
  
      // Bullets
      var personal = form.bullet1.value.trim();
      var professional = form.bullet2.value.trim();
      var academic = form.bullet3.value.trim();
      var primaryComputer = form.bullet4.value.trim();
      var extra5 = form.bullet5.value.trim();
      var extra6 = form.bullet6.value.trim();
      var extra7 = form.bullet7.value.trim();
  
      // Quote
      var quoteText = form.quoteText.value.trim();
      var quoteAuthor = form.quoteAuthor.value.trim();
  
      // Courses (from dynamic rows)
      var rows = Array.prototype.slice.call(
        coursesWrap.querySelectorAll('[data-course-id]')
      );
  
      var coursesHtml = rows.map(function (row) {
        var dept = row.querySelector('input[name="courseDept"]').value.trim();
        var num = row.querySelector('input[name="courseNum"]').value.trim();
        var name = row.querySelector('input[name="courseName"]').value.trim();
        var reason = row.querySelector('input[name="courseReason"]').value.trim();
        return '      <li><strong>' + dept + ' ' + num + ' – ' + name + ':</strong> ' + reason + '</li>';
      }).join('\n');
  
      // ---------- Build the HTML snippet ----------
  
      var html = [
        '<h2>Introduction</h2>',
        '<h3>' + fullName + '</h3>',
        '',
        '<figure>',
        '  <img src="' + imageUrl + '" alt="' + imageCaption + '" />',
        '  <figcaption>' + imageCaption + '</figcaption>',
        '</figure>',
        '',
        '<ul>',
        '  <li><strong>Personal Background:</strong> ' + personal + '</li>',
        '  <li><strong>Professional Background:</strong> ' + professional + '</li>',
        '  <li><strong>Academic Background:</strong> ' + academic + '</li>',
        '  <li><strong>Primary Computer:</strong> ' + primaryComputer + '</li>',
        '  <li><strong>Courses:</strong>',
        '    <ul>',
        coursesHtml,
        '    </ul>',
        '  </li>',
        '  <li><strong>Extra 5:</strong> ' + extra5 + '</li>',
        '  <li><strong>Extra 6:</strong> ' + extra6 + '</li>',
        '  <li><strong>Extra 7:</strong> ' + extra7 + '</li>',
        '</ul>',
        '',
        '<blockquote>"' + quoteText + '" — ' + quoteAuthor + '</blockquote>'
      ].join('\n');
  
      // ---------- Show result, hide form ----------
  
      heading.textContent = 'Introduction HTML';
      outputSection.hidden = false;
      form.hidden = true;
  
      // Put the HTML into the code block as text (so it displays as code)
      codeBlock.textContent = html;
  
      // Highlight.js formatting if available
      if (window.hljs) {
        window.hljs.highlightElement(codeBlock);
      }
    });
  })();  