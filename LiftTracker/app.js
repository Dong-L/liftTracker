// create constants for the form and the form controls
const newPeriodFormEl = document.getElementsByTagName("form")[0];
const startTimeInputEl = document.getElementById("start-time");
const endTimeInputEl = document.getElementById("end-time");

// Listen to form submissions.
newPeriodFormEl.addEventListener("submit", () => {
    // Prevent the form from submitting to the server
    // since everything is client-side
    preventDefault();

    // Get the start and end times from the form.
    const startTime = startTimeInputEl.value;
    const endTime = endTimeInputEl.value;

    // Check if the times are invalid
    if (checkDatesInvalid(startTime, endTime)) {
        // If the dates are invalid, exit.
        return;
    }

    // Store the new lift in our client-side storage.
    storeNewLift(startTime, endTime);

    // Refresh the UI.
    renderPastLifts();

    // Reset the form.
    newLiftFormEl.reset();
});