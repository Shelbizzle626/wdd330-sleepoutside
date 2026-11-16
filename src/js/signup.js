import { loadHeaderFooter, qs } from "./utils.mjs";
import UserData from "./UserData.mjs";

loadHeaderFooter();

const form = qs("#signup-form");
const message = qs("#signup-message");
const avatarInput = qs("#avatar");
const avatarPreview = qs("#avatar-preview");
const users = new UserData();

function showMessage(text, type) {
    message.textContent = text;
    message.className = `signup-message ${type}`;
    message.hidden = false;
    // The button is at the bottom of a long form, so bring the message into view
    message.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Turn the server's error (string, array, or object) into readable text
function errorText(err) {
    const msg = err?.message;
    if (!msg) return "Something went wrong. Please try again.";
    if (typeof msg === "string") return msg;
    if (Array.isArray(msg)) return msg.join(" ");
    return Object.values(msg).join(" ");
}

// Stretch: live avatar preview from a URL
avatarInput.addEventListener("input", () => {
    const url = avatarInput.value.trim();
    avatarPreview.hidden = !url;
    avatarPreview.src = url;
});
avatarPreview.addEventListener("error", () => {
    avatarPreview.hidden = true;
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.hidden = true;

    // Built-in HTML validation (required, type="email", minlength)
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const data = Object.fromEntries(new FormData(form));

    if (data.password !== data.confirmPassword) {
        showMessage("Passwords do not match.", "error");
        qs("#confirmPassword").focus();
        return;
    }

    const user = {
        name: `${data.fname} ${data.lname}`.trim(),
        address: {
            street: data.street,
            city: data.city,
            state: data.state,
            zip: data.zip,
        },
        email: data.email,
        password: data.password,
    };
    if (data.avatar) user.avatar = data.avatar;

    const button = qs("button[type='submit']", form);
    button.disabled = true;
    button.textContent = "Creating account...";

    try {
        await users.createUser(user);
        form.reset();
        form.hidden = true; // swap the form for the confirmation
        showMessage(`Welcome, ${data.fname}! Your account was created.`, "success");
    } catch (err) {
        showMessage(errorText(err), "error");
    } finally {
        button.disabled = false;
        button.textContent = "Create account";
    }
});