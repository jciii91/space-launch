var todaysDate = moment().format("YYYY-MM-DD");
var thisYear =  parseInt(todaysDate.slice(0,4));
var thisMonth = parseInt(todaysDate.slice(5,7));
var badDatesArray = [];

var currentYear;
var currentMonth;


function getLaunches() {
    getBadDates(todaysDate,lastDate);
}

function getBadDates(inputYear,inputMonth) {
    badDatesArray = [];
    var maxDay = 31;

    switch(inputMonth) {
        case "January":
            month = "01";
            nextMonth = "02"
            nextYear = inputYear;
            maxDay = 31;
            break;
        case "February":
            month = "02";
            nextMonth = "03"
            nextYear = inputYear;
            maxDay = 28;
            if (inputYear % 4 == 0) {maxDay = 29}
            break;
        case "March":
            month = "03";
            nextMonth = "04"
            nextYear = inputYear;
            maxDay = 31;
            break;
        case "April":
            month = "04";
            nextMonth = "05"
            nextYear = inputYear;
            maxDay = 30;
            break;
        case "May":
            month = "05";
            nextMonth = "06"
            nextYear = inputYear;
            maxDay = 31;
            break;
        case "June":
            month = "06";
            nextMonth = "07"
            nextYear = inputYear;
            maxDay = 30;
            break;
        case "July":
            month = "07";
            nextMonth = "08"
            nextYear = inputYear;
            maxDay = 31;
            break;
        case "August":
            month = "08";
            nextMonth = "09"
            nextYear = inputYear;
            maxDay = 31;
            break;
        case "September":
            month = "09";
            nextMonth = "10"
            nextYear = inputYear;
            maxDay = 30;
            break;
        case "October":
            month = "10";
            nextMonth = "11"
            nextYear = inputYear;
            maxDay = 31;
            break;
        case "November":
            month = "11";
            nextMonth = "12"
            nextYear = inputYear;
            maxDay = 30;
            break;
        case "December":
            month = "12";
            nextMonth = "01"
            nextYear = parseInt(inputYear) + 1;
            maxDay = 31;
            break;
    }

    query = "https://lldev.thespacedevs.com/2.2.0/launch/?limit=100&window_start__gte=" + inputYear + "-" + month + "-01T00%3A00%3A00Z&window_start__lt=" + nextYear + "-" + nextMonth + "-01T00%3A00%3A00Z"

    fetch ("https://lldev.thespacedevs.com/2.2.0/launch/?limit=100&window_start__gte=" + inputYear + "-" + month + "-01T00%3A00%3A00Z&window_start__lt=" + nextYear + "-" + nextMonth + "-01T00%3A00%3A00Z")
    .then(response => response.json())
    .then(data => {
        for (var i = 0; i < data.count; i++) {
            launches = data.results;
            badDatesArray.push(launches[i].window_start.slice(0,10));
        }
        
        calendar = document.createElement("input");
        calendar.setAttribute("type","input");
        calendar.setAttribute("id","datePicker");
        calendar.setAttribute("class","datepicker");

        document.getElementById("calendarHolder").appendChild(calendar);

        var calID = $( "#datePicker" )

        calID.datepicker({
            minDate: month + "/01/" + year,
            maxDate: month + "/" + maxDay + "/" + year,
            beforeShowDay: function(date){
                var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
                var array = badDatesArray;
                return [ array.indexOf(string) == -1 ];
            },
            onClose: function(date){
                console.log(date);
                calID.remove();
            }
        });

        calID[0].focus();
    })
}

$("#setMonth").on("click",function(){
    year = $("#launchYear")[0].value;
    month = $("#monthsList")[0].value;
    getBadDates(year,month);
});

//getLaunches();
//getBadDates(2022,"01");