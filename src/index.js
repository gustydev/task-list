import Item from './itemCreator.js';
import Project from './projectCreator.js';
import { format, isToday, parse, startOfTomorrow } from 'date-fns';

const newButton = document.querySelector('button#new-task');
const newForm = document.querySelector('form#new-item-form');
const taskContainer = document.querySelector('div.content');
const taskList = document.querySelector('div.task-list');
const tabTitle = document.querySelector('div.tab-title');
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
    })
    projList.push(new Project(`${button.id}`));
});

function parsed(date) {
    return parse(date, 'MM/dd/yyyy', new Date());
}

const updateTab = function() {
    tabTitle.textContent = `${currentTab}`;
    allItems().forEach(item => {
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
    updateTab();
    taskList.innerHTML = '';
    itemList.forEach(item => {
        const itemDiv = document.createElement('div')
        itemDiv.classList.add('task');
        for (const [key,value] of Object.entries(item)) {
            if (key == 'checklist') {
                const dataDiv = document.createElement('input');
                dataDiv.type = 'checkbox';
                dataDiv.addEventListener('click', () => {
                    projList.forEach(proj => {
                        if (proj.itemList.includes(item)) {
                            const newList = proj.itemList.filter((a) => !(a === item));
                            proj.itemList = newList;
                        }
                    })
                    updatePage();
                })
                itemDiv.appendChild(dataDiv);
            } else {
                const dataDiv = document.createElement('div');
                dataDiv.classList.add(`task-${key}`);
                dataDiv.textContent = `${value}`;
                itemDiv.appendChild(dataDiv);
            }
        }
        taskList.appendChild(itemDiv);
    });
}

const submitButton = document.querySelector('button#submit')
submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (dueDate.value.length > 10) {
        alert("Please enter a 4-digit year (maximum: 9999).");
    } else if (newForm.checkValidity()) {
        newForm.style.display = '';
        if (currentTab == 'Today' || currentTab == 'Upcoming') {
            currentTab = 'Inbox';
        }
        updateTab();
        itemList.push(new Item(
            title.value, desc.value, format(new Date(dueDate.value.replace('-', '/')), 'P'), priority.value, false
            ));
        updatePage();
        newForm.reset();
    } else {
        alert('Please fill all of the fields.')
    }
})

const newProject = document.querySelector('button#new-project');
const projectList = document.querySelector('div.project-list');
newProject.addEventListener('click', () => {
    const projName = prompt('What project name?');
    if ( !(( projList.map((a) => a.name)).includes(projName)) && (projName.length >= 1)) {
        projList.push(new Project(projName));
        currentTab = projName;
        updatePage();
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
})

updateTab();
itemList.push(new Item ('Lorem ipsum dolor sit amet, consectetuer adipiscin', 'That is the title character limit.', '10/09/2023', 'low', false));
itemList.push(new Item ('And this is the description character limit', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean!!', '10/09/2023', 'mid', false));
itemList.push(new Item ('Finish the todo list project', 'Design the rest of the website, and write a reasonably long description for this task.', '10/23/2023', 'high', false))
updatePage();