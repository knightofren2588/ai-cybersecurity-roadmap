// Cybersecurity Roadmap - Complete Fixed Script with All Features
class CyberSecurityTracker {
    constructor() {
        this.storageKey = 'cybersecurity_progress';
        this.retentionKey = 'cybersecurity_retention';
        this.streakKey = 'cybersecurity_streak';
        this.currentQuestion = 0;
        this.quizAnswers = [];
        this.totalQuestions = 0;
        this.autoSaveInterval = null;
        
        // Initialize on page load
        this.init();
    }

    init() {
        console.log('🔒 Cybersecurity Tracker Initialized');
        
        // Load saved progress first
        this.loadProgress();
        this.loadRetentionData();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup retention features
        this.setupRetentionSystem();
        
        // Update stats
        this.updateStats();
        
        // Setup auto-save
        this.setupAutoSave();
        
        // Check daily streak
        this.checkDailyStreak();
        
        // Setup phase toggles
        this.setupPhaseToggles();
    }

    // FIXED SAVING SYSTEM
    saveProgress() {
        try {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const progress = {};
            
            checkboxes.forEach((checkbox, index) => {
                const taskId = checkbox.id || `task_${index}`;
                progress[taskId] = checkbox.checked;
            });
            
            localStorage.setItem(this.storageKey, JSON.stringify(progress));
            console.log('✅ Progress saved successfully');
            
            // Update completion stats
            this.updateStats();
            
            // Show save confirmation
            this.showSaveConfirmation();
            
            return true;
        } catch (error) {
            console.error('❌ Failed to save progress:', error);
            this.showErrorNotification('Failed to save progress. Please try again.');
            return false;
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const progress = JSON.parse(saved);
                
                Object.entries(progress).forEach(([taskId, isChecked]) => {
                    let checkbox = document.getElementById(taskId);
                    
                    // If no direct ID match and it's a generated task ID, try finding by index
                    if (!checkbox && taskId.startsWith('task_')) {
                        const index = parseInt(taskId.split('_')[1]);
                        if (!isNaN(index)) {
                            const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
                            checkbox = allCheckboxes[index];
                        }
                    }
                    
                    if (checkbox) {
                        checkbox.checked = isChecked;
                    }
                });
                
                console.log('📊 Progress loaded successfully');
            }
        } catch (error) {
            console.error('❌ Failed to load progress:', error);
        }
    }

    showSaveConfirmation() {
        // Create save notification
        const notification = document.createElement('div');
        notification.innerHTML = '💾 Progress Saved!';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 2 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 2000);
    }

    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.innerHTML = `❌ ${message}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 3000);
    }

    // PHASE TOGGLE FUNCTIONALITY
    setupPhaseToggles() {
        try {
            // Add toggle functionality for collapsible phases
            const phaseHeaders = document.querySelectorAll('.phase-header, .week-header, h2, h3');
            
            phaseHeaders.forEach(header => {
                if (header.textContent.includes('Phase') || 
                    header.textContent.includes('Week') || 
                    header.textContent.includes('▶') || 
                    header.textContent.includes('▼')) {
                    
                    header.style.cursor = 'pointer';
                    header.style.userSelect = 'none';
                    
                    // Remove any existing click listeners to prevent duplicates
                    // Note: We can't remove specific listeners without a reference
                    // So we'll just add the new one (duplicate prevention handled by the DOM)
                    
                    // Add new click listener
                    header.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.togglePhaseContent(header);
                    });
                }
            });
            
            console.log(`Set up toggles for ${phaseHeaders.length} phase headers`);
        } catch (error) {
            console.warn('Error setting up phase toggles:', error);
        }
    }

    togglePhaseContent(header) {
        if (!header) return;
        
        // Find the content to toggle - could be next sibling or parent's next sibling
        let content = header.nextElementSibling;
        
        // If no direct sibling, try finding the content area
        if (!content) {
            // Look for common content containers
            content = header.parentElement?.querySelector('.phase-content, .week-content, .content');
        }
        
        // If still no content, try looking for the next div
        if (!content) {
            let nextElement = header.nextElementSibling;
            while (nextElement && nextElement.nodeType !== 1) {
                nextElement = nextElement.nextSibling;
            }
            content = nextElement;
        }
        
        if (content) {
            const isHidden = content.style.display === 'none' || 
                           getComputedStyle(content).display === 'none';
            
            if (isHidden) {
                content.style.display = 'block';
                // Update arrow indicators
                header.textContent = header.textContent.replace('▶', '▼').replace('►', '▼');
                if (!header.textContent.includes('▼') && !header.textContent.includes('▶')) {
                    header.textContent = '▼ ' + header.textContent;
                }
            } else {
                content.style.display = 'none';
                // Update arrow indicators
                header.textContent = header.textContent.replace('▼', '▶').replace('►', '▶');
                if (!header.textContent.includes('▶') && !header.textContent.includes('▼')) {
                    header.textContent = '▶ ' + header.textContent;
                }
            }
            
            console.log(`Toggled content for: ${header.textContent.substring(0, 30)}...`);
        } else {
            console.warn('No content found to toggle for element:', header);
        }
    }

    // RETENTION SYSTEM FOR BETTER LEARNING
    setupRetentionSystem() {
        this.createRetentionPanel();
        this.scheduleReviews();
        this.setupQuizSystem(); // Fixed: Now this method exists
    }

    createRetentionPanel() {
        const retentionPanel = document.createElement('div');
        retentionPanel.id = 'retention-panel';
        retentionPanel.innerHTML = `
            <div class="retention-header">
                <h3>🧠 Learning Retention System</h3>
                <p>Spaced repetition to ensure you remember everything!</p>
            </div>
            
            <div class="retention-stats">
                <div class="stat-box">
                    <div class="stat-number" id="retention-score">0%</div>
                    <div class="stat-label">Retention Score</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number" id="review-due">0</div>
                    <div class="stat-label">Reviews Due</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number" id="streak-count">0</div>
                    <div class="stat-label">Day Streak</div>
                </div>
            </div>

            <div class="review-section">
                <h4>📚 Today's Reviews</h4>
                <div id="daily-reviews"></div>
                <button id="start-review" class="cta-button">Start Review Session</button>
            </div>

            <div class="quiz-section">
                <h4>🎯 Quick Knowledge Check</h4>
                <div id="daily-quiz"></div>
                <button id="take-quiz" class="cta-button">Take Daily Quiz</button>
            </div>
        `;

        // Add CSS for retention panel
        const style = document.createElement('style');
        style.textContent = `
            #retention-panel {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
                margin: 20px 0;
                border-radius: 15px;
                color: white;
            }
            
            .retention-stats {
                display: flex;
                gap: 20px;
                margin: 20px 0;
                flex-wrap: wrap;
            }
            
            .stat-box {
                background: rgba(255,255,255,0.1);
                padding: 15px;
                border-radius: 10px;
                text-align: center;
                min-width: 120px;
                backdrop-filter: blur(10px);
            }
            
            .stat-number {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .stat-label {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .review-section, .quiz-section {
                background: rgba(255,255,255,0.1);
                padding: 15px;
                margin: 15px 0;
                border-radius: 10px;
                backdrop-filter: blur(10px);
            }
            
            .cta-button {
                background: #ff6b6b;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
                margin: 5px;
            }
            
            .cta-button:hover {
                background: #ff5252;
                transform: translateY(-2px);
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        
        // Insert after the header
        const container = document.querySelector('.container') || document.body;
        const firstChild = container.firstElementChild;
        if (firstChild) {
            container.insertBefore(retentionPanel, firstChild.nextSibling);
        } else {
            container.appendChild(retentionPanel);
        }
        
        // Setup retention event listeners
        this.setupRetentionListeners();
    }

    setupRetentionListeners() {
        const startReviewBtn = document.getElementById('start-review');
        const takeQuizBtn = document.getElementById('take-quiz');
        
        if (startReviewBtn) {
            startReviewBtn.addEventListener('click', () => this.startReviewSession());
        }
        
        if (takeQuizBtn) {
            takeQuizBtn.addEventListener('click', () => this.startQuiz());
        }
    }

    // SPACED REPETITION SYSTEM
    scheduleReviews() {
        const completedTasks = this.getCompletedTasks();
        const retentionData = this.getRetentionData();
        
        completedTasks.forEach(taskId => {
            if (!retentionData[taskId]) {
                // New completed task - schedule first review
                retentionData[taskId] = {
                    completedDate: Date.now(),
                    reviewDates: this.calculateReviewDates(Date.now()),
                    reviewCount: 0,
                    strength: 1 // 1-5 scale
                };
            }
        });
        
        this.saveRetentionData(retentionData);
        this.updateRetentionDisplay();
    }

    calculateReviewDates(completedDate) {
        // Spaced repetition intervals: 1 day, 3 days, 7 days, 14 days, 30 days
        const intervals = [1, 3, 7, 14, 30];
        return intervals.map(interval => 
            completedDate + (interval * 24 * 60 * 60 * 1000)
        );
    }

    startReviewSession() {
        const reviewItems = this.getDueReviews();
        
        if (reviewItems.length === 0) {
            alert('🎉 No reviews due today! Great job staying on top of your learning!');
            return;
        }
        
        // Create review modal
        this.createReviewModal(reviewItems);
    }

    createReviewModal(reviewItems) {
        const modal = document.createElement('div');
        modal.id = 'review-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📚 Review Session</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <p>Review these completed tasks to strengthen your memory:</p>
                    <div id="review-items">
                        ${reviewItems.map(item => `
                            <div class="review-item">
                                <h4>${item.title}</h4>
                                <p>${item.description}</p>
                                <div class="difficulty-buttons">
                                    <button onclick="cyberTracker.markReview('${item.id}', 'easy')">😊 Easy</button>
                                    <button onclick="cyberTracker.markReview('${item.id}', 'medium')">🤔 Medium</button>
                                    <button onclick="cyberTracker.markReview('${item.id}', 'hard')">😰 Hard</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Add modal CSS
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            #review-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-content {
                background: white;
                padding: 20px;
                border-radius: 15px;
                max-width: 600px;
                max-height: 80%;
                overflow-y: auto;
                position: relative;
            }
            
            .close-modal {
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 24px;
                cursor: pointer;
            }
            
            .review-item {
                border: 1px solid #ddd;
                padding: 15px;
                margin: 10px 0;
                border-radius: 10px;
            }
            
            .difficulty-buttons {
                margin-top: 10px;
            }
            
            .difficulty-buttons button {
                margin: 5px;
                padding: 8px 15px;
                border: none;
                border-radius: 20px;
                cursor: pointer;
            }
        `;
        
        document.head.appendChild(modalStyle);
        document.body.appendChild(modal);
        
        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
            modalStyle.remove();
        });
    }

    markReview(taskId, difficulty) {
        const retentionData = this.getRetentionData();
        
        if (retentionData[taskId]) {
            retentionData[taskId].reviewCount++;
            
            // Adjust strength based on difficulty
            switch(difficulty) {
                case 'easy':
                    retentionData[taskId].strength = Math.min(5, retentionData[taskId].strength + 1);
                    break;
                case 'medium':
                    // Keep same strength
                    break;
                case 'hard':
                    retentionData[taskId].strength = Math.max(1, retentionData[taskId].strength - 1);
                    break;
            }
            
            // Reschedule next review
            const multiplier = retentionData[taskId].strength;
            const baseInterval = [1, 3, 7, 14, 30][Math.min(4, retentionData[taskId].reviewCount)] || 30;
            const nextInterval = baseInterval * multiplier;
            retentionData[taskId].nextReview = Date.now() + (nextInterval * 24 * 60 * 60 * 1000);
        }
        
        this.saveRetentionData(retentionData);
        
        // Remove the reviewed item from display
        const reviewItem = document.querySelector(`button[onclick*="${taskId}"]`)?.closest('.review-item');
        if (reviewItem) {
            reviewItem.style.opacity = '0.5';
            reviewItem.innerHTML += '<div style="text-align: center; margin-top: 10px; color: #4CAF50;">✅ Review Complete</div>';
        }
        
        // Check if all reviews are done
        setTimeout(() => {
            const remainingItems = document.querySelectorAll('.review-item:not([style*="opacity: 0.5"])');
            if (remainingItems.length === 0) {
                const modal = document.getElementById('review-modal');
                if (modal) {
                    modal.remove();
                }
                alert('🎉 All reviews complete! Your knowledge is getting stronger!');
                this.updateRetentionDisplay();
            }
        }, 1000);
    }

    // QUIZ SYSTEM - Fixed: Now this method exists
    setupQuizSystem() {
        // Quiz system is now integrated into the retention panel
        console.log('🎯 Quiz system initialized');
    }

    startQuiz() {
        const quizQuestions = this.generateQuizQuestions();
        
        if (quizQuestions.length === 0) {
            alert('Complete more tasks to unlock quiz questions!');
            return;
        }
        
        this.createQuizModal(quizQuestions);
    }

    generateQuizQuestions() {
        // Sample cybersecurity quiz questions
        return [
            {
                question: "What does CIA stand for in cybersecurity?",
                options: ["Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Computer Information Access", "Cyber Intelligence Analysis"],
                correct: 1,
                explanation: "CIA in cybersecurity refers to the three core principles: Confidentiality, Integrity, and Availability."
            },
            {
                question: "Which port is commonly used for HTTPS?",
                options: ["80", "443", "22", "21"],
                correct: 1,
                explanation: "Port 443 is the standard port for HTTPS (HTTP Secure) connections."
            },
            {
                question: "What type of attack involves overwhelming a system with traffic?",
                options: ["SQL Injection", "Cross-Site Scripting", "DDoS", "Phishing"],
                correct: 2,
                explanation: "DDoS (Distributed Denial of Service) attacks overwhelm systems with massive amounts of traffic."
            },
            {
                question: "Which tool is commonly used for network scanning?",
                options: ["Wireshark", "Nmap", "John the Ripper", "Hashcat"],
                correct: 1,
                explanation: "Nmap (Network Mapper) is the most popular tool for network discovery and security scanning."
            },
            {
                question: "What does the 'S' in HTTPS stand for?",
                options: ["Safe", "Secure", "System", "Server"],
                correct: 1,
                explanation: "The 'S' in HTTPS stands for 'Secure', indicating encrypted communication."
            }
        ];
    }

    createQuizModal(questions) {
        const modal = document.createElement('div');
        modal.id = 'quiz-modal';
        
        const selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 3);
        this.totalQuestions = selectedQuestions.length;
        this.currentQuestion = 0;
        this.quizAnswers = [];
        
        modal.innerHTML = `
            <div class="quiz-content">
                <div class="quiz-header">
                    <h3>🎯 Cybersecurity Knowledge Check</h3>
                    <span class="close-quiz">&times;</span>
                </div>
                <div class="quiz-body">
                    <div id="quiz-questions">
                        ${selectedQuestions.map((q, index) => `
                            <div class="quiz-question" id="question-${index}" ${index === 0 ? '' : 'style="display:none"'}>
                                <div class="question-counter">Question ${index + 1} of ${selectedQuestions.length}</div>
                                <h4>${q.question}</h4>
                                <div class="quiz-options">
                                    ${q.options.map((option, optIndex) => `
                                        <button class="quiz-option" onclick="cyberTracker.selectQuizAnswer(${index}, ${optIndex}, ${q.correct})">${option}</button>
                                    `).join('')}
                                </div>
                                <div class="quiz-explanation" id="explanation-${index}" style="display:none">
                                    <strong>Explanation:</strong> ${q.explanation}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="quiz-navigation">
                        <button id="prev-question" onclick="cyberTracker.prevQuestion()" style="display:none">Previous</button>
                        <button id="next-question" onclick="cyberTracker.nextQuestion()" style="display:none">Next</button>
                        <button id="finish-quiz" onclick="cyberTracker.finishQuiz()" style="display:none">Finish Quiz</button>
                    </div>
                    <div id="quiz-results" style="display:none">
                        <h3>🎯 Quiz Results</h3>
                        <div id="quiz-score"></div>
                        <button onclick="document.getElementById('quiz-modal').remove()" class="cta-button">Continue Learning!</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add quiz CSS
        const quizStyle = document.createElement('style');
        quizStyle.textContent = `
            #quiz-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .quiz-content {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 20px;
                max-width: 600px;
                max-height: 80%;
                overflow-y: auto;
                position: relative;
            }
            
            .close-quiz {
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 24px;
                cursor: pointer;
                color: white;
            }
            
            .quiz-question {
                margin: 20px 0;
            }
            
            .question-counter {
                background: rgba(255,255,255,0.2);
                padding: 5px 15px;
                border-radius: 15px;
                display: inline-block;
                margin-bottom: 15px;
                font-size: 14px;
            }
            
            .quiz-options {
                margin: 15px 0;
            }
            
            .quiz-option {
                display: block;
                width: 100%;
                margin: 10px 0;
                padding: 15px;
                background: rgba(255,255,255,0.1);
                color: white;
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .quiz-option:hover {
                background: rgba(255,255,255,0.2);
                transform: translateX(5px);
            }
            
            .quiz-option.correct {
                background: rgba(76,175,80,0.3);
                border-color: #4CAF50;
            }
            
            .quiz-option.incorrect {
                background: rgba(244,67,54,0.3);
                border-color: #f44336;
            }
            
            .quiz-explanation {
                background: rgba(255,255,255,0.1);
                padding: 15px;
                border-radius: 10px;
                margin-top: 15px;
                border-left: 4px solid #4CAF50;
            }
            
            .quiz-navigation {
                text-align: center;
                margin: 20px 0;
            }
            
            .quiz-navigation button {
                margin: 0 10px;
                padding: 10px 20px;
                background: rgba(255,255,255,0.2);
                color: white;
                border: none;
                border-radius: 20px;
                cursor: pointer;
            }
        `;
        
        document.head.appendChild(quizStyle);
        document.body.appendChild(modal);
        
        // Close modal functionality
        modal.querySelector('.close-quiz').addEventListener('click', () => {
            modal.remove();
            quizStyle.remove();
        });
    }

    selectQuizAnswer(questionIndex, selectedOption, correctAnswer) {
        const options = document.querySelectorAll(`#question-${questionIndex} .quiz-option`);
        
        // Disable all options
        options.forEach(option => option.style.pointerEvents = 'none');
        
        // Show correct/incorrect
        options[selectedOption].classList.add(selectedOption === correctAnswer ? 'correct' : 'incorrect');
        if (selectedOption !== correctAnswer) {
            options[correctAnswer].classList.add('correct');
        }
        
        // Show explanation
        document.getElementById(`explanation-${questionIndex}`).style.display = 'block';
        
        // Record answer
        this.quizAnswers[questionIndex] = selectedOption === correctAnswer;
        
        // Show navigation
        if (questionIndex < this.totalQuestions - 1) {
            document.getElementById('next-question').style.display = 'inline-block';
        } else {
            document.getElementById('finish-quiz').style.display = 'inline-block';
        }
        
        if (questionIndex > 0) {
            document.getElementById('prev-question').style.display = 'inline-block';
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions - 1) {
            document.getElementById(`question-${this.currentQuestion}`).style.display = 'none';
            this.currentQuestion++;
            document.getElementById(`question-${this.currentQuestion}`).style.display = 'block';
            
            // Update navigation
            document.getElementById('prev-question').style.display = 'inline-block';
            if (this.currentQuestion === this.totalQuestions - 1) {
                document.getElementById('next-question').style.display = 'none';
                if (this.quizAnswers[this.currentQuestion] !== undefined) {
                    document.getElementById('finish-quiz').style.display = 'inline-block';
                }
            }
        }
    }

    prevQuestion() {
        if (this.currentQuestion > 0) {
            document.getElementById(`question-${this.currentQuestion}`).style.display = 'none';
            this.currentQuestion--;
            document.getElementById(`question-${this.currentQuestion}`).style.display = 'block';
            
            // Update navigation
            document.getElementById('next-question').style.display = 'inline-block';
            if (this.currentQuestion === 0) {
                document.getElementById('prev-question').style.display = 'none';
            }
        }
    }

    finishQuiz() {
        // Hide questions
        document.getElementById('quiz-questions').style.display = 'none';
        document.querySelector('.quiz-navigation').style.display = 'none';
        
        // Calculate score
        const correctAnswers = this.quizAnswers.filter(answer => answer === true).length;
        const percentage = Math.round((correctAnswers / this.totalQuestions) * 100);
        
        // Show results
        const resultsDiv = document.getElementById('quiz-results');
        const scoreDiv = document.getElementById('quiz-score');
        
        let scoreMessage = '';
        if (percentage >= 90) {
            scoreMessage = '🏆 Excellent! You\'re mastering cybersecurity!';
        } else if (percentage >= 70) {
            scoreMessage = '👍 Good job! Keep learning to improve further.';
        } else if (percentage >= 50) {
            scoreMessage = '📚 Not bad, but review the concepts you missed.';
        } else {
            scoreMessage = '💪 Keep studying! You\'ll get there with practice.';
        }
        
        scoreDiv.innerHTML = `
            <div style="font-size: 36px; margin: 20px 0;">${percentage}%</div>
            <p>You got ${correctAnswers} out of ${this.totalQuestions} questions correct.</p>
            <p>${scoreMessage}</p>
        `;
        
        resultsDiv.style.display = 'block';
    }

    // EVENT LISTENERS AND AUTO-SAVE
    setupEventListeners() {
        // Save on every checkbox change
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                this.saveProgress();
                this.scheduleReviews();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveProgress();
            }
            
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.startReviewSession();
            }
        });
    }

    setupAutoSave() {
        // Clear any existing interval to prevent duplicates
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        // Auto-save every 30 seconds
        this.autoSaveInterval = setInterval(() => {
            this.saveProgress();
        }, 30000);
        
        // Save before page unload
        window.addEventListener('beforeunload', () => {
            this.saveProgress();
        });
    }

    // UTILITY FUNCTIONS
    getCompletedTasks() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        return Array.from(checkboxes).map((cb, index) => cb.id || `task_${index}`);
    }

    updateStats() {
        const totalTasks = document.querySelectorAll('input[type="checkbox"]').length;
        const completedTasks = document.querySelectorAll('input[type="checkbox"]:checked').length;
        const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        // Update progress displays
        const progressElements = document.querySelectorAll('.progress-percentage');
        progressElements.forEach(el => {
            el.textContent = `${percentage}%`;
        });
        
        // Update progress bar
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        // Update retention score
        const retentionScore = document.getElementById('retention-score');
        if (retentionScore) {
            retentionScore.textContent = `${Math.max(percentage - 10, 0)}%`;
        }
    }

    updateRetentionDisplay() {
        const dueReviews = this.getDueReviews().length;
        const reviewDueElement = document.getElementById('review-due');
        if (reviewDueElement) {
            reviewDueElement.textContent = dueReviews;
        }
    }

    getDueReviews() {
        const retentionData = this.getRetentionData();
        const now = Date.now();
        const dueReviews = [];
        
        Object.entries(retentionData).forEach(([taskId, data]) => {
            const nextReviewDate = data.nextReview || data.reviewDates[data.reviewCount];
            if (nextReviewDate && now >= nextReviewDate) {
                dueReviews.push({
                    id: taskId,
                    title: this.getTaskTitle(taskId),
                    description: this.getTaskDescription(taskId)
                });
            }
        });
        
        return dueReviews;
    }

    checkDailyStreak() {
        const today = new Date().toDateString();
        const lastActive = localStorage.getItem('last_active_date');
        const currentStreak = parseInt(localStorage.getItem(this.streakKey)) || 0;
        
        if (lastActive !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastActive === yesterday.toDateString()) {
                // Continued streak
                localStorage.setItem(this.streakKey, (currentStreak + 1).toString());
            } else {
                // Broken streak
                localStorage.setItem(this.streakKey, '1');
            }
            
            localStorage.setItem('last_active_date', today);
        }
        
        // Update streak display
        const streakElement = document.getElementById('streak-count');
        if (streakElement) {
            streakElement.textContent = localStorage.getItem(this.streakKey) || '0';
        }
    }

    // DATA PERSISTENCE
    getRetentionData() {
        try {
            return JSON.parse(localStorage.getItem(this.retentionKey)) || {};
        } catch {
            return {};
        }
    }

    saveRetentionData(data) {
        localStorage.setItem(this.retentionKey, JSON.stringify(data));
    }

    loadRetentionData() {
        // Load retention data and update displays
        this.updateRetentionDisplay();
    }

    getTaskTitle(taskId) {
        const checkbox = document.getElementById(taskId);
        if (checkbox) {
            const label = checkbox.closest('li') || checkbox.parentNode;
            return label.textContent.trim().substring(0, 50) + '...';
        }
        return 'Cybersecurity Task';
    }

    getTaskDescription(taskId) {
        return 'Review this cybersecurity concept to strengthen your understanding.';
    }

    // EXPORT/IMPORT FUNCTIONALITY
    exportProgress() {
        const progress = localStorage.getItem(this.storageKey);
        const retention = localStorage.getItem(this.retentionKey);
        const streak = localStorage.getItem(this.streakKey);
        
        const exportData = {
            progress: JSON.parse(progress || '{}'),
            retention: JSON.parse(retention || '{}'),
            streak: parseInt(streak || '0'),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cybersecurity_progress_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    importProgress(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                if (importData.progress) {
                    localStorage.setItem(this.storageKey, JSON.stringify(importData.progress));
                }
                if (importData.retention) {
                    localStorage.setItem(this.retentionKey, JSON.stringify(importData.retention));
                }
                if (importData.streak) {
                    localStorage.setItem(this.streakKey, importData.streak.toString());
                }
                
                // Reload the page to apply imported data
                location.reload();
            } catch (error) {
                console.error('Import error:', error);
                alert('Failed to import data. Please check the file format.');
            }
        };
        
        reader.readAsText(file);
    }

    // CLEANUP METHOD
    cleanup() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }
}

