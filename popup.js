const displayResultText = document.querySelector('.displayResultText');

let currentShiftTimeInfoInput = document.getElementById('currentShiftTimeInfo');
let totalTimeInput = document.getElementById('totalTime');
let payPeriodDaysInput = document.getElementById('payPeriodDay');
let form = document.querySelector('form');


function sendMessage(tabId, message) {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, message, response => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(response);
            }
        });
    });
}

async function main() {
    try {
        let queryOptions = { active: true, currentWindow: true };
        let [tab] = await chrome.tabs.query(queryOptions);
    
        let currentShiftTimeInfoResponse = await sendMessage(tab.id, {action: "getCurrentShiftTimeInfo"});
        let numberOfTimeDataRowsResponse = await sendMessage(tab.id, {action: "getNumberOfTimeDataRows"});
        let timeCardTotalResponse = await sendMessage(tab.id, {action: "getTimeCardTotal"});
        
        calculateRemainingTimeAsDecimal(currentShiftTimeInfoResponse.currentShiftTimeInfo, numberOfTimeDataRowsResponse.numberOfTimeDataRows, timeCardTotalResponse.timeCardTotal)
    } catch (error) {
        console.error(error);
    }
}

main();

function calculateRemainingTimeAsDecimal(currentShiftTimeInfo, numberOfTimeDataRows, timeCardTotal) {
    const idealPayPeriodTotal = (numberOfTimeDataRows) * 8
    const timeRemainingToday = parseFloat(idealPayPeriodTotal) - (parseFloat(timeCardTotal) + (parseFloat(currentShiftTimeInfo) - .5))
    if (timeCardTotal) {
        document.querySelector('.time-not-found-message').style.display = 'none';
    } else {
        document.querySelector('.time-not-found-message').style.display = 'block';
    }
    
    getTimeToClockOut(timeRemainingToday);
}

const getTimeToClockOut = (timeRemainingToday) => {
    let currentTime = new Date();
    let currentHours = currentTime.getHours();
    let currentMinutes = currentTime.getMinutes();
    let currentSeconds = currentTime.getSeconds();

    currentTime.setHours(currentHours, currentMinutes, currentSeconds)

    let millisecondsToAdd = timeRemainingToday * 60 * 60 * 1000;

    let newTime = new Date(currentTime.getTime() + millisecondsToAdd);
    let newHours = newTime.getHours();
    let newMinutes = newTime.getMinutes();
    let suffix = ' am';
    
    if(newHours > 12){
        newHours -= 12 
        suffix = ' pm'
    } 

    const formattedTime = `${newHours}:${newMinutes.toString().padStart(2, '0')}${suffix}`;
    
    console.log(`New time: ${formattedTime}`);
    displayResultText.innerHTML = formattedTime

}

form.addEventListener('submit', function(event) {
    event.preventDefault();

    calculateRemainingTimeAsDecimal(currentShiftTimeInfoInput.value, totalTimeInput.value, payPeriodDaysInput.value)
});


// Apply theme
document.getElementById('toggleStyles').addEventListener('change', function(e) {
    console.log(document.getElementById('toggleStyles'))
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (e.target.checked) {
            chrome.scripting.insertCSS({
                target: {tabId: tabs[0].id},
                files: ["webpageStyles.css"]
            });
        } else {
            chrome.scripting.removeCSS({
                target: {tabId: tabs[0].id},
                files: ["webpageStyles.css"]
            });
        }
    });
});


