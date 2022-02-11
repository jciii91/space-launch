todaysDate = moment().format("YYYY-MM-DD");
thisYear =  parseInt(todaysDate.slice(0,4));
thisMonth = parseInt(todaysDate.slice(5,7));
launchMonths = [];
badDatesArray = [];

function getLaunches() {
    if (thisMonth < 10) {
        lastDate = thisYear + "-0" + (thisMonth + 1) + "-01";
    } else {
        lastDate = thisYear + "-" + (thisMonth + 1) + "-01";
    }

    if (thisMonth == 12) {
        lastDate = (thisYear + 1) + "-01-01";
    }

    launchMonths.push(getLaunchArray(todaysDate,lastDate));

    var yearIndex = thisYear;
}

function getLaunchArray(first,last) {
    fetch ("https://lldev.thespacedevs.com/2.2.0/launch/?limit=100&window_start__gte=" + first + "T00%3A00%3A00Z&window_start__lte=" + last + "T00%3A00%3A00Z")
    .then(response => response.json())
    .then(data => {
        for (var i = 0; i < data.count; i++) {
            launches = data.results;
            console.log(launches[i].window_start.slice(0,10));
        }
    })
}

$( "#datePicker" ).datepicker({
    showOn: "button",
    buttonText: "day",
    beforeShowDay: function(date){
        var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
        return [ array.indexOf(string) == -1 ]
    }
});

getLaunches();