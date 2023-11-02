import Item from './itemCreator.js';
import Project from './projectCreator.js';
import { format, isToday, parse, startOfTomorrow, startOfToday } from 'date-fns';

const newButton = document.querySelector('button#new-task');
const newForm = document.querySelector('form#new-item-form');
const taskList = document.querySelector('div.task-list');
const tabTitle = document.querySelector('div.tab-title');
const tabList = document.querySelector('div.tab-list');
const upperPart = document.querySelector('div.upper');

let projList = [];

let currentTab = 'Inbox'; // Default
let itemList;

const allItems = function() {
    const all = [];
    projList.forEach(project => {
        project.items.forEach(item => {
            if (!(JSON.stringify(all).includes(JSON.stringify(item)))) {
                all.push(item);
            }
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
        if (projList.length < 3) {
            projList.push(new Project(`${button.id}`, [])); 
        }
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
    const all = allItems();
    projList.forEach(proj => {
        all.forEach(item => {
            const listMap = proj.items.map(a => [a.title, a.desc, a.dueDate, a.priority, a.checklist]);
            const itemArr = [item.title, item.desc, item.dueDate, item.priority, item.checklist];
            if (!(JSON.stringify(listMap).includes(JSON.stringify(itemArr)))) {
                if ((proj.name === 'Inbox') || 
                    ((proj.name === 'Today' && isToday(parsed(item.dueDate)))) ||
                    ((proj.name === 'Upcoming' && parsed(item.dueDate) >= startOfTomorrow()))) {
                        proj.add(item);
                }
            }
        })
    })
    itemList = projList.find((element) => element.name === currentTab).items;
    if (upperPart.querySelector('button#project-delete')) {
        upperPart.removeChild(document.getElementById('project-delete')) // Preventing duplicates
    }
    if (currentTab != 'Inbox' && currentTab != 'Today' && currentTab != 'Upcoming') {
        const currentProj = projList.find((proj) => proj.name == currentTab);
        const deleteProj = document.createElement('button');
            deleteProj.textContent = 'Delete project';
            deleteProj.id = 'project-delete'
            deleteProj.addEventListener('click', () => {
                const current_proj_id = currentProj.name.replaceAll(' ', '-');
                let output = confirm(`Are you sure you want to delete the ${currentProj.name} project? This cannot be undone!`)
                if (output) {
                    projList = projList.filter(a => a.name != currentProj.name)
                    currentProj.items.forEach(item => {
                        projList.forEach(proj => {
                            if (proj.items.includes(item)) {
                                proj.remove(item);
                            }
                    })})
                    tabList.removeChild(document.getElementById(`${current_proj_id}`))
                    currentTab = 'Inbox';
                    updatePage();
                }
            })
            upperPart.insertBefore(deleteProj, newButton)
    }
    projList.forEach(proj => {
        if (proj.name !== 'Inbox' && proj.name !== 'Today' && proj.name !== 'Upcoming') {
            if (!(tabList.querySelector(`button#${proj.name.replaceAll(' ', '-')}`))) {
                const newProj = document.createElement('button');
                newProj.id = proj.name.replaceAll(' ', '-');
                newProj.textContent = proj.name;
                newProj.addEventListener('click', () => { currentTab = newProj.id.replaceAll('-', ' '); updatePage()})
                tabList.insertBefore(newProj, newProject);
            }
        }
    })
    tabList.querySelectorAll('button').forEach(button => {
        if (!(button.id == 'new-project')) {
            const tabLength = projList.find((proj) => proj.name == button.id.replaceAll('-', ' ')).items.length;
            if (button.id.replaceAll('-', ' ') == currentTab) {
                button.textContent = `> ${button.id.replaceAll('-', ' ')} [${tabLength}]`;
            } else {
                button.textContent = `${button.id.replaceAll('-', ' ')} [${tabLength}]`;
            }
        }
    })
}

newButton.addEventListener('click', () => {
    newForm.style.display = 'grid';
    document.addEventListener('keydown', (e) => {
        if (e.key == 'Escape') {
            newForm.style.display = 'none';
            newForm.reset();
        }
    })
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
                        if (proj.items.includes(item)) {
                            proj.remove(item);
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
                        function confirm() {
                            if (key == 'title') {item.title = textInput.value}
                            else {item.desc = textInput.value}
                            updatePage();
                        }
                        textInput.type = 'text';
                        textInput.value = `${value}`;
                        textInput.placeholder = `${key}`;
                        textInput.classList.add(`task-${key}`);
                        textInput.addEventListener('keydown', (e) => {
                            if (e.key == 'Enter') {
                                confirm();
                            }
                        })
                        if (key == 'title') {textInput.maxLength = '50'} 
                        else {textInput.maxLength = '100'}
                        confirmButton.innerHTML = "<img src='./images/check.png'>"
                        confirmButton.classList.add('confirm-button');
                        confirmButton.addEventListener('click', confirm);
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
                    function confirmDate() {
                        item.dueDate = dateFormat(dateInput.value);
                        updatePage();
                    }
                    confirmButton.innerHTML = "<img src='./images/check.png'>"
                    confirmButton.classList.add('confirm-button');
                    confirmButton.addEventListener('click', confirmDate)
                    dateInput.type = 'date';
                    dateInput.value = format(parsed(item.dueDate), 'yyyy-MM-dd')
                    dateInput.addEventListener('keydown', (e) => {
                        if (e.key == 'Enter') {
                            confirmDate();
                        }
                    })
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

const submitButton = document.querySelector('button#submit')
submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (dueDate.value.length > 10) {
        alert("Please enter a 4-digit year (maximum: 9999).");
    } else if (newForm.checkValidity()) {
        newForm.style.display = 'none';
        if (currentTab == 'Today' || currentTab == 'Upcoming') {
            currentTab = 'Inbox';
        }
        updateTab();
        itemList.push(new Item(
            title.value, desc.value, dateFormat(dueDate.value), priority.value, false,
            ));
        updatePage();
        newForm.reset();
    } else {
        alert('Please fill the task name and date fields.')
    }
})

const cancelButton = document.querySelector('button#cancel');
cancelButton.addEventListener('click', (e) => {
    e.preventDefault();
    newForm.style.display = 'none';
    newForm.reset();
})

const newProject = document.querySelector('button#new-project');
newProject.addEventListener('click', () => {
    let projName = prompt('Name your project:');
    if ( !(( projList.map((a) => a.name)).includes(projName)) && projName.length !== 0 && projName != 'new-project' && projName != "new project" && isNaN(projName[0])) {
        projList.push(new Project(projName, []));
        currentTab = projName;
        updatePage();
    } else if (projName.length == 0) {
        alert('Projects must have a name. Please try again.')
    } else if (!isNaN(projName[0])) {
        alert('Project name cannot start with a number. Please try again.')
    } else {
        alert('Name is already in use or invalid. Please try again.')
    }
})

const updatePage = function() {
    updateTab();
    taskList.innerHTML = '';
    addItems();
    localStorage.setItem("projects", JSON.stringify(projList)); // Store the new project list in local
}

if (localStorage.getItem('projects') != null) {
    projList = [];
    const storedAll = [];
    JSON.parse(localStorage.getItem("projects")).forEach(p => {
        p.items.forEach(i => {
            const newItem = new Item(i.title, i.desc, i.dueDate, i.priority, i.checklist);
            if (!(JSON.stringify(storedAll).includes(JSON.stringify(newItem)))) {
                storedAll.push(newItem);
            }
        })
        projList.push(new Project(p.name, []));
    })
    projList.forEach(proj => {
        storedAll.forEach(item => {
            console.log()
            if (JSON.stringify(JSON.parse(localStorage.getItem('projects')).find((p) => p.name === proj.name).items).includes(JSON.stringify(item))) {
                // jesus christ 
                proj.add(item)
            }
        })
    })
    updatePage();
} else {
    updatePage();
}