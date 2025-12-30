export type Category = 'Conferences' | 'Workshops' | 'Sports' | 'Networking' | 'Seminars';

export interface SchoolEvent {
    id: number;
    title: string;
    date: string;
    location: string;
    category: Category;
    description: string;
    capacity: number;         // NEW: Total seats available
    currentBookings: number;  // NEW: Number of people registered
}
export interface User {
    fullName: string; // Standardized key
    email: string;
    bookedEvents: number[]; 
    isAdmin: boolean;
}