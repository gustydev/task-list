import Item from './itemCreator.js';

const newButton = document.querySelector('button#new');
const newForm = document.querySelector('form#new-item-form');
const taskContainer = document.querySelector('div.content');

newButton.addEventListener('click', () => {
    newForm.style.display = 'initial';
})

const itemList = [];

const updatePage = function() {
    taskContainer.innerHTML = '';
    itemList.forEach(item => {
        const itemDiv = document.createElement('div')
        itemDiv.classList.add('task');
        for (const [key,value] of Object.entries(item)) {
            const dataDiv = document.createElement('div');
            dataDiv.classList.add(`task-${key}`);
            dataDiv.textContent = `${key}: ${value}`;
            itemDiv.appendChild(dataDiv);
        }
        taskContainer.appendChild(itemDiv);
    });
}

const submitButton = document.querySelector('button#submit')
submitButton.addEventListener('click', (e) => {
    if (newForm.checkValidity()) {
        newForm.style.display = '';
        itemList.push(new Item(title.value, desc.value, dueDate.value, priority.value, false));
        updatePage();
        newForm.reset();
        e.preventDefault();
    } else {
        alert('Please fill all of the fields');
    }
})