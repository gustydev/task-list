import Item from './itemCreator.js';
import Project from './projectCreator.js';
import { format, isToday, parse, startOfTomorrow } from 'date-fns';

const newButton = document.querySelector('button#new-task');
const newForm = document.querySelector('form#new-item-form');
const taskContainer = document.querySelector('div.content');
const tabList = document.querySelector('div.tab-list');

const projList = [];

let currentTab = 'Inbox'; // Default
let itemList;

const allItems = function() {
    const all = [];
    projList.forEach(project => {
        project.itemList.forEach(item => {
            all.push(item);
        })
    })
    return all;
}

tabList.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        currentTab = button.id;
        updateTab();
        updatePage();
        console.log(currentTab)
    })
    projList.push(new Project(`${button.id}`));
    console.log(projList);
});

function parsed(date) {
    return parse(date, 'MM/dd/yyyy', new Date());
}

const updateTab = function() {
    const all = allItems();
    all.forEach(item => {
        projList.forEach(proj => {
            if (!(proj.itemList.includes(item))) {
                if ((proj.name === 'Inbox') || 
                    ((proj.name === 'Today' && isToday(parsed(item.dueDate)))) ||
                    ((proj.name === 'Upcoming' && parsed(item.dueDate) >= startOfTomorrow()))) {
                        proj.itemList.push(item);
                }
            }
        })
    })
    return itemList = projList.find((element) => element.name === currentTab).itemList;
}

newButton.addEventListener('click', () => {
    newForm.style.display = 'initial';
})

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
    e.preventDefault();
    if (newForm.checkValidity()) {
        newForm.style.display = '';
        if (currentTab == 'Today' || currentTab == 'Upcoming') {
            currentTab = 'Inbox';
        }
        updateTab();
        itemList.push(new Item(title.value, desc.value, 
            format(new Date(dueDate.value), 'P'), 
            priority.value, false));
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
        newProj.id = projName;
        newProj.addEventListener('click', () => {currentTab = projName; updateTab(); updatePage()});
        projectList.appendChild(newProj);
    } else if (projName.length == 0) {
        alert('Projects must have a name. Please try again.')
    } else {
        alert('Name is already in use. Please try again')
    }
    console.log(projList);
})