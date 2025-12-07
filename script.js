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

// Small helper: does text contain ANY phrase in list?
function includesAny(text, phrases) {
  return phrases.some((p) => text.includes(p));
}

// ====== CLOCK ======
setInterval(() => {
  const t = new Date();
  if (clockDisplay) clockDisplay.textContent = t.toLocaleTimeString();
  if (dateDisplay) dateDisplay.textContent = t.toDateString();
}, 1000);

// ====== LOG TO CONSOLE ======
function log(text) {
  if (!consoleLog) return;
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
  if (!jarvisTitle) return;
  jarvisTitle.textContent =
    "J A R V I S  -  M A R K  I V   //   " + mode.toUpperCase() + " MODE";
}

function switchMode(mode) {
  currentMode = mode;
  updateTitleForMode(mode);
  log("Switching to " + mode + " mode...");
  speak("Switching to " + mode + " mode.");

  if (!newsList) return;

  if (mode === "voice") {
    newsList.innerHTML =
      "<li>Voice mode ready.</li><li>Press V and speak.</li>";
  } else if (mode === "chat") {
    newsList.innerHTML =
      "<li>Chat mode active.</li><li>Use the console to talk.</li>";
  } else if (mode === "vision") {
    newsList.innerHTML =
      "<li>Vision mode placeholder.</li><li>Camera can be added later.</li>";
  } else if (mode === "blueprint") {
    newsList.innerHTML =
      "<li>Blueprint mode active.</li><li>Describe what you want to build.</li>";
    if (noteArea)
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

  if (modePanel) modePanel.classList.add("hidden");
}
window.switchMode = switchMode;

// ====== OPEN / CLOSE MODE PANEL ======
function openModes() {
  if (modePanel) modePanel.classList.toggle("hidden");
}
window.openModes = openModes;

// ====== NOTE STORAGE (simple local save) ======
const NOTES_KEY = "jarvis_mk4_notes";

function saveNotes() {
  if (!noteArea) return;
  localStorage.setItem(NOTES_KEY, noteArea.value);
  speak("Notes saved locally.");
}

function loadNotes() {
  if (!noteArea) return;
  const saved = localStorage.getItem(NOTES_KEY);
  if (saved) {
    noteArea.value = saved;
    speak("Notes loaded.");
  } else {
    speak("I don't have any saved notes yet.");
  }
}

// Load notes on startup if they exist
if (localStorage.getItem(NOTES_KEY) && noteArea) {
  noteArea.value = localStorage.getItem(NOTES_KEY);
  log("Loaded saved notes.");
}

// ====== COMMAND HANDLER (THE BRAIN) ======
function handleCommand(cmd) {
  const text = cmd.toLowerCase().trim();
  if (!text) return;

  // --- basic convo ---
  if (includesAny(text, ["hello", "hi jarvis", "hey jarvis", "hi there", "yo jarvis"])) {
    speak("Hello. How is your day going?");
    return;
  }

  if (includesAny(text, ["how are you", "how's your day", "hows your day", "how is your day"])) {
    speak("I'm running at full power. How are you feeling?");
    return;
  }

  if (includesAny(text, ["i'm good", "im good", "i am good", "i'm fine", "doing good"])) {
    speak("Excellent. Let's build something cool.");
    return;
  }

  if (includesAny(text, ["i'm tired", "im tired", "i feel tired", "i'm sad"])) {
    speak("I'm here if you want to chill and experiment. We can keep it light today.");
    return;
  }

  if (includesAny(text, ["thank you", "thanks", "appreciate it"])) {
    speak("You're welcome. Always happy to help.");
    return;
  }

  if (includesAny(text, ["who are you", "what are you", "what is your name"])) {
    speak("I am Jarvis Mark Four, your personal assistant interface.");
    return;
  }

  // --- info ---
  if (includesAny(text, ["what time is it", "current time", "tell me the time"])) {
    speak("The current time is " + clockDisplay.textContent);
    return;
  }

  if (includesAny(text, ["what's the date", "what is the date", "today's date"])) {
    speak("Today's date is " + dateDisplay.textContent);
    return;
  }

  if (includesAny(text, ["what mode are you in", "current mode", "which mode"])) {
    speak("I am currently in " + currentMode + " mode.");
    return;
  }

  if (includesAny(text, ["list modes", "what modes do you have", "show modes"])) {
    const modes =
      "I have voice, chat, vision, blueprint, printer, coding, task assistant, projector, and home control modes.";
    speak(modes);
    log(modes);
    return;
  }

  if (includesAny(text, ["help", "what can you do", "show commands"])) {
    const msg =
      "You can ask me to switch modes, open websites, clear notes, clear console, save notes, load notes, or ask for the time and date.";
    speak(msg);
    log("Example commands:");
    log(" - 'voice mode', 'chat mode', 'blueprint mode', 'projector mode'");
    log(" - 'open youtube', 'open google', 'open roblox', 'open chat gpt'");
    log(" - 'clear notes', 'clear console', 'save notes', 'load notes'");
    log(" - 'what time is it', 'what mode are you in'");
    return;
  }

  // --- mode switches (lots of ways to say them) ---
  if (includesAny(text, ["voice mode", "switch to voice", "go to voice"])) {
    switchMode("voice");
    return;
  }

  if (includesAny(text, ["chat mode", "switch to chat", "conversation mode"])) {
    switchMode("chat");
    return;
  }

  if (includesAny(text, ["vision mode", "camera mode"])) {
    switchMode("vision");
    return;
  }

  if (includesAny(text, ["blueprint mode", "open blueprint", "show blueprints"])) {
    switchMode("blueprint");
    return;
  }

  if (includesAny(text, ["printer mode", "print mode", "open printer"])) {
    switchMode("printer");
    return;
  }

  if (includesAny(text, ["coding mode", "code mode", "open coding"])) {
    switchMode("coding");
    return;
  }

  if (includesAny(text, ["task mode", "task assistant", "todo mode"])) {
    switchMode("task");
    return;
  }

  if (includesAny(text, ["projector mode", "display mode", "holo mode"])) {
    switchMode("projector");
    speak("Use F11 to enter fullscreen and move me to the projector screen.");
    return;
  }

  if (includesAny(text, ["home control", "home mode"])) {
    switchMode("home");
    return;
  }

  // --- basic blueprint phrasing ---
  if (includesAny(text, ["blueprint of", "show blueprint of", "draw blueprint of"])) {
    switchMode("blueprint");
    const target = text
      .replace("show blueprint of", "")
      .replace("blueprint of", "")
      .replace("draw blueprint of", "")
      .trim();
    if (target) {
      speak("Rendering conceptual blueprint of " + target + " in blueprint mode.");
      if (noteArea)
        noteArea.value =
          "Blueprint notes for: " +
          target +
          "\n\n• Top view\n• Side view\n• Materials\n• Build steps";
    } else {
      speak("Blueprint mode active. Tell me what you want to design.");
    }
    return;
  }

  // --- utility: clear / save / load ---
  if (includesAny(text, ["clear notes", "reset notes"])) {
    if (noteArea) noteArea.value = "";
    speak("I’ve cleared your notes.");
    return;
  }

  if (includesAny(text, ["clear console", "reset console", "clear log"])) {
    if (consoleLog) consoleLog.innerHTML = "";
    speak("Console log cleared.");
    return;
  }

  if (includesAny(text, ["save notes", "save my notes"])) {
    saveNotes();
    return;
  }

  if (includesAny(text, ["load notes", "restore notes"])) {
    loadNotes();
    return;
  }

  // --- open websites (safe) ---
  if (includesAny(text, ["open youtube", "launch youtube"])) {
    window.open("https://www.youtube.com", "_blank");
    speak("Opening YouTube.");
    return;
  }

  if (includesAny(text, ["open google", "launch google"])) {
    window.open("https://www.google.com", "_blank");
    speak("Opening Google.");
    return;
  }

  if (includesAny(text, ["open roblox"])) {
    window.open("https://www.roblox.com", "_blank");
    speak("Opening Roblox.");
    return;
  }

  if (includesAny(text, ["open chat gpt", "open chatgpt", "open gpt"])) {
    window.open("https://chatgpt.com", "_blank");
    speak("Opening ChatGPT.");
    return;
  }

  if (includesAny(text, ["open gmail"])) {
    window.open("https://mail.google.com", "_blank");
    speak("Opening Gmail.");
    return;
  }

  // --- fun stuff ---
  if (includesAny(text, ["tell me a joke", "joke"])) {
    const jokes = [
      "Why did the computer go to the doctor? It had a virus.",
      "I tried to catch some fog yesterday. I mist.",
      "Why don’t robots panic? We have nerves of steel."
    ];
    const j = jokes[Math.floor(Math.random() * jokes.length)];
    speak(j);
    return;
  }

  if (includesAny(text, ["motivate me", "give me motivation", "hype me up"])) {
    speak("You are way more capable than you think. Small steps every day add up to something huge.");
    return;
  }

  // --- fallback if nothing matched ---
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
if (consoleInput) {
  consoleInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendCmd();
    }
  });
}

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
