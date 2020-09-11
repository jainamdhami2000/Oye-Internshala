//jshint esversion:6

var loc = ['Mathematics', 'Physics', 'Computer Science', 'Finance', 'MBA', 'Design', 'Advanced Excel', 'Autocad', 'Creative Writing', 'Digital Marketing', 'Ethical Hacking', 'Machine Learning', 'Programming with Python', 'Web Development'];
loc.forEach((type) => {
  $('#type').append('<option value="' + type + '">' + type + '</option>');
});
