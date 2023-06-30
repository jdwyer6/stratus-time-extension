const displayResultText = document.querySelector('.displayResultText');


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
    
        // console.log("current", currentShiftTimeInfoResponse.currentShiftTimeInfo);
        // console.log("rows", numberOfTimeDataRowsResponse.numberOfTimeDataRows);
        calculateRemainingTimeAsDecimal(currentShiftTimeInfoResponse.currentShiftTimeInfo, numberOfTimeDataRowsResponse.numberOfTimeDataRows, timeCardTotalResponse.timeCardTotal)
    } catch (error) {
        console.error(error);
    }
}

main();

function calculateRemainingTimeAsDecimal(currentShiftTimeInfo, numberOfTimeDataRows, timeCardTotal) {
    const idealPayPeriodTotal = (numberOfTimeDataRows) * 8
    const timeRemainingToday = parseFloat(idealPayPeriodTotal) - (parseFloat(timeCardTotal) + (parseFloat(currentShiftTimeInfo) - .5))
    console.log(timeRemainingToday)
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

// Extension: C:\Users\jk_dw\Documents\CODE\stratus-time-extension.crx
// Key File: C:\Users\jk_dw\Documents\CODE\stratus-time-extension.pem


