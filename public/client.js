
function postNewEntry(newEntry) {
  fetch('/entries',
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      method: "POST",
      body: JSON.stringify(newEntry)
    })
    .then(response => {
      getEntries();
      return response.json()
    })
    .catch(error => console.log('Bad request'));
};

$(function listenForEntrySubmit() {
  $('main').on('click', '#submit-entry-button', function (event) {
    event.preventDefault();
    let newEntry = {};
    newEntry.activity = $('#activity-field').val();
    newEntry.location = $('#location-field').val();
    newEntry.notes = $('#notes-field').val();
    postNewEntry(newEntry);
    hideEntryModal();
    clearEntryFields();
    $('.user-dashboard').removeClass('opaque');
  });
});

$(function listenForNewEntry() {
  $('main').on('click', '.add-entry-button', function (event) {
    event.preventDefault();
    displayEntryModal();
    $('#submit-entry-button').removeClass('hidden');
    $('#edit-entry-button').addClass('hidden');
  });
});

//GET all entries
function getEntries() {
  fetch('/entries',
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      method: "GET"
    })
    .then(response => {
      return response.json()
    })
    .then(responseJson => {
      renderResults(responseJson);
    })
    .catch(error => console.log('Bad request'));
};

function renderResults(results) {
  const entries = results.entries
  const entriesElementString = generateEntryElementString(entries);
  $('.entries-results').html(entriesElementString);
};

//generate an HTML element representing each entry
function generateEntryElement(entry) {
  return `
  <li class="entry-list-element" entry-index="${entry.id}">
  <div class="entry-controls">
    <button class="entry-edit-button entry-button">edit</button>
    <button class="entry-delete-button entry-button">delete</button>
  </div>
      <span class="entry-item"><h3>${entry.activity} | ${entry.location} | ${entry.userDate}</h2><p>${entry.notes}</p></span>
    </li>`;
};

//generate a single string containing all entries
function generateEntryElementString(entriesList) {
  const entries = entriesList.map(entry => generateEntryElement(entry));
  return entries.join("");
};

function getEntryIndex(entry) {
  const entryID = $(entry).closest('.entry-list-element').attr('entry-index');
  return entryID;
};

$(function listenForDelete() {
  $('.entries-results').on('click', '.entry-delete-button', function (event) {
    event.preventDefault();
    const entryID = getEntryIndex(event.currentTarget);
    deleteEntry(entryID);
  });
});

function deleteEntry(entryID) {
  fetch(`/entries/${entryID}`,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      method: "DELETE"
    })
    .then(function () {
      getEntries();
    })
    .catch(error => console.log('Bad request'));
};

//update an entry
function editEntry(req) {
  fetch(`/entries/${req.id}`,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      method: "PUT",
      body: JSON.stringify(req)
    })
    .then(function () {
      getEntries();
    })
    .catch(error => console.log('Bad request'));
};

//GET a single entry
function getOne(entryID) {
  fetch(`/entries/${entryID}`,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      method: "GET"
    })
    .then(response => {
      return response.json()
    })
    .then(res => {
      populateEditFields(res);
    })
    .catch(error => console.log('Bad request'));
};

function populateEditFields(entrytoUpdate) {
  $('.edit-modal-title').text(`Update blog entry`)
  $('#modal-entry-id').text(`${entrytoUpdate._id}`);
  $('#activity-field').val(`${entrytoUpdate.activity}`);
  $('#location-field').val(`${entrytoUpdate.location}`);
  $('#notes-field').val(`${entrytoUpdate.notes}`);
};

$(function listenForEditEntry() {
  $('main').on('click', '.entry-edit-button', function (event) {
    event.preventDefault();
    displayEntryModal();
    $('.add-modal-title').addClass('hidden');
    $('.edit-modal-title').removeClass('hidden');
    $('#submit-entry-button').addClass('hidden');
    $('#edit-entry-button').removeClass('hidden');
    const entryID = getEntryIndex(event.currentTarget);
    getOne(entryID);
  });
});

$(function listenForEditSubmit() {
  $('main').on('click', '#edit-entry-button', function (event) {
    event.preventDefault();
    let editedEntry = {};
    editedEntry.activity = $('#activity-field').val();
    editedEntry.location = $('#location-field').val();
    editedEntry.notes = $('#notes-field').val();
    editedEntry.id = $('#modal-entry-id').text();
    editEntry(editedEntry);
    hideEntryModal();
    getEntries();
    clearEntryFields()
  });
});

function clearEntryFields() {
  $('#activity-field').val('');
  $('#location-field').val('');
  $('#notes-field').val('');
  $('.edit-modal-title').addClass('hidden');
  $('.add-modal-title').removeClass('hidden');
};

function displayEntryModal() {
  $('.add-entry-modal').prop('hidden', false);
  $('.user-dashboard').addClass('opaque');
};

function hideEntryModal() {
  $('.add-entry-modal').prop('hidden', true);
  $('.user-dashboard').removeClass('opaque');
};

$(function listenForCancelEntry() {
  $('main').on('click', '#cancel-entry-button', function (event) {
    event.preventDefault();
    hideEntryModal();
    clearEntryFields();
    $('edit-modal-title').addClass('hidden');
  });
});

$(function logoutUser() {
  $('main').on('click', '.logout-button', function (event) {
    event.preventDefault();
    localStorage.clear();
    location.reload();
  });
});