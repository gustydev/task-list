import Item from "./itemCreator.js";

class Project {
  constructor(id, name, items) {
    this.id = id;
    this.name = name;
    this.items = items;
  }
  add(item) {
    this.items.push(item);
  }
  remove(item) {
    this.items = this.items.filter((a) => a != item);
  }
  clear() {
    this.items = [];
  }
}

export default Project;
