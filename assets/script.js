L.mapquest.key = 'lCzrKhevQBbPeLBz5rv7JR';

// 'map' refers to a <div> element with the ID map


let launches = [];
let limit  = 100;

let mapKey = '';

const loadData = function(launchDate) {
    let api = `https://lldev.thespacedevs.com/2.2.0/launch/?limit=${limit}&window_start__gte=${launchDate}`;
    fetch(api).then(response => response.json())
    .then(data => {
        launches = data.results;
        const map = L.mapquest.map('map', {
            center: [37.7749, -122.4194],
            layers: L.mapquest.tileLayer('map'),
            zoom: 6,
            
            });
        for(let i=0; i < launches.length; i++) {
            let latitude = launches[i].pad.latitude;
            let longitude = launches[i].pad.longitude;
            let name = launches[i].name;
            let description = launches[i].mission.description;
            let imageurl = launches[i].image;
            L.marker([latitude, longitude], {
                icon: L.mapquest.icons.marker(),
                draggable: false
              }).bindPopup(name).addTo(map).on("click", function(){
                  document.getElementById("info").innerHTML = `
                  <h4>Name : ${name}</h4>
                    <h6><strong>Description</strong></h6>
                    <p>${description}</p>
                    <div>
                        <img src="${imageurl}" alt="" width="100%">
                    </div>
                  `;
              });
        }
    })
}



$(function() {
    $( "#datepicker" ).datepicker( {
        minDate: 0,
        dateFormat: "yy-mm-ddT00:00:00Z",
        onSelect: function(date, picker){
            console.log(date)
            document.getElementById("saved-searches").innerHTML = 
            document.getElementById("saved-searches").innerHTML +
             `<button class="saved-search">${date}</button>`;
            loadData(date);
        }
    });
});


