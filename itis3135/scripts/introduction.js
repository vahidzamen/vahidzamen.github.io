(function () {
  var form = document.getElementById('intro-form');
  var result = document.getElementById('result');
  var resetLinkWrap = document.getElementById('reset-link');
  var startOver = document.getElementById('start-over');
  var addCourseBtn = document.getElementById('add-course');
  var coursesWrap = document.getElementById('courses');
  var clearBtn = document.getElementById('clear-btn');

  // ---------- Escape helpers (defined FIRST so linter is happy) ----------
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (s) {
      var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return map[s] || s;
    });
  }

  function escapeAttr(str) {
    // attributes also need quotes escaped
    return escapeHTML(str).replace(/"/g, '&quot;');
  }

  // Prevent page navigation on submit (as required)
  form.addEventListener('submit', function (e) {
    e.preventDefault();
  });

  // ---------- Prefill: your 5 current courses ----------
  var starterCourses = [
    { dept: 'ITIS', num: '3135', name: 'Front-End Web App Dev', reason: 'Required; builds web dev skills.' },
    { dept: 'ITCS', num: '3166', name: 'Intro to Computer Networks', reason: 'Required; foundation in networking concepts.' },
    { dept: 'ITIS', num: '3200', name: 'Intro to Info Security & Privacy', reason: 'Required; core cybersecurity & privacy.' },
    { dept: 'ITSC', num: '3155', name: 'Software Engineering', reason: 'Required; teamwork & project-based design.' },
    { dept: 'ITCS', num: '3050', name: 'Computational Thinking & AI Literacy in K–12', reason: 'Required; perspective on computing & AI in education.' }
  ];

  // ---------- Helper: build one course row ----------
  function courseRow(data) {
    if (!data) {
      data = {};
    }

    var id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + String(Math.random());
    var wrap = document.createElement('div');
    wrap.className = 'card';
    wrap.style.margin = '.5rem 0';
    wrap.dataset.courseId = id;

    wrap.innerHTML = [
      '<div style="display:grid; gap:.5rem; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); align-items:end;">',
      '  <label>Dept *<br/><input name="courseDept" required placeholder="ITIS" value="', escapeAttr(data.dept || ''), '"></label>',
      '  <label>Number *<br/><input name="courseNum" required placeholder="3135" value="', escapeAttr(data.num || ''), '"></label>',
      '  <label>Name *<br/><input name="courseName" required placeholder="Course name" value="', escapeAttr(data.name || ''), '"></label>',
      '  <label>Reason *<br/><input name="courseReason" required placeholder="Why you’re taking it" value="', escapeAttr(data.reason || ''), '"></label>',
      '  <button type="button" class="delete-course" style="justify-self:start">Delete</button>',
      '</div>'
    ].join('');

    // Delete handler
    var delBtn = wrap.querySelector('.delete-course');
    if (delBtn) {
      delBtn.addEventListener('click', function () {
        wrap.remove();
      });
    }

    return wrap;
  }

  // ---------- Seed defaults ----------
  function loadDefaultCourses() {
    coursesWrap.innerHTML = '';
    starterCourses.forEach(function (c) {
      coursesWrap.appendChild(courseRow(c));
    });
  }
  loadDefaultCourses();

  // ---------- Add course ----------
  addCourseBtn.addEventListener('click', function () {
    coursesWrap.appendChild(courseRow());
  });

  // ---------- Clear button (empties all inputs in the form) ----------
  clearBtn.addEventListener('click', function () {
    var inputs = form.querySelectorAll('input, textarea');
    Array.prototype.forEach.call(inputs, function (el) {
      if (el.type === 'file') {
        el.value = '';
      } else {
        el.value = '';
      }
    });
  });

  // ---------- Reset (bring back defaults) ----------
  form.addEventListener('reset', function () {
    // Allow browser to reset text fields first
    setTimeout(function () {
      loadDefaultCourses();
      // Put back your defaults for a few specific fields (if needed)
      form.pictureUrl.value = 'images/IMG_5973.JPG';
      form.pictureCaption.value = 'Hi! I’m Vahid—welcome to my page.';
      form.ackStatement.value = 'I, Vahid Zamen, certify this is my work for ITIS-3135.';
      form.ackDate.value = '2025-09-14';
      form.firstName.value = 'Vahid';
      form.lastName.value = 'Zamen';
      form.mascotAdj.value = 'Vigilant';
      form.mascotAnimal.value = 'Zebra';
      form.divider.value = '—';
      form.personalStatement.value =
        'I come from a close-knit family of five siblings. Moving from Afghanistan to the U.S. in 2015 was a big change, but it gave me the chance to grow, adapt, and pursue education in technology.';
      // bullets 1-4 are filled above already; 5-7 left blank by default
      form.bullet1.value = form.personalStatement.value;
      form.bullet2.value = 'I have worked in diverse roles, including Tech Consultant at Target, Production Operator at Pfizer, and Photographer at Westgate Chrysler Jeep Dodge RAM, gaining skills in customer service, technology, and teamwork.';
      form.bullet3.value = 'I earned my Associate of Arts in Computer Science from Wake Tech with a GPA of 3.4, and transferred to UNC Charlotte to focus on Computer Science (Information Technology). I am pursuing a B.A. in Computer Science with a concentration in Information Technology, planning to graduate in May 2026.';
      form.bullet4.value = 'MacBook Pro M3 (macOS), which I use primarily at home and on campus.';
      form.quoteText.value = 'Don’t count the days, make the days count.';
      form.quoteAuthor.value = 'Muhammad Ali';
    }, 0);
  });

  // ---------- Submit handler -> validate => render output ----------
  form.addEventListener('submit', async function () {
    // Basic required validation
    var required = Array.prototype.slice.call(form.querySelectorAll('[required]'));
    var missing = required.filter(function (el) {
      return !el.value.trim();
    });
    if (missing.length) {
      missing[0].focus();
      alert('Please complete all required fields.');
      return;
    }

    // Collect course rows
    var rows = Array.prototype.slice.call(coursesWrap.querySelectorAll('[data-course-id]'));
    if (rows.length === 0) {
      alert('Please include at least one course.');
      return;
    }

    var courses = rows.map(function (row) {
      return {
        dept: row.querySelector('input[name="courseDept"]').value.trim(),
        num: row.querySelector('input[name="courseNum"]').value.trim(),
        name: row.querySelector('input[name="courseName"]').value.trim(),
        reason: row.querySelector('input[name="courseReason"]').value.trim()
      };
    });

    // Decide which image to use (uploaded file takes precedence)
    var imgSrc = form.pictureUrl.value.trim();
    var file = (form.pictureFile && form.pictureFile.files && form.pictureFile.files[0]) || null;

    if (file) {
      imgSrc = await new Promise(function (resolve) {
        var reader = new FileReader();
        reader.onload = function () {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    }

    // Gather all fields
    var data = {
      firstName: form.firstName.value.trim(),
      middleName: form.middleName.value.trim(),
      nickname: form.nickname.value.trim(),
      lastName: form.lastName.value.trim(),
      ackStatement: form.ackStatement.value.trim(),
      ackDate: form.ackDate.value,
      mascotAdj: form.mascotAdj.value.trim(),
      mascotAnimal: form.mascotAnimal.value.trim(),
      divider: form.divider.value.trim() || '—',
      pictureUrl: imgSrc,
      pictureCaption: form.pictureCaption.value.trim(),
      personalStatement: form.personalStatement.value.trim(),
      bullets: [
        form.bullet1.value.trim(),
        form.bullet2.value.trim(),
        form.bullet3.value.trim(),
        form.bullet4.value.trim(),
        form.bullet5.value.trim(),
        form.bullet6.value.trim(),
        form.bullet7.value.trim()
      ],
      courses: courses,
      quoteText: form.quoteText.value.trim(),
      quoteAuthor: form.quoteAuthor.value.trim(),
      funnyThing: form.funnyThing.value.trim(),
      shareThing: form.shareThing.value.trim(),
      links: [
        form.link1.value.trim(),
        form.link2.value.trim(),
        form.link3.value.trim(),
        form.link4.value.trim(),
        form.link5.value.trim()
      ]
    };

    // Build course list HTML
    var courseLis = data.courses.map(function (c) {
      return '<li><b>' +
        escapeHTML(c.dept) + ' ' +
        escapeHTML(c.num) + ' — ' +
        escapeHTML(c.name) + ':</b> ' +
        escapeHTML(c.reason) +
        '</li>';
    }).join('');

    // Bullet labels
    var labels = [
      'Personal Background',
      'Professional Background',
      'Academic Background',
      'Primary Computer',
      'Bullet 5',
      'Bullet 6',
      'Bullet 7'
    ];

    // Other bullets
    var nonEmptyBullets = data.bullets.filter(function (txt) {
      return txt;
    });

    var otherLis = nonEmptyBullets.map(function (txt, i) {
      return '<li><b>' + labels[i] + ':</b> ' + escapeHTML(txt) + '</li>';
    }).join('');

    var nicknameLine = data.nickname ? ' (' + escapeHTML(data.nickname) + ')' : '';
    var middle = data.middleName ? ' ' + escapeHTML(data.middleName) : '';

    // Build result HTML
    var linksHtml = data.links.map(function (href, i) {
      return '<a href="' + escapeAttr(href) + '" target="_blank" rel="noopener">Link ' + (i + 1) + '</a>';
    }).join(' ' + escapeHTML(data.divider) + ' ');

    result.innerHTML = [
      '<h2>Introduction</h2>',
      '<figure>',
      '  <img src="' + escapeAttr(data.pictureUrl) + '" alt="User-provided introduction image" />',
      '  <figcaption>' + escapeHTML(data.pictureCaption) + '</figcaption>',
      '</figure>',
      '<ul>',
      otherLis,
      '  <li><b>Courses:</b>',
      '    <ul>',
      courseLis,
      '    </ul>',
      '  </li>',
      '</ul>',
      '<blockquote>“' + escapeHTML(data.quoteText) + '” — ' + escapeHTML(data.quoteAuthor) + '</blockquote>',
      (data.funnyThing ? '<p><em>' + escapeHTML(data.funnyThing) + '</em></p>' : ''),
      (data.shareThing ? '<p>' + escapeHTML(data.shareThing) + '</p>' : ''),
      '<p>' + linksHtml + '</p>',
      '<hr aria-hidden="true" />',
      '<p class="lead">',
      '  <b>' + escapeHTML(data.ackStatement) + '</b><br/>',
      '  <small>Signed: ' + escapeHTML(data.firstName) + middle + ' ' + escapeHTML(data.lastName) + nicknameLine + ', ' + escapeHTML(data.ackDate) + '</small>',
      '</p>'
    ].join('\n');

    // Swap: hide form, show result + reset link
    form.hidden = true;
    result.hidden = false;
    resetLinkWrap.hidden = false;
  });

  // ---------- Start over ----------
  startOver.addEventListener('click', function (e) {
    e.preventDefault();
    result.hidden = true;
    resetLinkWrap.hidden = false;
    form.hidden = false;
    form.reset();
  });
})();