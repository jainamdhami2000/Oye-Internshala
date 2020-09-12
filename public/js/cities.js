//jshint esversion:6

var loc = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata'];
loc.forEach((cities) => {
  $('#loc').append('<option value="' + cities + '">' + cities + '</option>');
});
loc.forEach((cities) => {
  if (locationc == cities) {
    $('#loc').append('<option value="' + cities + '" selected>' + cities + '</option>');
  } else {
    $('#loc').append('<option value="' + cities + '">' + cities + '</option>');
  }
});
