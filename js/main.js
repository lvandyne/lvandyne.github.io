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
// Move this line so that we can reference this database elsewhere
var reservationReference = database.ref('reservation');

$('#makeReservation').on('submit', function (e) {
  // prevent the page from reloading
  e.preventDefault();
  // grab user's comment from input field
  var userName = $('#name').val();
  var userDay = $('#day').val();
  var userPin = $('#pin').val();

  if (userName === "" || userDay === "" || userPin === ""){
    $('#error').html('*All fields are required.')
  } else if (userPin.length != 4) {
    $('#error').html('*Please make sure your pin is 4 digits.')
  } else {
    // clear the user's comment from the input (for UX purposes)
    $('#name').val('');
    $('#day').val('');
    $('#pin').val('');
    // use the set method to save data to the comments
    reservationReference.push({
      name: userName,
      day: userDay,
      pin: userPin
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
        pin: allReservations[item].pin,
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
    $('#existingReservations tbody td').remove()
    // append each comment to the list of comments in the DOM
    for (var i in reservationsMade) {
      $('#existingReservations tbody').append(reservationsMade[i])
    }
  });
}
getReservations();

$('tbody').on('click', 'td i.delete', function (e) {
  // Get the ID for the comment we want to update
  var enteredPin = prompt('Please enter your pin');
  var id = $(e.target).parent().parent().data('id');
  var pin = $(e.target).parent().data('id');
  if(pin == enteredPin){
  // Use remove method to remove the comment from the database
		// using the "remove" method this way will remove all data in your database
		//reservationReference.remove()
		// use the "child" method to select the actual data that you want to remove
		reservationReference.child(id).remove();
  }
});

var week = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
function checkHours () {
  var d = new Date();
  var a = d.getDay();
  var h = d.getHours();
  var today = week[a];
  $('#'+today).css('background-color', '#ec5840').css('color', 'white').next().css('background-color', '#ec5840').css('color', 'white');
  if (h > 8 && h < 22){
    $('#openClose').html('We are currently open!');
  } else {
    $('#openClose').html('See you in the morning!');
  }
}
checkHours();
