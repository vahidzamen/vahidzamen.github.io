// scripts/generate_html.js

// grab elements
const form = document.getElementById('intro-form');
const btnGenerateHtml = document.getElementById('btn-generate-html');
const outputSection = document.getElementById('html-output');
const codeBlock = document.getElementById('html-code');
const heading = document.getElementById('intro-heading');

// safety check
if (btnGenerateHtml && form && outputSection && codeBlock && heading) {
  btnGenerateHtml.addEventListener('click', (event) => {
    event.preventDefault();

    // get form data
    const data = new FormData(form);

    const name          = data.get('name') || '';
    const imageUrl      = data.get('imageUrl') || '';
    const imageAlt      = data.get('imageAlt') || '';
    const personal      = data.get('personal') || '';
    const professional  = data.get('professional') || '';
    const academic      = data.get('academic') || '';
    const computer      = data.get('computer') || '';
    const quote         = data.get('quote') || '';

    // build HTML string (what will go on your real Introduction page)
    const htmlOutput = `
<h2>Introduction HTML</h2>
<h3>${name}</h3>
<figure>
  <img src="${imageUrl}" alt="${imageAlt}" />
  <figcaption>Hi! I'm ${name} — welcome to my page.</figcaption>
</figure>
<ul>
  <li><strong>Personal Background:</strong> ${personal}</li>
  <li><strong>Professional Background:</strong> ${professional}</li>
  <li><strong>Academic Background:</strong> ${academic}</li>
  <li><strong>Primary Computer:</strong> ${computer}</li>
  <li><strong>Favorite Quote:</strong> ${quote}</li>
</ul>
`.trim();

    // put the HTML code into the <code> element as TEXT (so it shows as code)
    codeBlock.textContent = htmlOutput;

    // show the output section, hide the form
    outputSection.style.display = 'block';
    form.style.display = 'none';

    // change the H2 title
    heading.textContent = 'Introduction HTML';

    // apply Highlight.js formatting
    if (window.hljs) {
      hljs.highlightElement(codeBlock);
    }
  });
}