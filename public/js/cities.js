var loc = ['Delhi','Mumbai','Bangalore','Chennai','Hyderabad','Kolkata'];
loc.forEach((cities) => {
    $('#loc').append('<option value="'+cities+'">' + cities + '</option>');
    }
)
