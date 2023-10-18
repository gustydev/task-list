import Item from './itemCreator.js';
import Project from './projectCreator.js';

const newButton = document.querySelector('button#new-task');
const newForm = document.querySelector('form#new-item-form');
const taskContainer = document.querySelector('div.content');

const projList = [new Project('Inbox')];
let itemList;

let currentTab = 'Inbox'; // Default

const updateTab = function() {
    return itemList = projList.find((element) => element.name === currentTab).itemList;
}

newButton.addEventListener('click', () => {
    newForm.style.display = 'initial';
})

const updatePage = function() {
    taskContainer.innerHTML = '';
    updateTab();
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
    e.preventDefault();
    if (newForm.checkValidity()) {
        newForm.style.display = '';
        updateTab();
        itemList.push(new Item(title.value, desc.value, dueDate.value, priority.value, false));
        updatePage();
        newForm.reset();
    } else {
        alert('Please fill all of the fields');
    }
})

const newProject = document.querySelector('button#new-project');
const projectList = document.querySelector('div.project-list');
newProject.addEventListener('click', () => {
    const projName = prompt('What project name?');
    if ( !(( projList.map((a) => a.name)).includes(projName)) && (projName.length >= 1)) {
        projList.push(new Project(projName));
        const newProj = document.createElement('button');
        newProj.textContent = projName;
        newProj.addEventListener('click', () => {currentTab = projName; updatePage()});
        projectList.appendChild(newProj);
    } else if (projName.length == 0) {
        alert('Projects must have a name. Please try again.')
    } else {
        alert('Name is already in use. Please try again')
    }
    console.log(projList);
})