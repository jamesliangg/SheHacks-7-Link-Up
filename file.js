// global variables
var eventArray = [];
var today = new Date();
var calendar = null
var beginningFormat = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//James Liang//SheHacks//EN`;
var ending = 'END:VCALENDAR';

// files
/**
 * https://ourcodeworld.com/articles/read/1438/how-to-read-multiple-files-at-once-using-the-filereader-class-in-javascript
 * 
 * @returns 
 */
function getFiles() {
    var currentTarget = document.getElementById("fileinput");
    let files = currentTarget.files;
    let readers = [];
    // Abort if there were no files selected
    if(!files.length) return;
    // Store promises in array
    for(let i = 0;i < files.length;i++){
      readers.push(readFileAsText(files[i]));
    }
    // Trigger Promises
    Promise.all(readers).then((values) => {
      // Values will be an array that contains an item
      // with the text of every selected file
      // ["File1 Content", "File2 Content" ... "FileN Content"]
      for (var i in values) {
        fileToArray(values[i]);
      }
    });
  }

/**
 * https://ourcodeworld.com/articles/read/1438/how-to-read-multiple-files-at-once-using-the-filereader-class-in-javascript
 * 
 * @param {*} file 
 * @returns 
 */
function readFileAsText(file){
    return new Promise(function(resolve,reject){
        let fr = new FileReader();
        fr.onload = function(){
            resolve(fr.result);
        };
        fr.onerror = function(){
            reject(fr);
        };
        fr.readAsText(file);
    });
  }

/**
 * Converts file to array
 * 
 * @param {String} input calendar file
 */
function fileToArray(input) {
    var inputArray = input.split("\n");
    for (var i in inputArray) {
        if (inputArray[i].includes("DTEND;")) {
            // format YYYYMMDD
            var eventDate = String(/[2]\d\d\d\d\d\d\d/.exec(inputArray[i]));
            // format HHMMSS
            var endTime = String(/\d\d\d\d\d\d/.exec(/[T]\d\d\d\d\d\d/.exec(inputArray[i])));
        } 
        else if (inputArray[i].includes("DTSTART;")) {
            // format HHMMSS
            var beginTime = String(/\d\d\d\d\d\d/.exec(/[T]\d\d\d\d\d\d/.exec(inputArray[i])));
            eventArray.push([eventDate, beginTime, endTime]);
        } 
    }
    // remove duplicates
    eventArray = multiDimensionalUnique(eventArray);
    eventArray = eventArray.sort();
    console.log(eventArray);
    // remove overlapping events
    removeOverlap(eventArray);
}

/**
 * Retrieves values required for calendar files and formats text
 */
function downloadPlan() {
    var beginDate = document.getElementById("beginDate").value;
    var beginTime = document.getElementById("beginTime").value;
    var endDate = document.getElementById("endDate").value;
    var endTime = document.getElementById("endTime").value;
    var eventTitle = document.getElementById("eventTitle").value;
    var eventLocation = document.getElementById("location").value;
    fileOutput = fileOutput + "\n" + ("BEGIN:VEVENT");
    fileOutput = fileOutput + "\n" + (`DTSTART;TZID=America/Toronto:${beginDate.replace(/-/g,'')}T${beginTime.replace(':','')}00`);
    fileOutput = fileOutput + "\n" + (`DTEND;TZID=America/Toronto:${endDate.replace(/-/g,'')}T${endTime.replace(':','')}00`);
    fileOutput = fileOutput + "\n" + (`SUMMARY:${eventTitle}`);
    fileOutput = fileOutput + "\n" + (`LOCATION:${eventLocation}`)
    fileOutput = fileOutput + "\n" + ("END:VEVENT");
    fileOutput = fileOutput + "\n" + ending;
    download('trip_plan.ics', fileOutput);
}

/**
 * Creates and downloads file
 * https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
 * 
 * @param {String} filename name of downloaded file
 * @param {String} text file contents
 */
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// arrays
/**
 * Removes duplicate entries in array
 * https://stackoverflow.com/questions/20339466/how-to-remove-duplicates-from-a-two-dimensional-array
 * 
 * @param {Array} arr array to be modified
 * @returns unique array
 */
function multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
  }

/**
 * Checks for events that are within another timeslot
 * 
 * @param {Array} inputArray array to be checked
 */
function removeOverlap(inputArray) {
    for (var i = 0; i < inputArray.length - 1; i++) {
        if (inputArray[i][0].includes(inputArray[i+1][0])) {
            if (inputArray[i+1][1] <= inputArray[i][2]) {
                inputArray[i+1][1] = inputArray[i][1];
                inputArray.splice(i, 1);
            }
        }
    }
    console.log(inputArray);
    findAvailability(inputArray);
}

// algorithm
/**
 * 
 * 
 * @param {Array} inputArray 
 */
function findAvailability(inputArray) {
    calendar.removeAllEvents();
    for (var i in inputArray) {
        let year = inputArray[i][0].substring(0,4);
        let month = inputArray[i][0].substring(4,6);
        let day = inputArray[i][0].substring(6,8);
        let beginTime = inputArray[i][1].replace(/..\B/g, '$&:');
        let endTime = inputArray[i][2].replace(/..\B/g, '$&:');
        let beginEvent = year + "-" + month + "-" + day + "T" + beginTime;
        let endEvent = year + "-" + month + "-" + day + "T" + endTime;
        console.log(beginEvent);
        console.log(endEvent);
        newEvent(beginEvent, endEvent);
    }
}

// calendar
/**
 * Creates calendar
 */
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
  
    calendar = new FullCalendar.Calendar(calendarEl, {
    //   hiddenDays: [0,6],
    //   height: '98%',
      slotDuration: '00:30:00',
      scrollTime: '08:00:00',
      // slotMinTime: '08:00:00',
      handleWindowResize: true,
      initialView: 'timeGridWeek',
      initialDate: today,
    //   nowIndicator: true,
      allDaySlot: false,
      expandRows: true,
      eventBackgroundColor: '#3c933f',
      headerToolbar: {
        left: 'title',
        center: '',
        right: 'today,prev,next'
      },
      buttonIcons: {
        prev: 'chevron-left',
        next: 'chevron-right',
        prevYear: 'chevrons-left', // double chevron
        nextYear: 'chevrons-right' // double chevron
      },
      dayHeaderFormat: {
        weekday: 'short'
      }
    });
    calendar.render();
  });

/**
 * Creates new break event based on inputs
 * 
 * @param {String} beginTime HHMMSS
 * @param {String} endTime HHMMSS
 */
function newEvent(beginTime, endTime) {
    
    // create break events
    calendar.addEvent({
      title: 'Unavailable',
      start: beginTime,
      end: endTime,
      allDay: false
    });
  }