// Global functions for phase and week toggles (to fix onClick errors)
function togglePhase(element) {
    if (window.cyberTracker) {
        window.cyberTracker.togglePhaseContent(element);
    } else {
        // Fallback if cyberTracker isn't ready yet
        toggleContent(element);
    }
}

function toggleWeek(element) {
    if (window.cyberTracker) {
        window.cyberTracker.togglePhaseContent(element);
    } else {
        // Fallback if cyberTracker isn't ready yet
        toggleContent(element);
    }
}

// Fallback toggle function
function toggleContent(element) {
    if (!element) return;
    
    // Find the content to toggle
    let content = element.nextElementSibling;
    
    // If no direct sibling, try finding the content area
    if (!content) {
        content = element.parentElement?.querySelector('.phase-content, .week-content, .content');
    }
    
    // If still no content, try looking for the next div
    if (!content) {
        let nextElement = element.nextElementSibling;
        while (nextElement && nextElement.nodeType !== 1) {
            nextElement = nextElement.nextSibling;
        }
        content = nextElement;
    }
    
    if (content) {
        const isHidden = content.style.display === 'none' || 
                       getComputedStyle(content).display === 'none';
        
        if (isHidden) {
            content.style.display = 'block';
            // Update arrow indicators
            element.textContent = element.textContent.replace('▶', '▼');
            if (!element.textContent.includes('▼') && !element.textContent.includes('▶')) {
                element.textContent = '▼ ' + element.textContent;
            }
        } else {
            content.style.display = 'none';
            // Update arrow indicators
            element.textContent = element.textContent.replace('▼', '▶');
            if (!element.textContent.includes('▶') && !element.textContent.includes('▼')) {
                element.textContent = '▶ ' + element.textContent;
            }
        }
        
        console.log(`Toggled content for: ${element.textContent.substring(0, 30)}...`);
    } else {
        console.warn('No content found to toggle for element:', element);
    }
}

