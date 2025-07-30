// Enhanced Cybersecurity Roadmap with Retention Features
let completedTasks = 0;
let totalTasks = 0;
let currentStreak = 0;
let studyTime = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    totalTasks = document.querySelectorAll('.task-checkbox').length;
    loadProgress();
    updateStats();
    updateProgressBars();
    initializeRetentionFeatures();
    
    // Open first phase by default
    const firstPhaseContent = document.querySelector('.phase-content');
    if (firstPhaseContent) {
        firstPhaseContent.style.display = 'block';
    }
    
    setupKeyboardShortcuts();
    addSearchBox();
    addStudyTimer();
    addFlashcardSystem();
    
    // Auto-save every 10 seconds
    setInterval(saveProgress, 10000);
    
    // Show welcome for new users
    if (!localStorage.getItem('cyber_roadmap_progress')) {
        setTimeout(showWelcome, 1000);
    }
});

// Enhanced progress loading with error handling
function loadProgress() {
    try {
        const saved = localStorage.getItem('cyber_roadmap_progress');
        const savedStreak = localStorage.getItem('cyber_study_streak');
        const savedTime = localStorage.getItem('cyber_study_time');
        
        if (saved) {
            const progress = JSON.parse(saved);
            completedTasks = 0;
            progress.forEach(taskId => {
                const checkbox = document.getElementById(taskId);
                if (checkbox) {
                    checkbox.classList.add('checked');
                    checkbox.innerHTML = '✓';
                    completedTasks++;
                }
            });
        }
        
        currentStreak = parseInt(savedStreak) || 0;
        studyTime = parseInt(savedTime) || 0;
        
        console.log(`Loaded progress: ${completedTasks}/${totalTasks} tasks completed`);
    } catch (error) {
        console.error('Error loading progress:', error);
        showNotification('Error loading saved progress', 'error');
    }
}

// Enhanced saving with verification
function saveProgress() {
    try {
        const checkedTasks = Array.from(document.querySelectorAll('.task-checkbox.checked'))
            .map(checkbox => {
                if (!checkbox.id) {
                    checkbox.id = 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                }
                return checkbox.id;
            })
            .filter(id => id);
        
        localStorage.setItem('cyber_roadmap_progress', JSON.stringify(checkedTasks));
        localStorage.setItem('cyber_study_streak', currentStreak.toString());
        localStorage.setItem('cyber_study_time', studyTime.toString());
        localStorage.setItem('cyber_last_save', new Date().toISOString());
        
        showSaveNotice();
        console.log(`Saved progress: ${checkedTasks.length} tasks completed`);
        
        // Verify save worked
        const verification = localStorage.getItem('cyber_roadmap_progress');
        if (!verification) {
            throw new Error('Save verification failed');
        }
        
    } catch (error) {
        console.error('Error saving progress:', error);
        showNotification('Failed to save progress. Try downloading backup.', 'error');
    }
}

