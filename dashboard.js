// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD8r6mmkOSAtUUvTFib_0sw2u3FRcdwAsA",
    authDomain: "optional-25cd8.firebaseapp.com",
    projectId: "optional-25cd8",
    storageBucket: "optional-25cd8.firebasestorage.app",
    messagingSenderId: "232340431847",
    appId: "1:232340431847:web:191ada6ed1d393d66f5342",
    measurementId: "G-HQVLL3SN9H"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM Elements
const logoutBtn = document.getElementById('logout-btn');

// Check authentication state
auth.onAuthStateChanged((user) => {
    if (!user) {
        // If not logged in, redirect to login page
        window.location.href = 'index.html';
    }
});

// Logout function
logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Error signing out: ', error);
    });
});

// Create animated background particles
function createParticles() {
    const body = document.querySelector('body');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 20 + 5;
        const posX = Math.random() * window.innerWidth;
        const delay = Math.random() * 10;
        const duration = Math.random() * 20 + 10;
        
        // Apply styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.bottom = '-50px';
        particle.style.animation = `float ${duration}s linear ${delay}s infinite`;
        
        body.appendChild(particle);
    }
}

// Initialize particles on load
window.addEventListener('DOMContentLoaded', createParticles);