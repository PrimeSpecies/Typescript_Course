import { User } from './models.js';
import { StorageService } from './storage.js';

// Elements for Toggling Panels
const loginPanel = document.getElementById('loginPanel') as HTMLElement;
const createPanel = document.getElementById('createPanel') as HTMLElement;
const toCreateBtn = document.getElementById('toCreate') as HTMLButtonElement;
const toLoginBtn = document.getElementById('toLogin') as HTMLButtonElement;

// Form Inputs & Buttons
const loginEmailInput = document.getElementById('loginEmail') as HTMLInputElement;
const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;

const fullNameInput = document.getElementById('fullName') as HTMLInputElement;
const createEmailInput = document.getElementById('createEmail') as HTMLInputElement;
const createBtn = document.getElementById('createBtn') as HTMLButtonElement;

// --- PANEL TOGGLE LOGIC ---
toCreateBtn.addEventListener('click', () => {
    loginPanel.classList.remove('active');
    createPanel.classList.add('active');
});

toLoginBtn.addEventListener('click', () => {
    createPanel.classList.remove('active');
    loginPanel.classList.add('active');
});

// --- LOGIN LOGIC (Existing User) ---
loginBtn.addEventListener('click', () => {
    const email = loginEmailInput.value.trim().toLowerCase();

    if (!StorageService.isValidEmail(email)) {
        alert("Please use a valid @school.com address.");
        return;
    }

    const users = StorageService.getUsers();
    const user = users.find(u => u.email === email);

    if (user) {
        StorageService.setCurrentUser(user);
        window.location.href = 'events.html';
    } else {
        alert("User not found. Please create an account first.");
    }
});

// --- CREATE ACCOUNT LOGIC (New User) ---
createBtn.addEventListener('click', () => {
    const name = fullNameInput.value.trim();
    const email = createEmailInput.value.trim().toLowerCase();

    if (!name || !email) {
        alert("Please fill in all fields.");
        return;
    }

    if (!StorageService.isValidEmail(email)) {
        alert("Registration requires a @school.com address.");
        return;
    }

    const users = StorageService.getUsers();
    if (users.find(u => u.email === email)) {
        alert("This email is already registered. Please login.");
        return;
    }

    const newUser: User = {
        fullName: name,
        email: email,
        bookedEvents: [],
        isAdmin: email === "admin@school.com"
    };

    StorageService.saveUser(newUser);
    StorageService.setCurrentUser(newUser);
    window.location.href = 'events.html';
});