// Enhanced task toggling with retention tracking
function toggleTask(checkbox) {
    if (!checkbox.id) {
        checkbox.id = 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    if (checkbox.classList.contains('checked')) {
        checkbox.classList.remove('checked');
        checkbox.innerHTML = '';
        completedTasks--;
    } else {
        checkbox.classList.add('checked');
        checkbox.innerHTML = '✓';
        completedTasks++;
        
        // Add to flashcard review
        addToFlashcardReview(checkbox);
        
        // Update streak
        updateStreak();
        
        // Show achievement
        if (isMilestone(checkbox)) {
            celebrateMilestone(checkbox);
        }
    }
    
    updateStats();
    updateProgressBars();
    saveProgress();
}

// Milestone detection for cybersecurity
function isMilestone(checkbox) {
    const taskTitle = checkbox.closest('.task-item').querySelector('.task-title').textContent;
    const milestones = [
        'Complete First CTF Challenge',
        'Complete OWASP Top 10',
        'Learn Metasploit Framework',
        'Complete First Full Machine',
        'Schedule Security+ Exam',
        'Apply for Entry-Level Security Jobs'
    ];
    
    return milestones.some(milestone => taskTitle.includes(milestone));
}

// Celebrate cybersecurity milestones
function celebrateMilestone(checkbox) {
    const taskTitle = checkbox.closest('.task-item').querySelector('.task-title').textContent;
    
    const celebration = document.createElement('div');
    celebration.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3em; margin-bottom: 15px;">🎯</div>
            <h2 style="color: white; margin-bottom: 10px;">Cybersecurity Milestone!</h2>
            <p style="color: rgba(255,255,255,0.9); font-size: 1.2em;">${taskTitle}</p>
            <p style="color: rgba(255,255,255,0.7); margin-top: 15px;">You're becoming a cyber defender! 🛡️</p>
        </div>
    `;
    
    celebration.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(30, 60, 114, 0.95), rgba(42, 82, 152, 0.95));
        z-index: 1001;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: milestoneAppear 3s ease-out forwards;
        backdrop-filter: blur(10px);
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes milestoneAppear {
            0% { opacity: 0; transform: scale(0.5); }
            15% { opacity: 1; transform: scale(1.05); }
            85% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.5); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        if (celebration.parentNode) celebration.parentNode.removeChild(celebration);
        if (style.parentNode) style.parentNode.removeChild(style);
    }, 3000);
}

// Update streak tracking
function updateStreak() {
    const lastActivity = localStorage.getItem('cyber_last_activity');
    const today = new Date().toDateString();
    
    if (lastActivity !== today) {
        currentStreak++;
        localStorage.setItem('cyber_last_activity', today);
        localStorage.setItem('cyber_study_streak', currentStreak.toString());
        
        if (currentStreak % 7 === 0) {
            showNotification(`🔥 ${currentStreak} day streak! You're on fire!`, 'success');
        }
    }
}

// Enhanced statistics with retention metrics
function updateStats() {
    const tasksDoneElement = document.getElementById('tasks-done');
    const streakElement = document.getElementById('study-streak');
    const timeElement = document.getElementById('study-time');
    const completionElement = document.getElementById('completion-percentage');
    
    if (tasksDoneElement) {
        tasksDoneElement.textContent = completedTasks;
    }
    
    if (streakElement) {
        streakElement.textContent = currentStreak;
    }
    
    if (timeElement) {
        const hours = Math.floor(studyTime / 60);
        const minutes = studyTime % 60;
        timeElement.textContent = `${hours}h ${minutes}m`;
    }
    
    if (completionElement) {
        const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        completionElement.textContent = percentage + '%';
    }
}

// Add study timer for retention
function addStudyTimer() {
    let timerRunning = false;
    let sessionMinutes = 0;
    let timerInterval;
    
    const timerDiv = document.createElement('div');
    timerDiv.innerHTML = `
        <div style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 10px; margin: 10px 0; text-align: center;">
            <h3 style="margin: 0 0 10px 0; color: #1e3c72;">🕐 Study Timer</h3>
            <div style="font-size: 1.5em; margin: 10px 0;" id="timer-display">00:00</div>
            <button onclick="toggleTimer()" id="timer-button" style="background: #1e3c72; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin: 0 5px;">Start</button>
            <button onclick="resetTimer()" style="background: #666; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin: 0 5px;">Reset</button>
        </div>
    `;
    
    const header = document.querySelector('.header');
    if (header) {
        header.appendChild(timerDiv);
    }
    
    // Timer functions
    window.toggleTimer = function() {
        const button = document.getElementById('timer-button');
        const display = document.getElementById('timer-display');
        
        if (!timerRunning) {
            timerRunning = true;
            button.textContent = 'Pause';
            button.style.background = '#e74c3c';
            
            timerInterval = setInterval(() => {
                sessionMinutes++;
                studyTime++;
                const minutes = Math.floor(sessionMinutes / 60);
                const seconds = sessionMinutes % 60;
                display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                // Auto-save study time
                if (sessionMinutes % 60 === 0) {
                    saveProgress();
                }
            }, 1000);
        } else {
            timerRunning = false;
            button.textContent = 'Start';
            button.style.background = '#1e3c72';
            clearInterval(timerInterval);
            saveProgress();
        }
    };
    
    window.resetTimer = function() {
        timerRunning = false;
        sessionMinutes = 0;
        clearInterval(timerInterval);
        document.getElementById('timer-display').textContent = '00:00';
        document.getElementById('timer-button').textContent = 'Start';
        document.getElementById('timer-button').style.background = '#1e3c72';
    };
}

