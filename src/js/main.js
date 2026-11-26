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

const registerBanner = document.getElementById("register-banner");
const closeBanner = document.getElementById("close-banner");

if (registerBanner && !localStorage.getItem("so-visited")) {
  registerBanner.hidden = false;
  localStorage.setItem("so-visited", true);
}

if (closeBanner) {
  closeBanner.addEventListener("click", () => {
    registerBanner.hidden = true;
  });
}
