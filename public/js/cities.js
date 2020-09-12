//jshint esversion:6

var loc = ['Delhi','Mumbai','Bangalore','Chennai','Hyderabad','Kolkata'];
loc.forEach((cities) => {
    $('#loc').append('<option value="'+cities+'">' + cities + '</option>');
    }
);
loc.forEach((cities) => {
    $('#loc1').append('<option value="'+cities+'">' + cities + '</option>');
    }
);
