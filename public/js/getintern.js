function details(input) {
  document.getElementById("job" + input.id).submit();
}
const URL = "/admin/jobtitles"
var resArray = []
$.ajax({
  url: URL,
  method: "GET"
}).done(function(data) {
  console.log(data);
  window.resArray = data;
  data.forEach((item) => {
    if (typeof(searchCategory) != 'undefined') {
      if (item.job_category == searchCategory) {
        console.log("Entered the if");
        $('#category').append('<option value="' + item.job_category + '" selected>' + item.job_category + '</option>');
      } else {
        $('#category').append('<option value="' + item.job_category + '">' + item.job_category + '</option>');
      }
    } else {
      $('#category').append('<option value="' + item.job_category + '">' + item.job_category + '</option>');
    }
  });
});

$.ajax({
  url: URL,
  method: "GET"
}).done(function(data) {
  console.log(searchTitle);
  if (searchTitle != '') {
    console.log("I entered searchTitle")
    console.log(data)
    data.forEach(item => {
      if (item.job_category === searchCategory) {
        item.job_title.forEach(titles => {
          if (titles == searchTitle) {
            $('#title').append('<option value="' + titles + '"selected>' + titles + '</option>');
          } else {
            $('#title').append('<option value="' + titles + '">' + titles + '</option>');
          }
        });
      }
    });
  }
});

$('#category').on('change', function() {
  selectedcategory = $('#category').find(":selected").text();
  $('#title option').remove();
  if ($('#category').find(":selected").val() === 'none') {
    $('#subcategory').append("<option value='none'>-------------</option>");
  } else {
    resArray.forEach(item => {
      if (item.job_category === selectedcategory) {
        item.job_title.forEach(titles => {
          $('#title').append('<option value="' + titles + '">' + titles + '</option>');
        });
      }
    });
  }
});
