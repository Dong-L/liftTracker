// create constants for the form and the form controls
const newLiftFormEl = document.getElementsByTagName("form")[0];
const startTimeInputEl = document.getElementById("start-time");
const endTimeInputEl = document.getElementById("end-time");
const pastLiftContainer = document.getElementById("past-lifts");
// Add the storage key as an app-wide constant
const STORAGE_KEY = "lift-tracker";

// Listen to form submissions.
newLiftFormEl.addEventListener("submit", (event) => {
    // Prevent the form from submitting to the server
    // since everything is client-side
    event.preventDefault();

    // Get the start and end times from the form.
    const startTime = startTimeInputEl.value;
    const endTime = endTimeInputEl.value;

    // Check if the times are invalid
    if (checkTimesInvalid(startTime, endTime)) {
        // If the times are invalid, exit.
        return;
    }

    // Store the new lift in our client-side storage.
    storeNewLift(startTime, endTime);

    // Refresh the UI.
    renderPastLifts();

    // Reset the form.
    newLiftFormEl.reset();
});

function checkTimesInvalid(startTime, endTime) {
    // Check that end time is after start time and neither are null
    if (!startTime || !endTime || startTime > endTime) {
        /*  To make the validation robust we could:
            1. add error messaging based on error type
            2. Alert assistive technology users about the error
            3. move focus to the error location
            instead, for now, we clear the times if either or both are invalid */
        newLiftFormEl.reset();
        // as times are invalid, we return true
        return true;
    }
    return false;
}

function storeNewLift(startTime, endTime) {
    // Get data from storage
    const lifts = getAllStoredLifts();

    // Add the new lift object to the end of the array of lift objects
    lifts.push({ startTime, endTime });

    // Sort the array so that lifts are ordered by start time, from newest to oldest
    lifts.sort((a, b) => {
        return new Date(b.startTime) - new Date(a.startTime);
    });

    // Store the updated array back in storage
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lifts));
}

function getAllStoredLifts() {
    // Get the string lifts from localStorage
    const data = window.localStorage.getItem(STORAGE_KEY);

    // If no lifts were stored, default to an empty array
    // otherwise, return the stored data as parse JSON
    const lifts = data ? JSON.parse(data) : [];
    console.dir(lifts);
    console.log(lifts);
    return lifts;
}

function renderPastLifts() {
    const pastLiftHeader = document.createElement("h2");
    const pastLiftList = document.createElement("ul");
    // get the parse string of lifts, or an empty array.
    const lifts = getAllStoredLifts();

    // exit if there are no lifts
    if (lifts.length === 0) {
        return;
    }

    // Clear the list of past lifts, since we're going to re-render it.
    pastLiftContainer.innerHTML = "";

    pastLiftHeader.textContent = "Past lifts";

    // Loop over all lifts and render them.
    lifts.forEach((lift) => {
        const liftEl = document.createElement("li");
        liftEl.textContent = `From ${formatTime(
            lift.startTime,
        )} to ${formatTime(lift.endTime)}`;
        pastLiftList.appendChild(liftEl);
    });

    pastLiftContainer.appendChild(pastLiftHeader);
    pastLiftContainer.appendChild(pastLiftList);
}

function formatTime(timeString) {
    // Convert the time string into hours and minutes
    const [hours, minutes] = timeString.split(":");

    // Create a new Date object with a fixed date and the provided time
    const time = new Date(1970, 0, 1, hours, minutes);

    if (isNaN(time)) {
        return "Invalid Date";
    }

    // Format the time into a locale-specific string.
    // include your locale for better user experience
    return time.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true });
}

renderPastLifts();