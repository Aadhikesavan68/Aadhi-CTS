// Phone Validation
function validatePhone() {
    let phone = document.getElementById("phone").value;

    if(phone.length < 10) {
        alert("Phone number should contain 10 digits");
    }
}

// Event Fee Display
function showFee() {
    let eventType = document.getElementById("eventType").value;
    let fee = "";

    if(eventType === "Music") {
        fee = "Music Event Fee: Rs.500";
    }
    else if(eventType === "Sports") {
        fee = "Sports Event Fee: Rs.300";
    }
    else if(eventType === "Technology") {
        fee = "Technology Event Fee: Rs.700";
    }

    document.getElementById("feeDisplay").innerHTML = fee;
}

// Confirmation
function showConfirmation() {
    document.getElementById("outputMessage").value =
        "Registration Submitted Successfully!";
}

// Enlarge Image
function enlargeImage(img) {
    img.style.width = "300px";
    img.style.height = "300px";
}

// Character Counter
function countCharacters() {
    let feedback = document.getElementById("feedback").value;
    document.getElementById("charCount").innerHTML = feedback.length;
}

// Video Ready
function videoReady() {
    document.getElementById("videoMessage").innerHTML =
        "Video ready to play";
}

// Save Preference
function savePreference() {
    let eventType = document.getElementById("eventType").value;
    localStorage.setItem("preferredEvent", eventType);
}

// Load Preference
window.onload = function() {
    let savedEvent = localStorage.getItem("preferredEvent");

    if(savedEvent) {
        document.getElementById("eventType").value = savedEvent;
        showFee();
    }
}

// Clear Storage
function clearPreferences() {
    localStorage.clear();
    sessionStorage.clear();

    alert("Preferences Cleared");
}

// Geolocation
function findLocation() {

    if(navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(
            function(position) {

                document.getElementById("location").innerHTML =
                    "Latitude: " + position.coords.latitude +
                    "<br>Longitude: " + position.coords.longitude;

            },

            function(error) {

                if(error.code === error.PERMISSION_DENIED) {
                    alert("Location permission denied");
                }
                else if(error.code === error.TIMEOUT) {
                    alert("Location request timeout");
                }
            },

            {
                enableHighAccuracy: true,
                timeout: 5000
            }
        );
    }
}

// Before Unload
function confirmLeave() {
    return "Your form may not be saved.";
}

// Console Log for DevTools
console.log("Community Event Portal Loaded");
