import Item from './itemCreator.js';
import Project from './projectCreator.js';
import { format, isToday, parse, startOfTomorrow } from 'date-fns';

const newButton = document.querySelector('button#new-task');
const newForm = document.querySelector('form#new-item-form');
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
    if (!(button.id == 'new-project')) {
        button.addEventListener('click', () => {
            currentTab = button.id;
            updatePage();
        })
        projList.push(new Project(`${button.id}`));
    }
});

function parsed(date) {
    return parse(date, 'PP', new Date());
}

function dateFormat(date) {
    return format(parse(date, 'yyyy-MM-dd', new Date()), 'PP');
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
    itemList = projList.find((element) => element.name === currentTab).itemList;
    tabList.querySelectorAll('button').forEach(button => {
        if (!(button.id == 'new-project')) {
            const tabLength = projList.find((proj) => proj.name == button.id).itemList.length;
            if (button.id == currentTab) {
                button.textContent = `> ${button.id} [${tabLength}]`;
            } else {
                button.textContent = `${button.id} [${tabLength}]`;
            }
        }
    })
}

newButton.addEventListener('click', () => {
    newForm.style.display = 'initial';
})

const addItems = function() {
    itemList.forEach(item => {
        const itemDiv = document.createElement('div')
        itemDiv.classList.add('task');
        for (const [key,value] of Object.entries(item)) {
            if (key == 'checklist') {
                const dataDiv = document.createElement('input');
                dataDiv.type = 'checkbox';
                dataDiv.classList.add('task-checklist');
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
                if (key == 'priority') {
                    dataDiv.addEventListener('click', () => {
                        if (item.priority == 'low') {item.priority = 'mid'}
                        else if (item.priority == 'mid') {item.priority = 'high'}
                        else {item.priority = 'low'}
                        updatePage();
                    })
                    if (value == 'low') {
                        dataDiv.style.backgroundColor = 'green';
                    } else if (value == 'mid') {
                        dataDiv.style.backgroundColor = 'yellow';
                        dataDiv.style.color = 'black'
                    } else {
                        dataDiv.style.backgroundColor = 'red';
                    }
                } else if (key == 'title' || key == 'desc') {
                    const editButton = document.createElement('button');
                    editButton.classList.add('edit-button');
                    editButton.innerHTML = "<img src='./images/edit.png'>"
                    editButton.style.visibility = 'hidden' // By default, hidden
                    editButton.addEventListener('click', () => {
                        const textInput = document.createElement('input');
                        const confirmButton = document.createElement('button');
                        textInput.type = 'text';
                        textInput.value = `${value}`;
                        textInput.placeholder = `${key}`;
                        textInput.classList.add(`task-${key}`);
                        if (key == 'title') {textInput.maxLength = '50'} 
                        else {textInput.maxLength = '100'}
                        confirmButton.innerHTML = "<img src='./images/check.png'>"
                        confirmButton.classList.add('confirm-button');
                        confirmButton.addEventListener('click', () => {
                            if (key == 'title') {item.title = textInput.value}
                            else {item.desc = textInput.value}
                            updatePage();
                        })
                        dataDiv.textContent = '';
                        dataDiv.appendChild(textInput);
                        dataDiv.appendChild(confirmButton)
                    })
                    dataDiv.appendChild(editButton)
                    dataDiv.addEventListener('mouseover', () => {
                        if (!(dataDiv.innerHTML.includes('input'))) {editButton.style.visibility = 'visible'}
                    })
                    dataDiv.addEventListener('mouseleave', () => {
                        if (!(dataDiv.innerHTML.includes('input'))) {editButton.style.visibility = 'hidden'}
                    })
                } else if (key == 'dueDate') {
                    const dateInput = document.createElement('input');
                    const confirmButton = document.createElement('button');
                    confirmButton.innerHTML = "<img src='./images/check.png'>"
                    confirmButton.classList.add('confirm-button');
                    confirmButton.addEventListener('click', () => {
                        item.dueDate = dateFormat(dateInput.value);
                        updatePage();
                    })
                    dateInput.type = 'date';
                    dateInput.value = format(parsed(item.dueDate), 'yyyy-MM-dd')
                    dataDiv.addEventListener('click', () => {
                        dataDiv.textContent = '';
                        dataDiv.appendChild(dateInput);
                        dataDiv.appendChild(confirmButton);
                    }, {once: true})
                }
                itemDiv.appendChild(dataDiv);
            }
        }
        taskList.appendChild(itemDiv);
    });
}

const updatePage = function() {
    updateTab();
    taskList.innerHTML = '';
    addItems();
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
            title.value, desc.value, dateFormat(dueDate.value), priority.value, false
            ));
        updatePage();
        newForm.reset();
    } else {
        alert('Please fill all of the fields.')
    }
})

const newProject = document.querySelector('button#new-project');
newProject.addEventListener('click', () => {
    let projName = prompt('Name your project:');
    if ( !(( projList.map((a) => a.name)).includes(projName)) && projName.length !== 0) {
        projList.push(new Project(projName));
        currentTab = projName;
        updateTab();
        const newProj = document.createElement('button');
        newProj.textContent = projName;
        newProj.id = projName;
        newProj.addEventListener('click', () => {currentTab = projName; updatePage()});
        tabList.insertBefore(newProj, newProject);
        updatePage();
    } else if (projName.length == 0) {
        alert('Projects must have a name. Please try again.')
    } else {
        alert('Name is already in use. Please try again.')
    }
})

updateTab();
itemList.push(new Item ('Lorem ipsum dolor sit amet, consectetuer adipiscin', 'That is the title character limit.', dateFormat('2024-10-25'), 'low', false));
itemList.push(new Item ('And this is the description character limit', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean!!', dateFormat('2023-10-29'), 'mid', false));
itemList.push(new Item ('Finish the todo list project', 'Design the rest of the website, and write a reasonably long description for this task.', dateFormat('2023-10-25'), 'high', false));
updatePage();