// Flashcard system for retention
function addFlashcardSystem() {
    const flashcardData = {
        'CIA Triad': 'Confidentiality, Integrity, Availability - The three pillars of information security',
        'SQL Injection': 'A code injection technique that exploits vulnerabilities in database queries',
        'XSS': 'Cross-Site Scripting - Injecting malicious scripts into web applications',
        'Metasploit': 'A penetration testing framework for finding and exploiting vulnerabilities',
        'Nmap': 'Network Mapper - A tool for network discovery and security auditing',
        'OWASP Top 10': 'The ten most critical web application security risks',
        'Privilege Escalation': 'Gaining higher access rights than initially granted',
        'Social Engineering': 'Manipulating people to divulge confidential information',
        'SIEM': 'Security Information and Event Management - Centralized security monitoring',
        'Zero Day': 'A previously unknown vulnerability that has no available patch'
    };
    
    let currentCard = 0;
    let reviewCards = Object.keys(flashcardData);
    let showingAnswer = false;
    
    const flashcardDiv = document.createElement('div');
    flashcardDiv.innerHTML = `
        <div style="background: rgba(255,255,255,0.9); padding: 20px; border-radius: 15px; margin: 20px 0; text-align: center;">
            <h3 style="margin: 0 0 15px 0; color: #1e3c72;">🧠 Cybersecurity Flashcards</h3>
            <div id="flashcard" style="background: white; border: 2px solid #1e3c72; border-radius: 10px; padding: 20px; margin: 15px 0; min-height: 120px; display: flex; align-items: center; justify-content: center; cursor: pointer;" onclick="flipCard()">
                <div id="card-content" style="font-size: 1.2em; text-align: center;">Click to start reviewing!</div>
            </div>
            <div style="margin: 15px 0;">
                <button onclick="previousCard()" style="background: #666; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin: 0 5px;">← Previous</button>
                <span id="card-counter" style="margin: 0 15px; color: #666;">0/0</span>
                <button onclick="nextCard()" style="background: #1e3c72; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin: 0 5px;">Next →</button>
            </div>
            <div style="margin-top: 15px;">
                <button onclick="shuffleCards()" style="background: #27ae60; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">🔀 Shuffle</button>
                <button onclick="resetCards()" style="background: #e74c3c; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">🔄 Reset</button>
            </div>
        </div>
    `;
    
    const focusToday = document.querySelector('.focus-today');
    if (focusToday && focusToday.nextSibling) {
        focusToday.parentNode.insertBefore(flashcardDiv, focusToday.nextSibling);
    }
    
    // Flashcard functions
    window.flipCard = function() {
        const content = document.getElementById('card-content');
        const card = document.getElementById('flashcard');
        
        if (reviewCards.length === 0) {
            resetCards();
            return;
        }
        
        if (!showingAnswer) {
            content.innerHTML = `<strong style="color: #1e3c72;">${reviewCards[currentCard]}</strong>`;
            card.style.borderColor = '#1e3c72';
            showingAnswer = true;
        } else {
            content.innerHTML = `<div style="color: #666;">${flashcardData[reviewCards[currentCard]]}</div>`;
            card.style.borderColor = '#27ae60';
        }
        
        updateCardCounter();
    };
    
    window.nextCard = function() {
        currentCard = (currentCard + 1) % reviewCards.length;
        showingAnswer = false;
        document.getElementById('card-content').innerHTML = 'Click to see question';
        document.getElementById('flashcard').style.borderColor = '#1e3c72';
        updateCardCounter();
    };
    
    window.previousCard = function() {
        currentCard = currentCard === 0 ? reviewCards.length - 1 : currentCard - 1;
        showingAnswer = false;
        document.getElementById('card-content').innerHTML = 'Click to see question';
        document.getElementById('flashcard').style.borderColor = '#1e3c72';
        updateCardCounter();
    };
    
    window.shuffleCards = function() {
        reviewCards = Object.keys(flashcardData).sort(() => Math.random() - 0.5);
        currentCard = 0;
        showingAnswer = false;
        document.getElementById('card-content').innerHTML = 'Cards shuffled! Click to start.';
        updateCardCounter();
        showNotification('🔀 Flashcards shuffled for better retention!', 'success');
    };
    
    window.resetCards = function() {
        reviewCards = Object.keys(flashcardData);
        currentCard = 0;
        showingAnswer = false;
        document.getElementById('card-content').innerHTML = 'Click to start reviewing!';
        document.getElementById('flashcard').style.borderColor = '#1e3c72';
        updateCardCounter();
    };
    
    function updateCardCounter() {
        document.getElementById('card-counter').textContent = `${currentCard + 1}/${reviewCards.length}`;
    }
}

