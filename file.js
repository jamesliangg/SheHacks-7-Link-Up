var eventArray = [];
var today = new Date();

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

function fileToArray(input) {
    var inputArray = input.split("\n");
    // console.log(inputArray);
    for (var i in inputArray) {
        if (inputArray[i].includes("DTEND;")) {
            // format YYYYMMDD
            var eventDate = String(/[2]\d\d\d\d\d\d\d/.exec(inputArray[i]));
            // format HHMMSS
            var endTime = String(/\d\d\d\d\d\d/.exec(/[T]\d\d\d\d\d\d/.exec(inputArray[i])));
            console.log(endTime);
        } 
        else if (inputArray[i].includes("DTSTART;")) {
            // format HHMMSS
            var beginTime = String(/\d\d\d\d\d\d/.exec(/[T]\d\d\d\d\d\d/.exec(inputArray[i])));
            eventArray.push([eventDate, beginTime, endTime]);
            eventArray.push([eventDate, '000000', '000000']);
            eventArray.push([eventDate, '235900', '235900']);
        } 
    }
    eventArray = multiDimensionalUnique(eventArray);
    eventArray = eventArray.sort();
    console.log(eventArray);
    removeOverlap(eventArray);
}

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
}

// function findAvailability(inputArray) {

// }

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
      eventBackgroundColor: '#ff8177',
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

// document.addEventListener('DOMContentLoaded', function() {
//     var calendarEl = document.getElementById('calendar');
//     var calendar = new FullCalendar.Calendar(calendarEl, {
//       initialView: 'dayGridMonth'
//     });
//     calendar.render();
//   });
// document.addEventListener('DOMContentLoaded', function() {
//     var calendarEl = document.getElementById('calendar');
  
//     calendar = new FullCalendar.Calendar(calendarEl, {
//     //   height: 'auto',
//       slotDuration: '00:30:00',
//       scrollTime: '08:00:00',
//     //   slotMinTime: '08:00:00',
//     //   slotMaxTime: '19:00:00',
//       handleWindowResize: true,
//       initialView: 'timeGridWeek',
//       initialDate: today,
//       nowIndicator: true,
//     //   allDaySlot: true,
//     //   expandRows: true,
//       eventBackgroundColor: '#7967B3',
//       dayHeaderFormat: {
//         weekday: 'short'
//       }
//     });
  
//     calendar.render();
//   });