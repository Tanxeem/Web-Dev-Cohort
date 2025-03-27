// DOM Elements
const input = document.getElementById('input');
const splitInput = document.getElementById('split-input');
const preview = document.getElementById('preview');
const splitPreview = document.getElementById('split-preview');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');
const charCount = document.getElementById('charCount');
const themeBtn = document.getElementById('themeBtn');
const snackbar = document.getElementById('snackbar');
const tabBtns = document.querySelectorAll('.tab-btn');
const contentContainers = document.querySelectorAll('[data-content]');

// Configure marked.js
marked.setOptions({
    breaks: true,
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(lang, code).value;
        }
        return hljs.highlightAuto(code).value;
    }
});

// Initialize the app
function init() {
    // Load saved content if available
    const savedContent = localStorage.getItem('markdownContent');
    if (savedContent) {
        input.value = savedContent;
        splitInput.value = savedContent;
        updatePreview();
        updateSplitPreview();
    }
    
    // Set initial character count
    updateCharCount();
    
    // Set up event listeners
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Copy button
    copyBtn.addEventListener('click', copyToClipboard);
    
    // Clear button
    clearBtn.addEventListener('click', clearEditor);
    
    // Download button
    downloadBtn.addEventListener('click', downloadMarkdown);
    
    // Theme toggle
    themeBtn.addEventListener('click', toggleTheme);
    
    // Input events
    input.addEventListener('input', () => {
        splitInput.value = input.value;
        updatePreview();
        updateSplitPreview();
        updateCharCount();
        saveContent();
    });
    
    splitInput.addEventListener('input', () => {
        input.value = splitInput.value;
        updatePreview();
        updateSplitPreview();
        updateCharCount();
        saveContent();
    });
}

// Switch between tabs
function switchTab(tabName) {
    // Update active tab button
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update active content container
    contentContainers.forEach(container => {
        container.classList.remove('active');
        if (container.getAttribute('data-content') === tabName) {
            container.classList.add('active');
        }
    });
}

// Update the preview
function updatePreview() {
    preview.innerHTML = marked.parse(input.value);
}

// Update the split preview
function updateSplitPreview() {
    splitPreview.innerHTML = marked.parse(splitInput.value);
}

// Copy markdown to clipboard
function copyToClipboard() {
    navigator.clipboard.writeText(input.value)
        .then(() => {
            showSnackbar('Markdown copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            showSnackbar('Failed to copy!');
        });
}

// Clear the editor
function clearEditor() {
    if (confirm('Are you sure you want to clear the editor?')) {
        input.value = '';
        splitInput.value = '';
        updatePreview();
        updateSplitPreview();
        updateCharCount();
        localStorage.removeItem('markdownContent');
        showSnackbar('Editor cleared!');
    }
}

// Download markdown as file
function downloadMarkdown() {
    const content = input.value;
    if (!content.trim()) {
        showSnackbar('Nothing to download!');
        return;
    }
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown-document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSnackbar('Download started!');
}

// Show snackbar notification
function showSnackbar(message) {
    snackbar.textContent = message;
    snackbar.classList.add('show');
    setTimeout(() => {
        snackbar.classList.remove('show');
    }, 3000);
}

// Update character count
function updateCharCount() {
    const count = input.value.length;
    charCount.textContent = `${count} characters`;
    
    if (count > 10000) {
        charCount.style.color = '#ff7675';
    } else if (count > 5000) {
        charCount.style.color = '#fdcb6e';
    } else {
        charCount.style.color = '';
    }
}

// Save content to localStorage
function saveContent() {
    localStorage.setItem('markdownContent', input.value);
}

// Toggle light/dark theme
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeBtn.innerHTML = isLight ? '<i class="fas fa-sun"></i> Light Mode' : '<i class="fas fa-moon"></i> Dark Mode';
    localStorage.setItem('themePreference', isLight ? 'light' : 'dark');
}

// Check for saved theme preference
function checkThemePreference() {
    const savedTheme = localStorage.getItem('themePreference');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
}

// Insert text at cursor position
function insertText(text) {
    const textarea = document.activeElement === splitInput ? splitInput : input;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selectedText = textarea.value.substring(startPos, endPos);
    
    let newText;
    if (selectedText) {
        // If text is selected, wrap it
        if (text.startsWith('```') && text.endsWith('```')) {
            newText = text.substring(0, 3) + '\n' + selectedText + '\n' + text.substring(3);
        } else {
            newText = text.replace('text', selectedText);
        }
    } else {
        newText = text;
    }
    
    textarea.value = textarea.value.substring(0, startPos) + newText + textarea.value.substring(endPos);
    
    // Position cursor
    if (text === '# ' || text === '## ' || text === '### ' || text === '- ' || text === '1. ' || text === '> ') {
        textarea.selectionStart = textarea.selectionEnd = startPos + text.length;
    } else if (text === '**bold**' || text === '*italic*' || text === '~~strikethrough~~') {
        textarea.selectionStart = startPos + (text.startsWith('**') ? 2 : 1);
        textarea.selectionEnd = startPos + (text.startsWith('**') ? text.length - 2 : text.length - 1);
    } else if (text === '[text](url)') {
        textarea.selectionStart = startPos + 1;
        textarea.selectionEnd = startPos + 5;
    } else if (text === '![alt](image-url)') {
        textarea.selectionStart = startPos + 2;
        textarea.selectionEnd = startPos + 5;
    } else if (text === '```\ncode\n```') {
        textarea.selectionStart = startPos + 4;
        textarea.selectionEnd = startPos + 8;
    }
    
    textarea.focus();
    updatePreview();
    updateSplitPreview();
    updateCharCount();
    saveContent();
}

// Handle key events
function handleKeyDown(e) {
    // Tab key inserts spaces
    if (e.key === 'Tab') {
        e.preventDefault();
        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
        
        updatePreview();
        updateSplitPreview();
        updateCharCount();
        saveContent();
    }
    
    // Ctrl+B for bold
    if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        insertText('**bold**');
    }
    
    // Ctrl+I for italic
    if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        insertText('*italic*');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkThemePreference();
    init();
});