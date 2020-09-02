var loc = ['Mathematics','Physics','Computer Science','Finance','MBA','Design'];
loc.forEach((type) => {
    $('#type').append('<option value="'+type+'">' + type + '</option>');
    }
)
