// Flashcard data
const flashcardData = {
    ai: [
        { question: "What is Machine Learning?", answer: "A subset of AI that enables computers to learn and make decisions from data without being explicitly programmed for every task." },
        { question: "What's the difference between supervised and unsupervised learning?", answer: "Supervised learning uses labeled data to train models (like email spam detection), while unsupervised learning finds patterns in unlabeled data (like customer segmentation)." },
        { question: "What is a Neural Network?", answer: "A computing system inspired by biological neural networks, consisting of interconnected nodes (neurons) that process information in layers to recognize patterns." },
        { question: "Explain overfitting in machine learning", answer: "When a model learns the training data too well, including noise and outliers, making it perform poorly on new, unseen data." },
        { question: "What is TensorFlow?", answer: "An open-source machine learning framework developed by Google, used for building and training neural networks and deep learning models." },
        { question: "What are the main Python libraries for data science?", answer: "NumPy (numerical computing), Pandas (data manipulation), Matplotlib/Seaborn (visualization), and Scikit-learn (machine learning)." },
        // Add more AI cards...
    ],
    security: [
        { question: "What is the CIA Triad?", answer: "The fundamental security principles: Confidentiality (data privacy), Integrity (data accuracy), and Availability (system accessibility)." },
        { question: "What is SQL Injection?", answer: "A web security vulnerability where attackers insert malicious SQL code into application queries to access or manipulate database data." },
        { question: "Explain Cross-Site Scripting (XSS)", answer: "A vulnerability where attackers inject malicious scripts into web pages viewed by other users, potentially stealing session cookies or redirecting users." },
        // Add more security cards...
    ],
    advanced: [
        { question: "What is DevSecOps?", answer: "Integrating security practices into the DevOps pipeline, making security a shared responsibility throughout the software development lifecycle." },
        { question: "What is federated learning?", answer: "A machine learning approach where models are trained across decentralized data sources without sharing raw data, preserving privacy." },
        // Add more advanced cards...
    ]
};

let currentFlashcardSet = null;
let currentCardIndex = 0;
let isFlipped = false;

// Initialize progress tracking
function initializeProgress() {
    const saved = localStorage.getItem('learningProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        document.querySelectorAll('.task-checkbox').forEach((checkbox, index) => {
            if (progress.tasks && progress.tasks[index]) {
                checkbox.checked = true;
            }
        });
        updateProgress();
    }
}

// Save progress
function saveProgress() {
    const checkboxes = document.querySelectorAll('.task-checkbox');
    const tasks = Array.from(checkboxes).map(cb => cb.checked);
    const progress = { tasks };
    localStorage.setItem('learningProgress', JSON.stringify(progress));
    showSaveNotification();
}

// Show save notification
function showSaveNotification() {
    const notification = document.getElementById('saveNotification');
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

// Update progress stats
function updateProgress() {
    saveProgress();
    
    const aiTasks = document.querySelectorAll('#ai .task-checkbox');
    const securityTasks = document.querySelectorAll('#security .task-checkbox');
    
    const aiCompleted = Array.from(aiTasks).filter(cb => cb.checked).length;
    const securityCompleted = Array.from(securityTasks).filter(cb => cb.checked).length;
    
    const aiTotal = aiTasks.length;
    const securityTotal = securityTasks.length;
    
    document.getElementById('aiProgress').textContent = aiCompleted;
    document.getElementById('securityProgress').textContent = securityCompleted;
    
    const aiPercentage = aiTotal > 0 ? (aiCompleted / aiTotal) * 100 : 0;
    const securityPercentage = securityTotal > 0 ? (securityCompleted / securityTotal) * 100 : 0;
    
    document.getElementById('aiProgressBar').style.width = aiPercentage + '%';
    document.getElementById('securityProgressBar').style.width = securityPercentage + '%';
}

// Switch tabs
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Toggle week content
function toggleWeek(weekId) {
    const content = document.getElementById(weekId);
    const isActive = content.classList.contains('active');
    
    // Close all weeks
    document.querySelectorAll('.week-content').forEach(week => {
        week.classList.remove('active');
    });
    
    // Open clicked week if it wasn't active
    if (!isActive) {
        content.classList.add('active');
    }
}

// Flashcard functions
function startFlashcards(setName) {
    currentFlashcardSet = flashcardData[setName];
    currentCardIndex = 0;
    isFlipped = false;
    
    const container = document.getElementById('flashcardContainer');
    container.style.display = 'block';
    
    document.querySelectorAll('.flashcard-set').forEach(set => set.style.display = 'none');
    
    showCurrentCard();
}

function showCurrentCard() {
    if (!currentFlashcardSet) return;
    
    const card = currentFlashcardSet[currentCardIndex];
    const flashcard = document.getElementById('flashcard');
    const cardContent = document.getElementById('cardContent');
    const cardCounter = document.getElementById('cardCounter');
    const cardButtons = document.getElementById('cardButtons');
    
    cardContent.textContent = card.question;
    cardCounter.textContent = `Card ${currentCardIndex + 1} of ${currentFlashcardSet.length}`;
    
    flashcard.classList.remove('flipped');
    cardButtons.classList.remove('show');
    isFlipped = false;
}

function flipCard() {
    if (!currentFlashcardSet) return;
    
    const card = currentFlashcardSet[currentCardIndex];
    const flashcard = document.getElementById('flashcard');
    const cardContent = document.getElementById('cardContent');
    const cardButtons = document.getElementById('cardButtons');
    
    if (!isFlipped) {
        cardContent.textContent = card.answer;
        flashcard.classList.add('flipped');
        cardButtons.classList.add('show');
        isFlipped = true;
    }
}

function rateCard(difficulty) {
    currentCardIndex++;
    
    if (currentCardIndex >= currentFlashcardSet.length) {
        // End of set
        alert('🎉 Great job! You completed this flashcard set. Keep up the excellent work!');
        document.getElementById('flashcardContainer').style.display = 'none';
        document.querySelectorAll('.flashcard-set').forEach(set => set.style.display = 'block');
        currentFlashcardSet = null;
    } else {
        showCurrentCard();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                switchTab('ai');
                break;
            case '2':
                e.preventDefault();
                switchTab('security');
                break;
            case '3':
                e.preventDefault();
                switchTab('portfolio');
                break;
        }
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeProgress();
    updateProgress();
});