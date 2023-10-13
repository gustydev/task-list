import Item from './itemCreator.js';

const newButton = document.querySelector('button#new');
const newForm = document.querySelector('form#new-item-form');
const taskContainer = document.querySelector('div.content');

newButton.addEventListener('click', () => {
    newForm.style.display = 'initial';
})

const addItem = function(title, desc, dueDate, priority) {
    const item = new Item(title, desc, dueDate, priority, false);
    const itemDiv = document.createElement('div')
    itemDiv.classList.add('task');
    for (const [key,value] of Object.entries(item)) {
        const dataDiv = document.createElement('div');
        dataDiv.classList.add(`task-${key}`);
        dataDiv.textContent = `${key}: ${value}`;
        itemDiv.appendChild(dataDiv);
    }
    taskContainer.appendChild(itemDiv);
}

const submitButton = document.querySelector('button#submit')
submitButton.addEventListener('click', (e) => {
    newForm.style.display = '';
    addItem(title.value, desc.value, dueDate.value, priority.value);
    e.preventDefault();
})