// Add flashcard review when tasks completed
function addToFlashcardReview(checkbox) {
    // This would add task-specific concepts to review
    const taskTitle = checkbox.closest('.task-item').querySelector('.task-title').textContent;
    // Could expand this to add task-specific flashcards
}

// Initialize retention features
function initializeRetentionFeatures() {
    // Add additional stats to the stats section if they don't exist
    const statsContainer = document.querySelector('.stats');
    if (statsContainer && !document.getElementById('study-streak')) {
        const additionalStats = document.createElement('div');
        additionalStats.className = 'stat-card';
        additionalStats.innerHTML = `
            <div class="stat-number" id="study-streak">${currentStreak}</div>
            <div class="stat-label">Day Streak</div>
        `;
        statsContainer.appendChild(additionalStats);
        
        const timeStats = document.createElement('div');
        timeStats.className = 'stat-card';
        timeStats.innerHTML = `
            <div class="stat-number" id="study-time">0h 0m</div>
            <div class="stat-label">Study Time</div>
        `;
        statsContainer.appendChild(timeStats);
    }
}

// Show welcome message
function showWelcome() {
    const welcome = document.createElement('div');
    welcome.innerHTML = `
        <div style="text-align: center; max-width: 500px;">
            <h2 style="color: #1e3c72; margin-bottom: 20px;">🛡️ Welcome to Cybersecurity!</h2>
            <p style="margin-bottom: 15px; line-height: 1.6;">You're starting a journey to become a cybersecurity professional!</p>
            <p style="margin-bottom: 20px; color: #666;">In 14 weeks, you'll be ready for Security+ certification and entry-level security jobs.</p>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: linear-gradient(45deg, #1e3c72, #2a5298); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                Start Hacking! 🎯
            </button>
        </div>
    `;
    
    welcome.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        backdrop-filter: blur(5px);
    `;
    
    const content = welcome.querySelector('div');
    content.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(welcome);
}

// Rest of the original functions (updateProgressBars, toggleWeek, togglePhase, etc.)
function updateProgressBars() {
    const weeks = document.querySelectorAll('.week');
    weeks.forEach(week => {
        const checkboxes = week.querySelectorAll('.task-checkbox');
        const checked = week.querySelectorAll('.task-checkbox.checked');
        const percentage = checkboxes.length > 0 ? (checked.length / checkboxes.length) * 100 : 0;
        const progressBar = week.querySelector('.progress-fill');
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
    });
}

function toggleWeek(header) {
    const week = header.closest('.week');
    if (week) {
        week.classList.toggle('expanded');
        setTimeout(() => updateProgressBars(), 100);
    }
}

function togglePhase(header) {
    const phase = header.closest('.phase');
    const content = phase.querySelector('.phase-content');
    if (content) {
        const isVisible = content.style.display === 'block';
        content.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            setTimeout(() => updateProgressBars(), 100);
        }
    }
}

function showSaveNotice() {
    const notice = document.getElementById('saveNotice');
    if (notice) {
        notice.classList.add('show');
        setTimeout(() => notice.classList.remove('show'), 2000);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: #27ae60;' : 
          type === 'error' ? 'background: #e74c3c;' : 'background: #1e3c72;'}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
    }, 3000);
}

// Export/Import functions
function downloadProgress() {
    try {
        const progress = {
            timestamp: new Date().toISOString(),
            roadmap_type: 'cybersecurity',
            version: '2.0',
            completed_tasks: completedTasks,
            total_tasks: totalTasks,
            study_streak: currentStreak,
            study_time: studyTime,
            completion_percentage: Math.round((completedTasks / totalTasks) * 100),
            progress_data: JSON.parse(localStorage.getItem('cyber_roadmap_progress') || '[]')
        };
        
        const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cybersecurity-progress-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('🛡️ Cybersecurity progress exported!', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Error exporting progress', 'error');
    }
}

function importProgress(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            if (imported.roadmap_type !== 'cybersecurity') {
                showNotification('Invalid file: Not a cybersecurity roadmap backup.', 'error');
                return;
            }
            
            // Clear current progress
            document.querySelectorAll('.task-checkbox.checked').forEach(checkbox => {
                checkbox.classList.remove('checked');
                checkbox.innerHTML = '';
            });
            
            // Load imported progress
            completedTasks = 0;
            if (imported.progress_data && Array.isArray(imported.progress_data)) {
                imported.progress_data.forEach(taskId => {
                    const checkbox = document.getElementById(taskId);
                    if (checkbox) {
                        checkbox.classList.add('checked');
                        checkbox.innerHTML = '✓';
                        completedTasks++;
                    }
                });
            }
            
            currentStreak = imported.study_streak || 0;
            studyTime = imported.study_time || 0;
            
            saveProgress();
            updateStats();
            updateProgressBars();
            
            showNotification(`🛡️ Progress imported! ${completedTasks} tasks completed.`, 'success');
            
        } catch (error) {
            console.error('Import error:', error);
            showNotification('Error importing file. Check file format.', 'error');
        }
    };
    
    reader.readAsText(file);
    event.target.value = '';
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1': case '2': case '3': case '4':
                    e.preventDefault();
                    togglePhaseByIndex(parseInt(e.key) - 1);
                    break;
                case 's':
                    e.preventDefault();
                    saveProgress();
                    showNotification('Progress saved!', 'success');
                    break;
                case 'e':
                    e.preventDefault();
                    downloadProgress();
                    break;
            }
        }
    });
}

function togglePhaseByIndex(index) {
    const phases = document.querySelectorAll('.phase-header');
    if (phases[index]) {
        togglePhase(phases[index]);
    }
}

function addSearchBox() {
    const header = document.querySelector('.header');
    if (header && !header.querySelector('input[type="text"]')) {
        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = 'margin-top: 20px;';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '🔍 Search cybersecurity topics...';
        searchInput.style.cssText = `
            width: 100%;
            max-width: 400px;
            padding: 12px 20px;
            border: 2px solid #ddd;
            border-radius: 25px;
            font-size: 16px;
            outline: none;
            transition: border-color 0.3s ease;
        `;
        
        searchInput.addEventListener('focus', () => {
            searchInput.style.borderColor = '#1e3c72';
        });
        
        searchInput.addEventListener('blur', () => {
            searchInput.style.borderColor = '#ddd';
        });
        
        searchInput.addEventListener('input', (e) => {
            searchTasks(e.target.value);
        });
        
        searchContainer.appendChild(searchInput);
        header.appendChild(searchContainer);
    }
}

function searchTasks(query) {
    const tasks = document.querySelectorAll('.task-item');
    const weeks = document.querySelectorAll('.week');
    
    if (!query.trim()) {
        tasks.forEach(task => task.style.display = 'flex');
        weeks.forEach(week => week.style.display = 'block');
        return;
    }
    
    const searchTerm = query.toLowerCase();
    let visibleWeeks = new Set();
    
    tasks.forEach(task => {
        const title = task.querySelector('.task-title').textContent.toLowerCase();
        const desc = task.querySelector('.task-desc').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || desc.includes(searchTerm)) {
            task.style.display = 'flex';
            const week = task.closest('.week');
            if (week) {
                visibleWeeks.add(week);
            }
        } else {
            task.style.display = 'none';
        }
    });
    
    weeks.forEach(week => {
        if (visibleWeeks.has(week)) {
            week.style.display = 'block';
            week.classList.add('expanded');
        } else {
            week.style.display = 'none';
        }
    });
}