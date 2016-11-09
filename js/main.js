function initMap() {
  var position = {lat: 40.8054491, lng: -73.9654415};
  var map = new google.maps.Map(document.getElementById('map'), {
    center: position,
    zoom: 10,
    scrollwheel: false
  });
  var marker = new google.maps.Marker({
    position: position,
    map: map,
    title: 'Monks Café'
  });
}

var config = {
  apiKey: "AIzaSyBH-IF73ekO_6UOYXgMK7GoS1HTHJDzM94",
  authDomain: "unit-9-code-2-challenge.firebaseapp.com",
  databaseURL: "https://unit-9-code-2-challenge.firebaseio.com",
  storageBucket: "unit-9-code-2-challenge.appspot.com",
  messagingSenderId: "397379780968"
};
firebase.initializeApp(config);
var database = firebase.database();

$('#makeReservation').on('submit', function (e) {
  // prevent the page from reloading
  e.preventDefault();
  // grab user's comment from input field
  var userName = $('#name').val();
  var userDay = $('#day').val();

  if (userName === "" || userDay === ""){
    $('#error').html('*All fields are required.')
  } else {
    // clear the user's comment from the input (for UX purposes)
    $('#name').val('')
    $('#day').val('');
    // create a section for comments data in your db
    var reservationReference = database.ref('reservation');
    // use the set method to save data to the comments
    reservationReference.push({
      name: userName,
      day: userDay
    });
  }
});

function getReservations (){
  database.ref('reservation').on('value', function (results) {
    var allReservations = results.val();
    var reservationsMade = [];
    for (var item in allReservations) {
      var context = {
        name: allReservations[item].name,
        day: allReservations[item].day,
        reservationId: item
      };
      // Get the HTML from our Handlebars comment template
      var source = $("#reservation-template").html();
      // Compile our Handlebars template
      var template = Handlebars.compile(source);
      // Pass the data for this comment (context) into the template
      var reservationRowElement = template(context);
      // push newly created element to array of comments
      reservationsMade.push(reservationRowElement)
    }
    // remove all list items from DOM before appending list items
    $('.existingReservations').empty()
    // append each comment to the list of comments in the DOM
    for (var i in reservationsMade) {
      $('#existingReservations tbody').append(reservationsMade[i])
    }
  });
}
getReservations();