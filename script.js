// ===== DOM ELEMENTS =====
const taskInput = document.getElementById('taskInput');
const dueDate = document.getElementById('dueDate');
const priority = document.getElementById('priority');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const clearAllBtn = document.getElementById('clearAll');
const searchInput = document.getElementById('searchInput');
const darkModeToggle = document.getElementById('darkModeToggle');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');

// ===== LOAD TASKS FROM LOCAL STORAGE =====
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// ===== INITIALIZE APP =====
function init() {
    renderTasks();
    updateCounter();
    loadDarkMode();
}

// ===== ADD TASK =====
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        dueDate: dueDate.value,
        priority: priority.value.toLowerCase(),
        completed: false
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    updateCounter();
    
    // Clear inputs
    taskInput.value = '';
    dueDate.value = '';
    priority.value = 'Low';
    taskInput.focus();
}

// ===== RENDER TASKS =====
function renderTasks(filter = '') {
    todoList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(filter.toLowerCase())
    );
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `${task.priority} ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;
        
        const taskInfo = document.createElement('div');
        taskInfo.style.display = 'flex';
        taskInfo.style.flexDirection = 'column';
        taskInfo.style.gap = '5px';
        taskInfo.style.flex = '1';
        taskInfo.style.cursor = 'pointer';
        
        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        taskText.style.fontWeight = 'bold';
        
        const taskDetails = document.createElement('small');
        taskDetails.style.color = '#666';
        taskDetails.textContent = `${task.priority.toUpperCase()} ${task.dueDate ? '| Due: ' + task.dueDate : ''}`;
        
        taskInfo.appendChild(taskText);
        taskInfo.appendChild(taskDetails);
        
        // Toggle completion on click
        taskInfo.addEventListener('click', () => toggleComplete(task.id));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        li.appendChild(taskInfo);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

// ===== TOGGLE COMPLETE =====
function toggleComplete(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks(searchInput.value);
    updateCounter();
}

// ===== DELETE TASK =====
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks(searchInput.value);
    updateCounter();
}

// ===== CLEAR ALL TASKS =====
function clearAllTasks() {
    if (tasks.length === 0) {
        alert('No tasks to clear!');
        return;
    }
    
    if (confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];
        saveTasks();
        renderTasks();
        updateCounter();
    }
}

// ===== UPDATE COUNTER =====
function updateCounter() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    
    totalTasksSpan.textContent = total;
    completedTasksSpan.textContent = completed;
}

// ===== SEARCH TASKS =====
function searchTasks() {
    renderTasks(searchInput.value);
}

// ===== DARK MODE TOGGLE =====
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    
    darkModeToggle.textContent = isDark ? '☀️' : '🌙';
}

// ===== LOAD DARK MODE =====
function loadDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark');
        darkModeToggle.textContent = '☀️';
    }
}

// ===== SAVE TASKS TO LOCAL STORAGE =====
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ===== EVENT LISTENERS =====
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
clearAllBtn.addEventListener('click', clearAllTasks);
searchInput.addEventListener('input', searchTasks);
darkModeToggle.addEventListener('click', toggleDarkMode);

// ===== INITIALIZE APP ON LOAD =====
init();