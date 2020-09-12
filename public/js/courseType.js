//jshint esversion:6

var loc = ['Mathematics', 'Physics', 'Computer Science', 'Finance', 'MBA', 'Design', 'Advanced Excel', 'Autocad', 'Creative Writing', 'Digital Marketing', 'Ethical Hacking', 'Machine Learning', 'Programming with Python', 'Web Development'];
loc.forEach((type) => {
  $('#type1').append('<option value="' + type + '">' + type + '</option>');
});

loc.forEach((type) => {
  if (type == coursetype) {
    $('#type').append('<option value="' + type + '" selected>' + type + '</option>');
  } else {
    $('#type').append('<option value="' + type + '">' + type + '</option>');
  }
});
