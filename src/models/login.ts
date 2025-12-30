import { User } from './models.js';
import { StorageService } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements
    const loginPanel = document.getElementById('loginPanel');
    const createPanel = document.getElementById('createPanel');
    const loginEmailInput = document.getElementById('loginEmail') as HTMLInputElement;
    const fullNameInput = document.getElementById('fullName') as HTMLInputElement;
    const createEmailInput = document.getElementById('createEmail') as HTMLInputElement;

    // --- PANEL TOGGLE (Preserving your snappy animation) ---
    document.getElementById('toCreate')?.addEventListener('click', () => {
        loginPanel?.classList.remove('active');
        createPanel?.classList.add('active');
    });

    document.getElementById('toLogin')?.addEventListener('click', () => {
        createPanel?.classList.remove('active');
        loginPanel?.classList.add('active');
    });

    // --- LOGIN LOGIC (The Fix) ---
// --- LOGIN LOGIC ---
document.getElementById('loginBtn')?.addEventListener('click', () => {
    // We fetch the element inside the click to ensure we get the current text
    const loginEmailInput = document.getElementById('loginEmail') as HTMLInputElement;
    const email = loginEmailInput.value.trim().toLowerCase();

    console.log("Attempting login for:", email); // Helpful for debugging!

    const allUsers = StorageService.getUsers();
    console.log("All registered users:", allUsers);

    const user = allUsers.find(u => u.email === email);

    if (user) {
        StorageService.setCurrentUser(user);
        window.location.href = 'events.html';
    } else {
        alert("Invalid email. Please check your spelling or register.");
    }
});

    // --- REGISTER LOGIC ---
    document.getElementById('createBtn')?.addEventListener('click', () => {
        const name = fullNameInput.value.trim();
        const email = createEmailInput.value.trim().toLowerCase();

        if (email === "admin@school.com") {
            alert("This email is already in use.");
            return;
        }

        if (name && email) {
            // Check if user already exists before creating
            const existingUsers = StorageService.getUsers();
            if (existingUsers.find(u => u.email === email)) {
                alert("An account with this email already exists.");
                return;
            }

            const newUser: User = { 
                fullName: name, 
                email: email, 
                bookedEvents: [], 
                isAdmin: false 
            };

            StorageService.saveUser(newUser);
            StorageService.setCurrentUser(newUser);
            window.location.href = 'events.html';
        } else {
            alert("Please enter both your name and email.");
        }
    });
});