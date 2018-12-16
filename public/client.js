




//error handling
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response);
  }
  return response;
}



//POST a blog entry using ajax
function postNewEntry(newEntry) {
  jQuery.ajax({
    url: "/entries",
    type: "POST",
    data: JSON.stringify(newEntry),
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    success: function (data) {
      console.log("successfully added new entry");
      getResults();
    }
  });
}

$(function listenForEntrySubmit() {
  $('main').on('click', '#submit-entry-button', function (event) {
    event.preventDefault();
    console.log("new entry submit clicked");
    let newEntry = {};
    newEntry.activity = $('#activity').val();
    newEntry.location = $('#location').val();
    newEntry.notes = $('#notes').val();
    console.log(newEntry);
    postNewEntry(newEntry);
    $('#activity').val('');
    $('#location').val('');
    $('#notes').val('');
    hideEntryModal();
    $('.user-dashboard').removeClass('opaque');

  })
})

//listen for new entry button
$(function listenForNewEntry() {
  $('main').on('click', '.add-entry-button', function (event) {
    event.preventDefault();
    console.log('add entry button clicked');
    displayEntryModal();
    $('#edit-entry-button').addClass('hidden');
  })
})

//functioning get request using fetch////////////////////////////////////
function getResults() {
  console.log('getResults called');
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



// //GET for current user
// function getResults() {
//   fetch('/entries',
//     {
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       method: "GET"
//     })
//     .then(response => {
//       return response.json()
//     })
//     .then(responseJson => {
//       renderResults(responseJson);
//     })
// }


//add results to DOM
function renderResults(results) {
  const entries = results.entries
  const entriesElementString = generateEntryElementString(entries);
  $('.entries-results').html(entriesElementString);
}

//generate an HTML element representing each entry
function generateEntryElement(entry, Index) {
  return `
    <li class="entry-list-element" entry-index="${entry.id}">
      <span class="entry-item"><h2>Date: ${entry.time}<br>Activity: ${entry.activity} | Location: ${entry.location}</h2><p>${entry.notes}</p></span>
      <div class="entry-controls">
        <button class="entry-edit-button">
            <span class="button-label">edit</span>
        </button>
        <button class="entry-delete-button">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}

//generate one long string containing all entries
function generateEntryElementString(entriesList) {

  const entries = entriesList.map((entry, index) => generateEntryElement(entry, index));

  return entries.join("");
}

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
        'Content-Type': 'application/json'
      },
      method: "DELETE"
    })
    .then(function () {
      getResults();
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
        'Content-Type': 'application/json'
      },
      method: "PUT",
      body: JSON.stringify(req)
    })
    .then(function () {
      console.log('Entry successfully updated');
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
  console.log('populating entry fields');
  console.log(entrytoUpdate);
  $('#entry-id').html(`${entrytoUpdate.id}`)
  $('#activity').val(`${entrytoUpdate.activity}`);
  $('#location').val(`${entrytoUpdate.location}`);
  $('#notes').val(`${entrytoUpdate.notes}`);
}

//listen for entry edit button
$(function listenForEditEntry() {
  $('main').on('click', '.entry-edit-button', function (event) {
    event.preventDefault();
    displayEntryModal();
    $('#submit-entry-button').addClass('hidden');
    $('#edit-entry-button').removeClass('hidden');
    const entryID = getEntryIndex(event.currentTarget);
    console.log(entryID);
    getOne(entryID);
  })
})

//listen for user to submit edited entry
$(function listenForEditSubmit() {
  $('main').on('click', '#edit-entry-button', function (event) {
    event.preventDefault();
    console.log('edit entry button clicked');
    let editedEntry = {};
    editedEntry.activity = $('#activity').val();
    editedEntry.location = $('#location').val();
    editedEntry.notes = $('#notes').val();
    editedEntry.id = $('#entry-id').html();
    console.log(JSON.stringify(editedEntry));
    editEntry(editedEntry);
    hideEntryModal();
    getResults();
    $('#activity').val('');
    $('#location').val('');
    $('notes').val('');
  });
})



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
  })
})

//what does location.reload and localStorage.clear() do?
// function logoutUser() {
//   $('.main').on('click', 'logout-button', function (event) {
//     event.preventDefault();
//     location.reload();
//     localStorage.clear();
//   })
// }


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