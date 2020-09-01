var loc = ['Delhi','Mumbai','Bangalore','Chennai','Hyderabad','Kolkata'];
loc.forEach((cities) => {
    if(cities == city){
        $('#loc').append('<option value="'+cities+'" selected>' + cities + '</option>');
    }
    else{
        $('#loc').append('<option value="'+cities+'">' + cities + '</option>');
    }
})
