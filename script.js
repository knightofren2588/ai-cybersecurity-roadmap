// Progress tracking variables
let completedTasks = 0;
const totalTasks = document.querySelectorAll('.task-checkbox').length;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    updateStats();
    updateProgressBars();
    
    // Open first phase by default
    const firstPhaseContent = document.querySelector('.phase-content');
    if (firstPhaseContent) {
        firstPhaseContent.style.display = 'block';
    }
    
    // Add keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Auto-save every 30 seconds
    setInterval(saveProgress, 30000);
});

// Load saved progress from localStorage
function loadProgress() {
    try {
        const saved = localStorage.getItem('cybersecurity_roadmap_progress');
        if (saved) {
            const progress = JSON.parse(saved);
            progress.forEach(taskId => {
                const checkbox = document.getElementById(taskId);
                if (checkbox) {
                    checkbox.classList.add('checked');
                    checkbox.textContent = '✓';
                    completedTasks++;
                }
            });
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

// Save progress to localStorage
function saveProgress() {
    try {
        const checkedTasks = Array.from(document.querySelectorAll('.task-checkbox.checked'))
            .map(checkbox => checkbox.id)
            .filter(id => id); // Only include checkboxes with IDs
        
        localStorage.setItem('cybersecurity_roadmap_progress', JSON.stringify(checkedTasks));
        showSaveNotice();
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

// Show save notification
function showSaveNotice() {
    const notice = document.getElementById('saveNotice');
    if (notice) {
        notice.classList.add('show');
        setTimeout(() => {
            notice.classList.remove('show');
        }, 2000);
    }
}

// Toggle task completion
function toggleTask(checkbox) {
    // Assign ID if doesn't exist
    if (!checkbox.id) {
        checkbox.id = 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    if (checkbox.classList.contains('checked')) {
        checkbox.classList.remove('checked');
        checkbox.textContent = '';
        completedTasks--;
    } else {
        checkbox.classList.add('checked');
        checkbox.textContent = '✓';
        completedTasks++;
    }
    
    updateStats();
    updateProgressBars();
    saveProgress();
}

// Update statistics
function updateStats() {
    const tasksDoneElement = document.getElementById('tasks-done');
    if (tasksDoneElement) {
        tasksDoneElement.textContent = completedTasks;
    }
}

// Update progress bars for each week
function updateProgressBars() {
    const weeks = document.querySelectorAll('.week');
    weeks.forEach(week => {
        const checkboxes = week.querySelectorAll('.task-checkbox');
        const checked = week.querySelectorAll('.task-checkbox.checked');
        const percentage = checkboxes.length > 0 ? (checked.length / checkboxes.length) * 100 : 0;
        const progressBar = week.querySelector('.progress-fill');
        if (progressBar) {
            progressBar.style.width = percentage + '%';
            progressBar.classList.add('animate');
        }
    });
}

// Toggle week content visibility
function toggleWeek(header) {
    const week = header.closest('.week');
    if (week) {
        week.classList.toggle('expanded');
        
        // Update progress bar when week is opened
        setTimeout(() => {
            updateProgressBars();
        }, 100);
    }
}

// Toggle phase content visibility
function togglePhase(header) {
    const phase = header.closest('.phase');
    const content = phase.querySelector('.phase-content');
    if (content) {
        const isVisible = content.style.display === 'block';
        content.style.display = isVisible ? 'none' : 'block';
        
        // Update progress bars when phase is opened
        if (!isVisible) {
            setTimeout(() => {
                updateProgressBars();
            }, 100);
        }
    }
}

// Export progress as JSON file
function downloadProgress() {
    try {
        const progress = {
            timestamp: new Date().toISOString(),
            roadmap_type: 'cybersecurity',
            version: '1.0',
            completed_tasks: completedTasks,
            total_tasks: totalTasks,
            progress_data: JSON.parse(localStorage.getItem('cybersecurity_roadmap_progress') || '[]')
        };
        
        const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cybersecurity-roadmap-progress-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Progress exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting progress:', error);
        showNotification('Error exporting progress. Please try again.', 'error');
    }
}

// Import progress from JSON file
function importProgress(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            if (imported.roadmap_type !== 'cybersecurity') {
                showNotification('Invalid file: This is not a cybersecurity roadmap backup.', 'error');
                return;
            }
            
            // Clear current progress
            document.querySelectorAll('.task-checkbox.checked').forEach(checkbox => {
                checkbox.classList.remove('checked');
                checkbox.textContent = '';
            });
            
            // Load imported progress
            completedTasks = 0;
            if (imported.progress_data && Array.isArray(imported.progress_data)) {
                imported.progress_data.forEach(taskId => {
                    const checkbox = document.getElementById(taskId);
                    if (checkbox) {
                        checkbox.classList.add('checked');
                        checkbox.textContent = '✓';
                        completedTasks++;
                    }
                });
            }
            
            // Save to localStorage
            localStorage.setItem('cybersecurity_roadmap_progress', JSON.stringify(imported.progress_data || []));
            
            updateStats();
            updateProgressBars();
            showNotification(`Progress imported successfully! ${completedTasks} tasks completed.`, 'success');
            
        } catch (error) {
            console.error('Error importing progress:', error);
            showNotification('Error importing file. Please check the file format.', 'error');
        }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
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
          type === 'error' ? 'background: #e74c3c;' : 'background: #3498db;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    togglePhaseByIndex(0);
                    break;
                case '2':
                    e.preventDefault();
                    togglePhaseByIndex(1);
                    break;
                case '3':
                    e.preventDefault();
                    togglePhaseByIndex(2);
                    break;
                case '4':
                    e.preventDefault();
                    togglePhaseByIndex(3);
                    break;
                case 's':
                    e.preventDefault();
                    saveProgress();
                    break;
                case 'e':
                    e.preventDefault();
                    downloadProgress();
                    break;
            }
        }
    });
}

// Toggle phase by index
function togglePhaseByIndex(index) {
    const phases = document.querySelectorAll('.phase-header');
    if (phases[index]) {
        togglePhase(phases[index]);
    }
}

// Search functionality
function searchTasks(query) {
    const tasks = document.querySelectorAll('.task-item');
    const weeks = document.querySelectorAll('.week');
    
    if (!query.trim()) {
        // Show all tasks and weeks
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
            // Mark the week as having visible tasks
            const week = task.closest('.week');
            if (week) {
                visibleWeeks.add(week);
            }
        } else {
            task.style.display = 'none';
        }
    });
    
    // Show/hide weeks based on whether they have visible tasks
    weeks.forEach(week => {
        if (visibleWeeks.has(week)) {
            week.style.display = 'block';
            // Expand week to show search results
            week.classList.add('expanded');
        } else {
            week.style.display = 'none';
        }
    });
}

