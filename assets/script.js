fetch ("https://lldev.thespacedevs.com/2.2.0/launch/?limit=100&window_start__gte=2022-02-01T00%3A00%3A00Z&window_start__lte=2022-03-01T00%3A00%3A00Z")
    .then(response => response.json())
    .then(data => {
        for (var i = 0; i < data.count; i++) {
            launches = data.results;
            console.log(launches[i].window_start.slice(0,10));
        }
    })

var array = ["2022-02-14","2022-02-16","2022-02-18"];

$( "#datePicker" ).datepicker({
    showOn: "button",
    buttonText: "day",
    beforeShowDay: function(date){
        var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
        return [ array.indexOf(string) == -1 ]
    }
});