(function () {
    const form = document.getElementById('intro-form');
    const result = document.getElementById('result');
    const resetLinkWrap = document.getElementById('reset-link');
    const startOver = document.getElementById('start-over');
    const addCourseBtn = document.getElementById('add-course');
    const coursesWrap = document.getElementById('courses');
    const clearBtn = document.getElementById('clear-btn');
  
    // Prevent page navigation on submit (as required)
    form.addEventListener('submit', (e) => e.preventDefault());
  
    // ---------- Prefill: your 5 current courses ----------
    const defaultCourses = [
      { dept:'ITIS', num:'3135', name:'Front-End Web Application Development', reason:'Degree requirement; strengthens web dev skills.' },
      { dept:'ITCS', num:'3166', name:'Intro to Computer Networks', reason:'Required; foundation in networking concepts.' },
      { dept:'ITIS', num:'3200', name:'Intro to Info Security & Privacy', reason:'Required; core cybersecurity & privacy.' },
      { dept:'ITSC', num:'3155', name:'Software Engineering', reason:'Required; teamwork & project-based design.' },
      { dept:'ITCS', num:'3050', name:'Computational Thinking & AI Literacy in K-12', reason:'Required; perspective on computing & AI in education.' },
    ];
  
    // Helper: build one course row
    function courseRow(data = {}) {
      const id = crypto.randomUUID();
      const wrap = document.createElement('div');
      wrap.className = 'card';
      wrap.style.margin = '.5rem 0';
      wrap.dataset.courseId = id;
  
      wrap.innerHTML = `
  <div style="display:grid; gap:.5rem; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); align-items:end;">
    <label>Dept *<br/><input name="courseDept" required placeholder="ITIS" value="${data.dept || ''}"></label>
    <label>Number *<br/><input name="courseNum" required placeholder="3135" value="${data.num || ''}"></label>
    <label>Name *<br/><input name="courseName" required placeholder="Course name" value="${data.name || ''}">
    </label>
    <label>Reason *<br/><input name="courseReason" required placeholder="Why you’re taking it" value="${data.reason || ''}"></label>
    <button type="button" class="delete-course" style="justify-self:start">Delete</button>
  </div>
`;
  
      // Delete handler
      wrap.querySelector('.delete-course').addEventListener('click', () => {
        wrap.remove();
      });
  
      return wrap;
    }
  
    // Seed defaults
    function loadDefaultCourses() {
      coursesWrap.innerHTML = '';
      defaultCourses.forEach(c => coursesWrap.appendChild(courseRow(c)));
    }
    loadDefaultCourses();
  
    // Add course
    addCourseBtn.addEventListener('click', () => {
      coursesWrap.appendChild(courseRow());
    });
  
    // Clear button (empties all inputs in the form)
    clearBtn.addEventListener('click', () => {
      Array.from(form.querySelectorAll('input, textarea')).forEach(el => {
        if (el.type === 'file') el.value = '';
        else el.value = '';
      });
    });
  
    // Reset (bring back defaults)
    form.addEventListener('reset', () => {
      // Allow browser to reset text fields first
      setTimeout(() => {
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
  
    // Submit handler -> validate => render output that matches introduction.html
    form.addEventListener('submit', async () => {
      // Basic required validation
      const required = Array.from(form.querySelectorAll('[required]'));
      const missing = required.filter(el => !el.value.trim());
      if (missing.length) {
        missing[0].focus();
        alert('Please complete all required fields.');
        return;
      }
  
      // Collect course rows
      const rows = Array.from(coursesWrap.querySelectorAll('[data-course-id]'));
      if (rows.length === 0) {
        alert('Please include at least one course.');
        return;
      }
  
      const courses = rows.map(row => ({
        dept: row.querySelector('input[name="courseDept"]').value.trim(),
        num: row.querySelector('input[name="courseNum"]').value.trim(),
        name: row.querySelector('input[name="courseName"]').value.trim(),
        reason: row.querySelector('input[name="courseReason"]').value.trim(),
      }));
  
      // Decide which image to use (uploaded file takes precedence)
      let imgSrc = form.pictureUrl.value.trim();
      const file = form.pictureFile.files?.[0];
      if (file) {
        imgSrc = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      }
  
      // Gather all fields
      const data = {
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
          form.bullet7.value.trim(),
        ],
        courses,
        quoteText: form.quoteText.value.trim(),
        quoteAuthor: form.quoteAuthor.value.trim(),
        funnyThing: form.funnyThing.value.trim(),
        shareThing: form.shareThing.value.trim(),
        links: [
          form.link1.value.trim(),
          form.link2.value.trim(),
          form.link3.value.trim(),
          form.link4.value.trim(),
          form.link5.value.trim(),
        ],
      };
  
      // Render EXACT structure used by your introduction page
      // (same tags/order so spacing, fonts, and look match)
      const courseLis = data.courses.map(c => `
        <li><b>${escapeHTML(c.dept)} ${escapeHTML(c.num)} — ${escapeHTML(c.name)}:</b> ${escapeHTML(c.reason)}</li>
      `).join('');
  
      const otherLis = data.bullets
        .filter(Boolean)
        .map((txt, i) => {
          const labels = [
            'Personal Background',
            'Professional Background',
            'Academic Background',
            'Primary Computer',
            'Bullet 5',
            'Bullet 6',
            'Bullet 7'
          ];
          return `<li><b>${labels[i]}:</b> ${escapeHTML(txt)}</li>`;
        }).join('');
  
      const nicknameLine = data.nickname ? ` (${escapeHTML(data.nickname)})` : '';
      const middle = data.middleName ? ` ${escapeHTML(data.middleName)}` : '';
  
      result.innerHTML = `
        <h2>Introduction</h2>
  
        <figure>
          <img src="${escapeAttr(data.pictureUrl)}" alt="User-provided introduction image" />
          <figcaption>${escapeHTML(data.pictureCaption)}</figcaption>
        </figure>
  
        <ul>
          ${otherLis}
          <li><b>Courses:</b>
            <ul>
              ${courseLis}
            </ul>
          </li>
        </ul>
  
        <blockquote>“${escapeHTML(data.quoteText)}” — ${escapeHTML(data.quoteAuthor)}</blockquote>
  
        ${ data.funnyThing ? `<p><em>${escapeHTML(data.funnyThing)}</em></p>` : '' }
        ${ data.shareThing ? `<p>${escapeHTML(data.shareThing)}</p>` : '' }
  
        <p>
          ${data.links.map((href,i)=>`<a href="${escapeAttr(href)}" target="_blank" rel="noopener">Link ${i+1}</a>`).join(` ${escapeHTML(data.divider)} `)}
        </p>
  
        <hr aria-hidden="true" />
  
        <p class="lead">
          <b>${escapeHTML(data.ackStatement)}</b><br/>
          <small>Signed: ${escapeHTML(data.firstName)}${middle} ${escapeHTML(data.lastName)}${nicknameLine}, ${escapeHTML(data.ackDate)}</small>
        </p>
      `;
  
      // Swap: hide form, show result + reset link
      form.hidden = true;
      result.hidden = false;
      resetLinkWrap.hidden = false;
  
      // Make sure page uses same overall page structure & CSS via includes — already done.
    });
  
    // Start over (bring back form view & reset fields)
    startOver.addEventListener('click', (e) => {
      e.preventDefault();
      result.hidden = true;
      resetLinkWrap.hidden = false;
      form.hidden = false;
      form.reset();
    });
  
    // Accessibility helpers
    function escapeHTML(str) {
      return str.replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
    }
    function escapeAttr(str) {
      return escapeHTML(str).replace(/"/g, '&quot;');
    }
  })();