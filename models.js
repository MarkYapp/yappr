const uuid = require('uuid');

// this module provides volatile storage, using a `ShoppingList`
// and `Recipes` model. We haven't learned about databases yet,
// so for now we're using in-memory storage. This means each time
// the app stops, our storage gets erased.

// don't worry to much about how `ShoppingList` and `Recipes`
// are implemented. Our concern in this example is with how
// the API layer is implemented, and getting it to use an
// existing model.


function StorageException(message) {
  this.message = message;
  this.name = "StorageException";
}

function createEntries() {
  const storage = Object.create(Entries);
  storage.items = {};
  return storage;
}

const Entries = {
  create: function (location, details) {
    console.log('Creating a new entry');
    const item = {
      location: location,
      id: uuid.v4(),
      details: details
    };
    this.items[item.id] = item;
    return item;
  },
  get: function () {
    console.log('Retreiving recipes');
    return Object.keys(this.items).map(key => this.items[key]);
  },
  delete: function (itemId) {
    console.log(`Deleting recipe with id \`${itemId}\``);
    delete this.items[itemId];
  },
  update: function (updatedItem) {
    console.log(`Updating recipe with id \`${updatedItem.id}\``);
    const { id } = updatedItem;
    if (!(id in this.items)) {
      throw StorageException(
        `Can't update item \`${id}\` because doesn't exist.`)
    }
    this.items[updatedItem.id] = updatedItem;
    return updatedItem;
  }
};


function createEntries() {
  const storage = Object.create(Entries);
  storage.items = {};
  return storage;
}

module.exports = {
  Entries: createEntries()
}