let mindfulnessTime = 6, // Default mindfulness time in seconds
    focusTime = 1500,    // Focus time in seconds
    shortBreakTime = 300, // Short break time in seconds
    longBreakTime = 900,  // Long break time in seconds
    remainingTime = null, // Tracks remaining time
    timer = null,         // Timer interval
    isPaused = false;     // Pause state

// DOM element references
const settingsIcon = document.getElementById("settings-icon"),
    settingsPanel = document.getElementById("settings-panel"),
    startButton = document.getElementById("start-button"),
    pauseButton = document.getElementById("pause-button"),
    progressBar = document.getElementById("progress-bar"),
    progressContainer = document.getElementById("progress-container"),
    mindfulnessInstructions = document.getElementById("mindfulness-instructions"),
    timeDisplay = document.getElementById("time-display"),
    mindfulnessTimeInput = document.getElementById("mindfulness-time"),
    focusTimeInput = document.getElementById("focus-time"),
    shortBreakTimeInput = document.getElementById("short-break-time"),
    longBreakTimeInput = document.getElementById("long-break-time");

let mindfulnessStatements = []; // Array to store loaded statements

// Function to load mindfulness statements from a JSON file
function loadMindfulnessStatements() {
    // fetch("./mindfulness-statements.json")
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error("Network response was not ok: " + response.statusText);
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         mindfulnessStatements = data.statements || []; // Store the statements
    //         console.log("Mindfulness statements loaded:", mindfulnessStatements);
    //     })
    //     .catch(error => {
    //         console.error("Error loading mindfulness statements:", error);
    //     });
    fetch("./mindfulness-statements.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        mindfulnessStatements = data.statements;
        console.log("Mindfulness statements loaded:", mindfulnessStatements);
    })
    .catch(error => {
        console.error("Error fetching mindfulness statements:", error);
    });

}

// Function to get a random mindfulness statement
function getRandomMindfulnessStatement() {
    if (mindfulnessStatements.length === 0) {
        console.log("Mindfulness statements not loaded yet.");
        return "Stay present. Breathe deeply."; // Default message
    }
    const randomIndex = Math.floor(Math.random() * mindfulnessStatements.length);
    return mindfulnessStatements[randomIndex];
}

// Function to start the timer
function startTimer(duration, callback = null) {
    let time = remainingTime !== null ? remainingTime : duration; // Use remaining time if available
    remainingTime = time;
    isPaused = false;

    clearInterval(timer); // Clear any existing timer
    progressContainer.classList.add("active");

    // Show mindfulness instructions
    mindfulnessInstructions.classList.remove("hidden");
    mindfulnessInstructions.classList.add("visible");
    mindfulnessInstructions.innerHTML = `<p>${getRandomMindfulnessStatement()}</p>`;

    // Start the countdown
    timer = setInterval(() => {
        if (!isPaused) {
            let minutes = Math.floor(time / 60),
                seconds = time % 60;

            timeDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
            updateProgressBar(duration, time);

            if (--time < 0) {
                clearInterval(timer); // Stop the timer
                progressContainer.classList.remove("active");
                timeDisplay.textContent = "Time's Up!";
                mindfulnessInstructions.classList.remove("visible");
                mindfulnessInstructions.classList.add("hidden");
                if (callback) callback(); // Execute callback if provided
            }
            remainingTime = time;
        }
    }, 1000);
}

// Function to pause the timer
function pauseTimer() {
    if (timer) {
        isPaused = !isPaused;
        if (isPaused) {
            clearInterval(timer);
            pauseButton.querySelector("i").textContent = "play_circle_filled"; // Change icon to play
        } else {
            pauseButton.querySelector("i").textContent = "pause"; // Change icon to pause
            startTimer(remainingTime); // Resume timer
        }
    }
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timer);
    isPaused = false;
    remainingTime = null;

    progressContainer.classList.remove("active");
    progressBar.style.width = "0%";

    // Reset display to default mindfulness time
    timeDisplay.textContent = `${Math.floor(mindfulnessTime / 60)}:00`;

    startButton.querySelector("i").textContent = "play_arrow";
    startButton.disabled = false;
    pauseButton.disabled = true;

    mindfulnessInstructions.classList.remove("visible");
    mindfulnessInstructions.classList.add("hidden");
}

// Function to update the progress bar
function updateProgressBar(totalTime, currentTime) {
    progressBar.style.width = `${((totalTime - currentTime) / totalTime) * 100}%`;
}

// Event listeners for settings and buttons
settingsIcon.addEventListener("click", () => {
    settingsPanel.classList.toggle("visible");
});

startButton.addEventListener("click", () => {
    const icon = startButton.querySelector("i");
    if (icon.textContent === "play_arrow") {
        startTimer(mindfulnessTime);
        icon.textContent = "stop";
        pauseButton.disabled = false;
    } else {
        icon.textContent = "play_arrow";
        stopTimer();
    }
});

pauseButton.addEventListener("click", () => {
    pauseTimer();
    pauseButton.disabled = false;
});

// Save settings
document.getElementById("save-settings").addEventListener("click", () => {
    mindfulnessTime = 60 * mindfulnessTimeInput.value;
    focusTime = 60 * focusTimeInput.value;
    shortBreakTime = 60 * shortBreakTimeInput.value;
    longBreakTime = 60 * longBreakTimeInput.value;
    alert("Settings saved!");
    stopTimer();
});

// Reset settings
document.getElementById("reset-settings").addEventListener("click", () => {
    mindfulnessTimeInput.value = 3; // Default mindfulness time (minutes)
    focusTimeInput.value = 25;
    shortBreakTimeInput.value = 5;
    longBreakTimeInput.value = 15;

    mindfulnessTime = 6;
    focusTime = 1500;
    shortBreakTime = 300;
    longBreakTime = 900;

    alert("Settings have been reset to default values!");
});

// Load mindfulness statements on page load
loadMindfulnessStatements();
