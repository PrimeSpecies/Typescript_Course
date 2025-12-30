import { StorageService } from './storage.js';
import { User, SchoolEvent, Category } from './models.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = StorageService.getCurrentUser();
    if (!user) { window.location.href = 'login.html'; return; }

    document.getElementById('closeModal')?.addEventListener('click', () => {
    const modal = document.getElementById('eventModal');
    if (modal) modal.style.display = 'none';
});

    // PERSONALIZED GREETING
    const display = document.getElementById('userDisplay');
    if (display) display.innerText = `Welcome back, ${user.fullName}`;

    // THEME TOGGLE
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    document.getElementById('themeToggle')?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // ADMIN VISIBILITY
    const adminSection = document.getElementById('adminPanel');
    const adminBtn = document.getElementById('adminPanelBtn');
    if (user.isAdmin) {
        if (adminBtn) adminBtn.style.display = 'block';
        adminBtn?.addEventListener('click', () => {
            if (adminSection) adminSection.style.display = adminSection.style.display === 'none' ? 'block' : 'none';
        });
        setupAdminLogic(user);
    }

    updateDashboardUI(user);

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        StorageService.logout();
        window.location.href = 'login.html';
    });
});

function setupAdminLogic(user: User) {
    document.getElementById('createEventBtn')?.addEventListener('click', () => {
        const titleInput = document.getElementById('eventTitle') as HTMLInputElement;
        const capacityInput = document.getElementById('eventCapacity') as HTMLInputElement;
        const dateInput = document.getElementById('eventDate') as HTMLInputElement;

        const title = titleInput.value;
        const capacity = parseInt(capacityInput.value);

        if (title && capacity > 0) {
            const newEvent: SchoolEvent = { 
                id: Date.now(), 
                title: title, 
                date: dateInput.value, 
                location: (document.getElementById('eventLocation') as HTMLInputElement).value, 
                category: (document.getElementById('eventCategory') as HTMLSelectElement).value as Category, 
                description: (document.getElementById('eventDescription') as HTMLTextAreaElement).value,
                capacity: capacity,        // Captured from input
                currentBookings: 0         // Starts at zero
            };

            StorageService.saveEvent(newEvent);
            
            // Clear inputs after save
            titleInput.value = '';
            capacityInput.value = '';
            
            updateDashboardUI(user);
            alert("Event created successfully!");
        } else {
            alert("Please provide a title and valid capacity.");
        }
    });
}

function updateDashboardUI(user: User) {
    const all = StorageService.getEvents();
    const mine = all.filter(e => user.bookedEvents.includes(e.id));
    
    renderEvents(all, 'allEvents', user);
    renderEvents(mine, 'myEvents', user);
    
    const count = document.getElementById('userEventCount');
    if (count) count.innerText = `You’re registered for ${mine.length} upcoming events`;
}

function renderEvents(events: SchoolEvent[], containerId: string, user: User) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = events.map(e => {
        const seatsLeft = e.capacity - e.currentBookings;
        const isFull = seatsLeft <= 0;
        const isBooked = user.bookedEvents.includes(e.id);

        return `
            <div class="event-card">
                <span class="pill">${e.category}</span>
                <h3>${e.title}</h3>
                <p>📅 ${e.date}</p>
                
                <span class="view-details" onclick="showDetails(${e.id})">View Details</span>
                
                <hr style="margin: 10px 0; opacity: 0.1;">
                
                <p><strong>Seats Left:</strong> ${isFull ? '<span style="color:red;">Sold Out</span>' : seatsLeft}</p>
                
                <div style="margin-top: 15px;">
                    ${isBooked 
                        ? `<span class="pill" style="background:#dcfce7; color:#166534;">✅ Registered</span>`
                        : isFull 
                            ? `<button class="admin-btn" disabled style="background:#ccc; cursor:not-allowed;">Full</button>`
                            : `<button class="admin-btn" onclick="book(${e.id})">Book Seat</button>`
                    }
                </div>
            </div>
        `;
    }).join('');
}

// Ensure showDetails is still globally accessible
(window as any).showDetails = (id: number) => {
    const events = StorageService.getEvents();
    const event = events.find(e => e.id === id);
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');

    if (event && modal && modalBody) {
        modalBody.innerHTML = `
            <h2 style="color: #ffd633; margin-bottom: 10px;">${event.title}</h2>
            <p><strong>📍 Location:</strong> ${event.location}</p>
            <p><strong>Capacity:</strong> ${event.currentBookings} / ${event.capacity} booked</p>
            <hr style="margin: 15px 0; opacity: 0.2;">
            <p style="line-height:1.6; color: inherit;">${event.description || "No description provided."}</p>
        `;
        modal.style.display = 'flex';
    }
};
//Modal Trigger to the window object
(window as any).showDetails = (id: number) => {
    const events = StorageService.getEvents();
    const event = events.find(e => e.id === id);
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');

    if (event && modal && modalBody) {
        modalBody.innerHTML = `
            <span class="pill" style="margin-bottom:10px; display:inline-block;">${event.category}</span>
            <h2 style="margin-bottom:10px;">${event.title}</h2>
            <p><strong>📍 Location:</strong> ${event.location}</p>
            <p><strong>📅 Date:</strong> ${event.date}</p>
            <hr style="margin: 15px 0; opacity: 0.2;">
            <p style="line-height:1.6;">${event.description || "No description provided for this event."}</p>
        `;
        modal.style.display = 'flex';
    }
};

(window as any).book = (id: number) => {
    const user = StorageService.getCurrentUser();
    const events = StorageService.getEvents();
    const event = events.find(e => e.id === id);

    if (user && event && !user.bookedEvents.includes(id) && event.currentBookings < event.capacity) {
        // Update User
        user.bookedEvents.push(id);
        StorageService.saveUser(user);
        StorageService.setCurrentUser(user);

        // Update Event Capacity
        event.currentBookings += 1;
        // You'll need a small helper in StorageService to update a single event
        StorageService.updateEvent(event); 

        updateDashboardUI(user);
    }
};