// Add search functionality to the page
function addSearchBox() {
    const header = document.querySelector('.header');
    if (header) {
        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = 'margin-top: 20px;';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search tasks...';
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

// Initialize search box when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addSearchBox();
});

// Reset all progress (admin function)
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        localStorage.removeItem('cybersecurity_roadmap_progress');
        location.reload();
    }
}

// Statistics calculation
function getDetailedStats() {
    const phases = document.querySelectorAll('.phase');
    const stats = {
        total_phases: phases.length,
        total_weeks: document.querySelectorAll('.week').length,
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        completion_percentage: Math.round((completedTasks / totalTasks) * 100),
        phases_detail: []
    };
    
    phases.forEach((phase, index) => {
        const phaseTasks = phase.querySelectorAll('.task-checkbox');
        const phaseCompleted = phase.querySelectorAll('.task-checkbox.checked');
        const phaseTitle = phase.querySelector('.phase-header h2').textContent;
        
        stats.phases_detail.push({
            phase_number: index + 1,
            title: phaseTitle,
            total_tasks: phaseTasks.length,
            completed_tasks: phaseCompleted.length,
            completion_percentage: phaseTasks.length > 0 ? Math.round((phaseCompleted.length / phaseTasks.length) * 100) : 0
        });
    });
    
    return stats;
}

