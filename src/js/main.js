import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const newsletterForm = document.getElementById("newsletter-form");
const newsletterMessage = document.getElementById("newsletter-message");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("newsletter-email").value;
    newsletterMessage.textContent = `Thanks for subscribing! We will send our news to ${email}`;
    newsletterMessage.hidden = false;
    newsletterForm.reset();
  });
}
