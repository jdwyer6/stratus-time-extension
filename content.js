
// let totalTime;
// let payPeriodDay;
// const displayResultText = document.querySelector('.displayResultText');
// let currentShiftTimeInfo;
// let currentTime = document.querySelector("#currentTime")




chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action == "getCurrentShiftTimeInfo") {
        let currentShiftTimeInfo = document.getElementById('lblCurrentShiftTimeInfo');
        sendResponse({currentShiftTimeInfo: currentShiftTimeInfo.innerText});
      }

      if (request.action == "getNumberOfTimeDataRows") {
        let numberOfTimeDataRows = document.querySelectorAll('.TimeCardGridDataRow');
        sendResponse({numberOfTimeDataRows: numberOfTimeDataRows.length});
      }      

      if (request.action == "getTimeCardTotal") {
        let timeCardTotal = document.querySelector('.emp-timecard-container-totals');
        sendResponse({timeCardTotal: timeCardTotal.innerText});
      }     
    }
  );




//     let currentTimeInput = document.getElementById('currentTime');
//     let totalTimeInput = document.getElementById('totalTime');
//     let payPeriodDayInput = document.getElementById('payPeriodDay');
//     let form = document.querySelector('form');

//     currentTimeInput.addEventListener('change', function() {
//         currentTime = parseFloat(this.value);
//         localStorage.setItem('currentTime', this.value);
//     });

//     totalTimeInput.addEventListener('change', function() {
//         totalTime = parseFloat(this.value);
//         localStorage.setItem('totalTime', this.value);
//     });

//     payPeriodDayInput.addEventListener('change', function() {
//         payPeriodDay = parseFloat(this.value);
//         localStorage.setItem('payPeriodDay', this.value);
//         console.log(currentTime, totalTime, payPeriodDay)
//     });

//     form.addEventListener('submit', function(event) {
//         event.preventDefault();
//         calculateRemainingTime();
//     });


// function calculateRemainingTime() {
//     let currentDate = new Date();
//     let hours = currentDate.getHours();
//     let minutes = currentDate.getMinutes();

//     console.log("hours: ", hours, " minutes: ", minutes)
//     let remainingTime = (payPeriodDay * 8) - (totalTime + currentTime);
//     displayResultText.innerHTML = remainingTime;
// }


//todo make variable for total weekly hours needed and replace 8 daily hours with total / payperiod (10)
//autofill button