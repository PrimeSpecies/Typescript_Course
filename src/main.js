"use strict";
const loginPanel = document.getElementById("loginPanel");
const createPanel = document.getElementById("createPanel");
const toCreateBtn = document.getElementById("toCreate");
const toLoginBtn = document.getElementById("toLogin");
const events = [];
const registrations = [];
toCreateBtn.addEventListener("click", () => {
    loginPanel.classList.remove("active");
    createPanel.classList.add("active");
});
toLoginBtn.addEventListener("click", () => {
    createPanel.classList.remove("active");
    loginPanel.classList.add("active");
});
document.addEventListener("DOMContentLoaded", () => {
    const users = [];
    let currentUser = null;
    const loginEmail = document.getElementById("loginEmail");
    const loginBtn = document.getElementById("loginBtn");
    const fullNameInput = document.getElementById("fullName");
    const createEmail = document.getElementById("createEmail");
    const createBtn = document.getElementById("createBtn");
    function openEventsPage() {
        if (!currentUser)
            return;
        document.querySelector(".container").setAttribute("style", "display:none");
        const eventsPage = document.getElementById("eventsPage");
        eventsPage.style.display = "block";
        document.getElementById("welcomeUser").textContent =
            `Welcome, ${currentUser.fullName}`;
    }
    loginBtn.addEventListener("click", () => {
        const email = loginEmail.value.trim().toLowerCase();
        if (!email) {
            alert("Please enter your email.");
            return;
        }
        const user = users.find(u => u.email === email);
        if (!user) {
            alert("No account found. Please create an account.");
            return;
        }
        currentUser = user;
        openEventsPage();
        alert(`Welcome back, ${user.fullName}!`);
    });
    createBtn.addEventListener("click", () => {
        const name = fullNameInput.value.trim();
        const email = createEmail.value.trim().toLowerCase();
        if (!name || !email) {
            alert("Please fill in all fields.");
            return;
        }
        const exists = users.some(u => u.email === email);
        if (exists) {
            alert("Account already exists.");
            return;
        }
        users.push({ fullName: name, email });
        alert("Account created successfully!");
    });
});
//# sourceMappingURL=main.js.map