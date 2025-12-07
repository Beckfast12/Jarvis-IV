// ====== GET ELEMENTS ======
const clockDisplay = document.getElementById("clockDisplay");
const dateDisplay = document.getElementById("dateDisplay");
const consoleLog = document.getElementById("consoleLog");
const consoleInput = document.getElementById("consoleInput");
const modePanel = document.getElementById("modePanel");
const calcInput = document.getElementById("calcInput");
const noteArea = document.getElementById("noteArea");
const newsList = document.getElementById("newsList");
const jarvisTitle = document.querySelector(".jarvis-title");

let currentMode = "idle";

// ====== CLOCK ======
setInterval(() => {
  const t = new Date();
  clockDisplay.textContent = t.toLocaleTimeString();
  dateDisplay.textContent = t.toDateString();
}, 1000);

// ====== LOG TO CONSOLE ======
function log(text) {
  const e = document.createElement("div");
  e.innerText = "> " + text;
  consoleLog.appendChild(e);
  consoleLog.scrollTop = consoleLog.scrollHeight;
}

// ====== TEXT TO SPEECH ======
function speak(text) {
  if (!("speechSynthesis" in window)) {
    log("Jarvis (no voice): " + text);
    return;
  }
  const msg = new SpeechSynthesisUtterance(text);
  msg.pitch = 1;
  msg.rate = 1;
  msg.volume = 1;
  speechSynthesis.speak(msg);
  log("Jarvis: " + text);
}

// ====== MODES ======
function updateTitleForMode(mode) {
  jarvisTitle.textContent =
    "J A R V I S  -  M A R K  I V   //   " + mode.toUpperCase() + " MODE";
}

function switchMode(mode) {
  currentMode = mode;
  updateTitleForMode(mode);
  log("Switching to " + mode + " mode...");
  speak("Switching to " + mode + " mode.");

  // Update the News / Notepad depending on mode
  if (mode === "voice") {
    newsList.innerHTML = "<li>Voice mode ready.</li><li>Press V and speak.</li>";
  } else if (mode === "chat") {
    newsList.innerHTML = "<li>Chat mode active.</li><li>Use the console to talk.</li>";
  } else if (mode === "vision") {
    newsList.innerHTML = "<li>Vision mode placeholder.</li><li>Camera can be added later.</li>";
  } else if (mode === "blueprint") {
    newsList.innerHTML = "<li>Blueprint mode active.</li><li>Describe what you want to build.</li>";
    noteArea.value = "Example: Arc Reactor layout, Mark IV armor sections...";
  } else if (mode === "printer") {
    newsList.innerHTML =
      "<li>Printer mode (demo).</li><li>Estimated print time: 30 minutes.</li>";
  } else if (mode === "coding") {
    newsList.innerHTML =
      "<li>Coding mode.</li><li>Use notepad for code notes or snippets.</li>";
  } else if (mode === "task") {
    newsList.innerHTML =
      "<li>Task Assistant mode.</li><li>Use notepad as your TODO list.</li>";
  } else if (mode === "projector") {
    newsList.innerHTML =
      "<li>Projector mode.</li><li>Press F11 and move this window to your projector display.</li>";
  } else if (mode === "home") {
    newsList.innerHTML =
      "<li>Home Control placeholder.</li><li>Future: smart lights, plugs, etc.</li>";
  }

  modePanel.classList.add("hidden");
}

// make available for HTML onclick
window.switchMode = switchMode;

// ====== OPEN / CLOSE MODE PANEL ======
function openModes() {
  modePanel.classList.toggle("hidden");
}
window.openModes = openModes;

// ====== COMMAND HANDLER ======
function handleCommand(cmd) {
  const text = cmd.toLowerCase();

  if (text.includes("hello") || text.includes("hi")) {
    speak("Hello. How can I assist?");
    return;
  }

  if (text.includes("time")) {
    speak("The current time is " + clockDisplay.textContent);
    return;
  }

  if (text.includes("blueprint")) {
    switchMode("blueprint");
    return;
  }

  if (text.includes("print")) {
    switchMode("printer");
    return;
  }

  if (text.includes("projector")) {
    switchMode("projector");
    speak("Use F11 to enter fullscreen on your projector.");
    return;
  }

  if (text.includes("voice mode")) {
    switchMode("voice");
    return;
  }

  if (text.includes("chat mode")) {
    switchMode("chat");
    return;
  }

  // fallback
  speak("Command received, but I don't have that function yet.");
}

// ====== SEND BUTTON ======
function sendCmd() {
  const cmd = consoleInput.value.trim();
  if (!cmd) return;
  log(cmd);
  consoleInput.value = "";
  handleCommand(cmd);
}
window.sendCmd = sendCmd;

// ENTER key sends command
consoleInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendCmd();
  }
});

// ====== CALCULATOR ======
function calcSolve() {
  try {
    calcInput.value = eval(calcInput.value || "0");
  } catch (e) {
    calcInput.value = "Error";
  }
}
window.calcSolve = calcSolve;

// ====== VOICE RECOGNITION (press V) ======
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (window.SpeechRecognition) {
  const recognizer = new SpeechRecognition();
  recognizer.lang = "en-US";
  recognizer.continuous = false;
  recognizer.interimResults = false;

  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "v") {
      recognizer.start();
      log("Listening... (press V and speak)");
    }
  });

  recognizer.onresult = (event) => {
    const voiceCMD = event.results[0][0].transcript;
    log("Voice: " + voiceCMD);
    handleCommand(voiceCMD);
  };

  recognizer.onerror = (e) => {
    log("Voice error: " + e.error);
  };
} else {
  log("Voice recognition not supported in this browser.");
}

// ====== STARTUP ======
log("Jarvis Mark IV online.");
speak("Jarvis Mark Four online.");
