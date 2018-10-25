'use strict'

// Fetching existing todos from localStorage
const getSavedTodos = () => {
  const todosJSON = localStorage.getItem('todos');
  try {
    return todosJSON ? JSON.parse(todosJSON) : [];
  } catch (e) {
    return [];
  }
}

// Render Todo application
const renderTodos =  (todos, filters) => {
  const todoEl = document.querySelector('#todos')
  const filterTodos = filterTodo(todos, filters)

  todoEl.innerHTML = ''

  const incompleteTodos = filterTodos.filter(todo => !todo.completed)

  todoEl.appendChild(generateSummaryDOM(incompleteTodos))

  if(filterTodos.length > 0) {
    filterTodos.forEach(todo => {
      todoEl.appendChild(generateTodoDOM(todo));
    })
  } else {
    const messageEl = document.createElement('p')
    messageEl.classList.add('empty-message')
    messageEl.textContent = 'No todos to show'
    todoEl.appendChild(messageEl)
  }
}

// Filter Todo
const filterTodo = (todos, filters) => {
  return todos.filter(todo => {
    const searchTextMatch = todo.text.toLowerCase().includes(filters.searchText.toLowerCase());
    const hideCompletedMatch = !filters.hideCompleted || !todo.completed;
    
    return searchTextMatch && hideCompletedMatch;
  });
}

// Save the todos to localStorage
const saveTodos = (todos) => localStorage.setItem('todos', JSON.stringify(todos));

// Toggle the completed value
const toggleTodo = id => {
  const todo = todos.find(todo => todo.id === id);
  if(todo) todo.completed = !todo.completed;
}

// Remove the todo from list
const removeTodo = (id) => {
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if(todoIndex > -1) {
    todos.splice(todoIndex, 1);
  }
}

// Get the DOM elements for an individual note
const generateTodoDOM = (todo) => {
  const todoEl = document.createElement('label');
  const containerEl = document.createElement('div')
  const todoText = document.createElement('span');
  const checkbox = document.createElement('input');
  const removeButton = document.createElement('button');

  // Setup todo checkbox
  checkbox.setAttribute('type', 'checkbox');
  checkbox.checked = todo.completed;
  containerEl.appendChild(checkbox);
  checkbox.addEventListener('change', e => {
    toggleTodo(todo.id);
    saveTodos(todos);
    renderTodos(todos, filters);
  })

  // Setup the todo text
  todoText.textContent = todo.text;
  containerEl.appendChild(todoText);

  // setup container
  todoEl.classList.add('list-item')
  containerEl.classList.add('list-item__container')
  todoEl.appendChild(containerEl)

  // Setup the remove todo button
  removeButton.textContent = 'remove';
  removeButton.classList.add('button', 'button--text')
  todoEl.appendChild(removeButton);
  removeButton.addEventListener('click', () => {
    removeTodo(todo.id);
    saveTodos(todos);
    renderTodos(todos, filters);
  })

  return todoEl;
}

// Get the DOM elements for list summary
const generateSummaryDOM = (incompleteTodos) => {
  const summaryEl = document.createElement('h2');
  const plural = incompleteTodos.length === 1 ? '' : 's'

  summaryEl.classList.add('list-title')
  summaryEl.textContent = `You have ${incompleteTodos.length} todo${plural} left`

  return summaryEl
}