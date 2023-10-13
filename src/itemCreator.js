class Item {
    constructor(title, desc, dueDate, priority, checklist) {
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.checklist = checklist;
    }
    check() {
        if (this.checklist === false) {
            this.checklist = true;
        } else {
            this.checklist = false;
        }
    }
}

export default Item;