// Export detailed statistics
function exportStats() {
    const stats = getDetailedStats();
    const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybersecurity-roadmap-stats-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Print progress report
function printProgress() {
    const stats = getDetailedStats();
    const printWindow = window.open('', '_blank');
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Cybersecurity Roadmap Progress Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .stats { margin-bottom: 30px; }
                .phase { margin-bottom: 20px; }
                .progress-bar { 
                    width: 100%; 
                    height: 20px; 
                    background: #eee; 
                    border-radius: 10px; 
                    overflow: hidden;
                    margin: 5px 0;
                }
                .progress-fill { 
                    height: 100%; 
                    background: linear-gradient(90deg, #27ae60, #2ecc71);
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🔒 Cybersecurity Roadmap Progress Report</h1>
                <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="stats">
                <h2>Overall Progress</h2>
                <p><strong>Total Tasks:</strong> ${stats.total_tasks}</p>
                <p><strong>Completed Tasks:</strong> ${stats.completed_tasks}</p>
                <p><strong>Completion Rate:</strong> ${stats.completion_percentage}%</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${stats.completion_percentage}%"></div>
                </div>
            </div>
            
            <div class="phases">
                <h2>Phase Breakdown</h2>
                ${stats.phases_detail.map(phase => `
                    <div class="phase">
                        <h3>${phase.title}</h3>
                        <p>Progress: ${phase.completed_tasks}/${phase.total_tasks} tasks (${phase.completion_percentage}%)</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${phase.completion_percentage}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// Mobile touch support
function addTouchSupport() {
    let startY = 0;
    let currentY = 0;
    let isScrolling = false;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        isScrolling = false;
    });
    
    document.addEventListener('touchmove', function(e) {
        currentY = e.touches[0].clientY;
        if (Math.abs(currentY - startY) > 10) {
            isScrolling = true;
        }
    });
    
    document.addEventListener('touchend', function(e) {
        if (!isScrolling) {
            // Handle tap events for checkboxes
            const target = e.target;
            if (target.classList.contains('task-checkbox')) {
                toggleTask(target);
            }
        }
    });
}

// Initialize touch support
document.addEventListener('DOMContentLoaded', function() {
    addTouchSupport();
});

// Add help modal
function showHelp() {
    const helpModal = document.createElement('div');
    helpModal.style.cssText = `
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
    `;
    
    const helpContent = document.createElement('div');
    helpContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    helpContent.innerHTML = `
        <h2>🔒 Cybersecurity Roadmap Help</h2>
        <h3>Keyboard Shortcuts:</h3>
        <ul>
            <li><kbd>Ctrl+1</kbd> - Toggle Phase 1</li>
            <li><kbd>Ctrl+2</kbd> - Toggle Phase 2</li>
            <li><kbd>Ctrl+3</kbd> - Toggle Phase 3</li>
            <li><kbd>Ctrl+4</kbd> - Toggle Phase 4</li>
            <li><kbd>Ctrl+S</kbd> - Save Progress</li>
            <li><kbd>Ctrl+E</kbd> - Export Progress</li>
        </ul>
        
        <h3>Features:</h3>
        <ul>
            <li>✅ Click checkboxes to mark tasks complete</li>
            <li>💾 Progress saves automatically every 30 seconds</li>
            <li>📊 Visual progress bars for each week</li>
            <li>🔍 Search tasks using the search box</li>
            <li>📁 Export/import progress as JSON files</li>
        </ul>
        
        <button onclick="this.parentElement.parentElement.remove()" 
                style="margin-top: 20px; padding: 10px 20px; background: #1e3c72; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Close
        </button>
    `;
    
    helpModal.appendChild(helpContent);
    document.body.appendChild(helpModal);
    
    helpModal.addEventListener('click', function(e) {
        if (e.target === helpModal) {
            helpModal.remove();
        }
    });
}

// Add help button to header
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    if (header) {
        const helpButton = document.createElement('button');
        helpButton.textContent = '❓ Help';
        helpButton.className = 'download-btn';
        helpButton.onclick = showHelp;
        helpButton.style.fontSize = '0.9em';
        helpButton.style.padding = '10px 20px';
        header.appendChild(helpButton);
    }
});