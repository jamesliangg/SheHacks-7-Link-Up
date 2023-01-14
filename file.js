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
    console.log(inputArray);
    for (var i in inputArray) {
        if (inputArray[i].includes("DTEND;")) {
            eventArray.push(inputArray[i]);
        } 
        else if (inputArray[i].includes("DTSTART;")) {
            eventArray.push(inputArray[i]);
        } 
    }
    console.log(eventArray);
    
}

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
  
    calendar = new FullCalendar.Calendar(calendarEl, {
    //   height: 'auto',
      slotDuration: '00:30:00',
      scrollTime: '08:00:00',
      // slotMinTime: '08:00:00',
      handleWindowResize: true,
      initialView: 'timeGridWeek',
      initialDate: today,
      nowIndicator: true,
      allDaySlot: true,
      expandRows: true,
      eventBackgroundColor: '#7967B3',
      dayHeaderFormat: {
        weekday: 'short'
      }
    });
  
    calendar.render();
  });