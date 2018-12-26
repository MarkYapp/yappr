




//error handling
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response);
  }
  return response;
}



//POST a blog entry using ajax
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

  // jQuery.ajax({
  //   url: "/entries",
  //   type: "POST",
  //   data: JSON.stringify(newEntry),
  //   dataType: "json",
  //   contentType: "application/json; charset=utf-8",
  //   success: function (data) {
  //     console.log("successfully added new entry");
  //     getEntries();
  //   }
  // });
}




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

  })
})

//listen for new entry button
$(function listenForNewEntry() {
  $('main').on('click', '.add-entry-button', function (event) {
    event.preventDefault();
    displayEntryModal();
    $('#submit-entry-button').removeClass('hidden');
    $('#edit-entry-button').addClass('hidden');
  })
})

//functioning get request using fetch////////////////////////////////////
function getEntries() {
  fetch('/entries',
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`

      },
      method: "GET",

    })
    .then(response => {
      return response.json()
    })
    .then(responseJson => {
      renderResults(responseJson);
    })
}

//add results to DOM
function renderResults(results) {
  const entries = results.entries
  const entriesElementString = generateEntryElementString(entries);
  $('.entries-results').html(entriesElementString);
}

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
}

//generate one long string containing all entries
function generateEntryElementString(entriesList) {
  const entries = entriesList.map(entry => generateEntryElement(entry));
  return entries.join("");
}


// 1st sort
// function compare(a, b) {
//   const genreA = a.timestamp;
//   const genreB = b.timestamp;

//   let comparison = 0;
//   if (genreA > genreB) {
//     comparison = 1;
//   } else if (genreA < genreB) {
//     comparison = -1;
//   }
//   return comparison;
// }

function getEntryIndex(entry) {
  const entryID = $(entry).closest('.entry-list-element').attr('entry-index');
  return entryID;
}

//listen for entry delete
$(function listenForDelete() {
  $('.entries-results').on('click', '.entry-delete-button', (function (event) {
    event.preventDefault();
    const entryID = getEntryIndex(event.currentTarget);
    deleteEntry(entryID);
  })
  )
});

//delete an entry
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
    }
    )
    .catch(error => console.log(error.message));
}

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
      //add error handling
      getEntries();
    }
    )
    .catch(error => console.log(error.message));
}

//get one entry
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
    }
    )
    .catch(error => console.log(error.message));
}

//auto-fill fields to be edited
function populateEditFields(entrytoUpdate) {
  $('.edit-modal-title').text(`Update blog entry`)
  $('#modal-entry-id').text(`${entrytoUpdate._id}`);
  $('#activity-field').val(`${entrytoUpdate.activity}`);
  $('#location-field').val(`${entrytoUpdate.location}`);
  $('#notes-field').val(`${entrytoUpdate.notes}`);
}

//listen for entry edit button
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
  })
})

//listen for user to submit edited entry
$(function listenForEditSubmit() {
  $('main').on('click', '#edit-entry-button', function (event) {
    event.preventDefault();
    let editedEntry = {};
    editedEntry.activity = $('#activity-field').val();
    editedEntry.location = $('#location-field').val();
    editedEntry.notes = $('#notes-field').val();
    editedEntry.id = $('#modal-entry-id').text(); ///asdfasdfasdfasdfa
    editEntry(editedEntry);
    hideEntryModal();
    getEntries();
    clearEntryFields()
  });
})

function clearEntryFields() {
  $('#activity-field').val('');
  $('#location-field').val('');
  $('#notes-field').val('');
  $('.edit-modal-title').addClass('hidden');
  $('.add-modal-title').removeClass('hidden');

}



function displayEntryModal() {
  $('.add-entry-modal').removeClass('hidden');
  $('.user-dashboard').addClass('opaque');
}

function hideEntryModal() {
  $('.add-entry-modal').addClass('hidden');
  $('.user-dashboard').removeClass('opaque');
}

//listen for entry submit/edit Cancel
$(function listenForCancelEntry() {
  $('main').on('click', '#cancel-entry-button', function (event) {
    event.preventDefault();
    hideEntryModal();
    clearEntryFields();
    $('edit-modal-title').addClass('hidden');

  })
})

$(function logoutUser() {
  $('main').on('click', '.logout-button', function (event) {
    event.preventDefault();
    localStorage.clear();
    location.reload();
  })
})


//geoLocation
// button.getLocation("click", function() {
//   console.log("button clicked")
//   navigator.geolocation.getCurrentPosition(showPosition);

//   }
// )

// function showPosition(position) {
//   console.log(position);
//   x = document.getElementById("results");
//   x.innerHTML = "Latitude: " + position.coords.latitude + 
//     "<br>Longitude: " + position.coords.longitude;
// }

//log date and time
// function requestLogger(req, res, next) {
//   const now = new Date();
//   console.log(
//     `${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${req.method} ${req.url}`);
//   next();
// }


// var mock_entries = {
//   "entries": [
//     {
//       "id": "1111111",
//       "place": "New York",
//       "eatLocation": "A really cool diner",
//       "sleepLocation": "A friend's house",
//       "publishDate": 1470016976609
//     },
//     {
//       "id": "2222222",
//       "place": "Steamboat Springs",
//       "eatLocation": "Creekside Cafe",
//       "sleepLocation": "Camped halfway up a dirt road outside of town",
//       "publishDate": 1470016976609
//     },
//     {
//       "place": "Guadalajara",
//       "eatLocation": "On the beach",
//       "sleepLocation": "At a hostel",
//       "publishDate": 1470016976609
//     },
//   ]
// };

// function getRecentStatusUpdates(callbackFn) {
//   setTimeout(function () { callbackFn(mock_entries) }, 100);
// }

// // this function stays the same when we connect
// // to real API later
// function displayStatusUpdates(data) {
//   for (index in data.entries) {
//     $('body').append(
//       '<p>Place: ' + data.entries[index].place + '</p><p>Where we ate: ' + data.entries[index].eatLocation + '</p>');
//   }
// }

// // this function can stay the same even when we
// // are connecting to real API
// function getAndDisplayStatusUpdates() {
//   getRecentStatusUpdates(displayStatusUpdates);
// }

// $(function () {
//   getAndDisplayStatusUpdates();
// })