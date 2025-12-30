import { User, SchoolEvent } from './models.js';

export const StorageService = {
    // AUTH & SESSION
    isValidEmail: (email: string): boolean => email.toLowerCase().endsWith('@school.com'),

    setCurrentUser: (user: User): void => localStorage.setItem('currentUser', JSON.stringify(user)),

    getCurrentUser: (): User | null => {
        const data = localStorage.getItem('currentUser');
        return data ? JSON.parse(data) : null;
    },

    logout: (): void => localStorage.removeItem('currentUser'),

    // USER DATABASE
    // Inside StorageService in storage.ts

getUsers: (): User[] => {
    const savedUsers = localStorage.getItem('users');
    let users: User[] = savedUsers ? JSON.parse(savedUsers) : [];

    // Check if admin already exists, if not, add them automatically
    const adminExists = users.find(u => u.email === "admin@school.com");
    if (!adminExists) {
        const adminUser: User = {
            fullName: "System Admin",
            email: "admin@school.com",
            bookedEvents: [],
            isAdmin: true
        };
        users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    return users;
},

    saveUser: (user: User): void => {
        const users = StorageService.getUsers();
        const index = users.findIndex(u => u.email === user.email);
        if (index > -1) users[index] = user;
        else users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    },

    // EVENT DATABASE
getEvents: (): SchoolEvent[] => {
        const saved = localStorage.getItem('events');
        if (saved) return JSON.parse(saved);
        
        // FIX: Added capacity and currentBookings to defaults
        const defaultEvents: SchoolEvent[] = [
    { 
        id: 101, 
        title: "AI & Future of Code", 
        date: "2025-02-10", 
        location: "Grand Auditorium", 
        category: "Conferences", 
        description: "A deep dive into how LLMs are changing software engineering. Keynote by industry experts.",
        capacity: 150,
        currentBookings: 148 // Almost full!
    },
    { 
        id: 102, 
        title: "UI/UX Design Sprint", 
        date: "2025-02-15", 
        location: "Design Lab 4", 
        category: "Workshops", 
        description: "A hands-on workshop on Figma prototyping and user testing for mobile applications.",
        capacity: 25,
        currentBookings: 25 // Sold Out!
    },
    { 
        id: 103, 
        title: "3v3 Basketball Tournament", 
        date: "2025-03-05", 
        location: "Indoor Sports Center", 
        category: "Sports", 
        description: "Fast-paced tournament. Open to all skill levels. Prizes for the top 3 teams.",
        capacity: 32,
        currentBookings: 12
    },
    { 
        id: 104, 
        title: "Alumni Networking Mixer", 
        date: "2025-03-20", 
        location: "Campus Rooftop Lounge", 
        category: "Networking", 
        description: "Connect with graduates working at top tech firms. Business casual attire recommended.",
        capacity: 80,
        currentBookings: 45
    },
    { 
        id: 105, 
        title: "Cybersecurity Essentials", 
        date: "2025-04-02", 
        location: "Room 302B", 
        category: "Seminars", 
        description: "Learn about ethical hacking, phishing protection, and securing your personal data.",
        capacity: 50,
        currentBookings: 10
    }
];
        localStorage.setItem('events', JSON.stringify(defaultEvents));
        return defaultEvents;
    },

    // Add this to handle capacity updates
    updateEvent: (updatedEvent: SchoolEvent): void => {
        const events = StorageService.getEvents();
        const index = events.findIndex(e => e.id === updatedEvent.id);
        if (index > -1) {
            events[index] = updatedEvent;
            localStorage.setItem('events', JSON.stringify(events));
        }
    },

    saveEvent: (event: SchoolEvent): void => {
        const events = StorageService.getEvents();
        events.push(event);
        localStorage.setItem('events', JSON.stringify(events));
    }
};