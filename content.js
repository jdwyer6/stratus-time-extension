chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action == "getCurrentShiftTimeInfo") {
        let currentShiftTimeInfo = document.getElementById('lblCurrentShiftTimeInfo');
        console.log("content.js: ", currentShiftTimeInfo)
        sendResponse({currentShiftTimeInfo: currentShiftTimeInfo.innerText});
      }

      if (request.action == "getNumberOfTimeDataRows") {
        let numberOfTimeDataRows = document.querySelectorAll('.TimeCardGridDataRow');
        console.log("content.js: ", numberOfTimeDataRows)
        sendResponse({numberOfTimeDataRows: numberOfTimeDataRows.length});
      }      

      if (request.action == "getTimeCardTotal") {
        let totalsDivs = document.querySelectorAll('.emp-timecard-container-totals');
        console.log("content.js: ", totalsDivs)
        let timeCardTotal = parseFloat(totalsDivs[5].innerText)
        sendResponse({timeCardTotal: timeCardTotal});
      }    
    }
  );

//todo make variable for total weekly hours needed and replace 8 daily hours with total / payperiod (10)
//todo x to close
