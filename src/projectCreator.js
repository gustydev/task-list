import Item from './itemCreator.js';

class Project {
    constructor(name) {
        this.name = name;
        this.itemList = [];
    }
    newItem(title, desc, dueDate, priority) {
        this.itemList.push(new Item(title, desc, dueDate, priority, false));
    }
}

export default Project;