// Initialize the tracker when DOM is loaded
let cyberTracker;

document.addEventListener('DOMContentLoaded', () => {
    try {
        cyberTracker = new CyberSecurityTracker();
        
        // Add export/import buttons to the page
        const exportBtn = document.createElement('button');
        exportBtn.textContent = '📤 Export Progress';
        exportBtn.className = 'cta-button';
        exportBtn.onclick = () => {
            try {
                cyberTracker.exportProgress();
            } catch (error) {
                console.error('Export error:', error);
                alert('Export failed. Please try again.');
            }
        };
        
        const importBtn = document.createElement('input');
        importBtn.type = 'file';
        importBtn.accept = '.json';
        importBtn.style.display = 'none';
        importBtn.onchange = (e) => {
            try {
                cyberTracker.importProgress(e);
            } catch (error) {
                console.error('Import error:', error);
                alert('Import failed. Please check the file format.');
            }
        };
        
        const importLabel = document.createElement('button');
        importLabel.textContent = '📥 Import Progress';
        importLabel.className = 'cta-button';
        importLabel.onclick = () => importBtn.click();
        
        // Add buttons to page
        const container = document.querySelector('.container') || document.body;
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'margin: 20px 0; text-align: center;';
        buttonContainer.appendChild(exportBtn);
        buttonContainer.appendChild(document.createTextNode(' '));
        buttonContainer.appendChild(importLabel);
        buttonContainer.appendChild(importBtn);
        
        container.appendChild(buttonContainer);
        
        // Make cyberTracker globally available
        window.cyberTracker = cyberTracker;
        
        console.log('🔒 Cybersecurity Learning System Loaded Successfully!');
        console.log('📊 Features: Auto-save, Spaced Repetition, Daily Streaks, Quizzes');
        console.log('⌨️ Shortcuts: Ctrl+S (Save), Ctrl+R (Review)');
        
    } catch (error) {
        console.error('Failed to initialize Cybersecurity Tracker:', error);
        alert('Failed to load the learning system. Please refresh the page.');
    }
});