//////////////////////////////////////
// JAVASCRIPT GOODIES!        //
// Making the world a better place. //
//////////////////////////////////////

// This function gets the current time and injects it into the DOM
function updateClock() {
    // Gets the current time
    var now = new Date();

    // Get the hours, minutes and seconds from the current time

    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var day = now.getDate();
    var month = now.getMonth()+1;
    var year = now.getFullYear();

    // Format hours, minutes and seconds
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    // Gets the element we want to inject the clock into
    var elem = document.getElementById('clock');

    // Sets the elements inner HTML value to our clock data
    elem.innerHTML = hours + ':' + minutes + ':' + seconds;
    elem.title = 'Date: ' + year + '-' + month + '-' + day;

}

function vis_toggle(id) {
    var e = document.getElementById(id);
    if(e.style.display == 'block')
        e.style.display = 'none';
    else
        e.style.display = 'block';
}
