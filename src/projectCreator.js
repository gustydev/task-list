import Item from './itemCreator.js';

class Project {
    constructor(name, items) {
        this.name = name;
        this.items = items;
    }
    add(item) {
        this.items.push(item);
    }
    remove(item) {
        this.items = this.items.filter(a => a != item);
        // const index = this.itemList.indexOf(item);
        // if (index > -1) {
        //     this.itemList.splice(index, 1);
        // }
    }
}

export default Project;