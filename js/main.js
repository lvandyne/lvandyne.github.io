function initMap() {
  var position = {lat: 40.8054491, lng: -73.9654415};
  var map = new google.maps.Map(document.getElementById('map'), {
    center: position,
    zoom: 12
  });
  var marker = new google.maps.Marker({
    position: position,
    map: map
  });
}
