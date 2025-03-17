const moodButtons = document.querySelectorAll('.mood-button');
const moodList = document.getElementById('mood-list');
const calendarGrid = document.getElementById('calendar-grid');
const calendarTitle = document.querySelector('.calendar-title');
let selectedMood = null;

// Generate calendar days
function generateCalendar() {
    const now = new Date();
    const currentDay = now.getDate(); 
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    calendarGrid.innerHTML = '';

    for (let i = 1; i <= daysInMonth; i++) {
        const dayButton = document.createElement('button');
        dayButton.classList.add('calendar-day');
        dayButton.textContent = i;

        // Highlight today's button with yellow color and color black border black
        if (i === currentDay) {
            dayButton.style.backgroundColor = 'yellow';
            dayButton.style.color = 'black';
            dayButton.style.border = '1px solid black';
            dayButton.style.fontWeight = 'bold';
        }

        dayButton.addEventListener('click', () => {
            if (selectedMood) {
                dayButton.style.backgroundColor = getMoodColor(selectedMood);
                addMoodToHistory(selectedMood, i);
            }
        });

        calendarGrid.appendChild(dayButton);
    }
}

// Get mood color
function getMoodColor(mood) {
    const moodColors = {
        happy: '#4CAF50',
        sad: '#2196F3',
        angry: '#F44336',
        neutral: '#9E9E9E'
    };
    return moodColors[mood];
}

// Add mood to history
function addMoodToHistory(mood, day) {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const moodItem = document.createElement('li');
    moodItem.innerHTML = `<span>${mood}</span> <span>${day}/${now.getMonth() + 1}/${now.getFullYear()} ${time}</span>`;
    moodList.appendChild(moodItem);
}

// Handle mood selection
moodButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedMood = button.getAttribute('data-mood');
    });
});

// Show today's date in the desired format
function showdateCalendar() {
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', options);
    calendarTitle.textContent = `Today is : ${formattedDate}`;
    calendarTitle.style.backgroundColor = 'yellow';
    calendarTitle.style.color = 'black';
    calendarTitle.style.border = '1px solid black';
    calendarTitle.style.fontWeight = 'bold';
    calendarTitle.style.padding = '10px';
    calendarTitle.style.borderRadius = '10px';
}

// Generate calendar on page load
generateCalendar();
showdateCalendar();