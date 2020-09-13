$('#PaidToggle').click(function(){
    $('.viewPaid').toggle();
})
$('#SiteToggle').click(function(){
    $('.viewSite').toggle();
})

var loc = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata'];
loc.forEach((cities) => {
  $('#loc1').append('<option value="' + cities + '">' + cities + '</option>');
});

    $("#MainToggle").on('click', function() {
        $(".dispIntern").toggle();
        $(".dispJob").toggle();
    })
    $(".togglebutton").off("click","**");

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
        $('.category').append('<option value="' + item.job_category + '">' + item.job_category + '</option>');
        $('.Category').append('<option value="' + item.job_category + '">' + item.job_category + '</option>');
    })
    });




  $('.category').on('change', function() {
    selectedcategory = $('.category').find(":selected").text();
    $('.Title option').remove();
    if ($('#category').find(":selected").val() === 'none') {
      $('#subcategory').append("<option value='none'>-------------</option>");
    } else {
      resArray.forEach(item => {
        if (item.job_category === selectedcategory) {
          item.job_title.forEach(titles => {
            $('.Title').append('<option value="' + titles + '">' + titles + '</option>');
          });
        }
      });
    }
  });

  $('.Category').on('change', function() {
    selectedcategory = $('.Category').find(":selected").text();
    $('.Title1 option').remove();
    if ($('#category').find(":selected").val() === 'none') {
      $('#subcategory').append("<option value='none'>-------------</option>");
    } else {
      resArray.forEach(item => {
        if (item.job_category === selectedcategory) {
          item.job_title.forEach(titles => {
            $('.Title1').append('<option value="' + titles + '">' + titles + '</option>');
          });
        }
      });
    }
  });
