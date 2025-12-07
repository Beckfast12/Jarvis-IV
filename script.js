// Clock Update
setInterval(()=>{
    const t=new Date();
    clockDisplay.innerText=t.toLocaleTimeString();
    dateDisplay.innerText=t.toDateString();
},1000);

// Console Logging
function log(text){
    const e=document.createElement("div");
    e.innerText="> "+text;
    consoleLog.appendChild(e);
    consoleLog.scrollTop=consoleLog.scrollHeight;
}

function sendCmd(){
    let cmd=consoleInput.value.toLowerCase();
    consoleInput.value=""; 
    log(cmd);

    if(cmd.includes("blueprint")) switchMode("blueprint");
    if(cmd.includes("weather")) log("Weather mode soon — requires API key.");
    if(cmd.includes("print")) switchMode("printer");
}

// Mode switch UI
function openModes(){modePanel.classList.toggle("hidden");}
function switchMode(m){log("Switching to "+m+" mode...");}

// Calculator
function calcSolve(){
    try{calcInput.value=eval(calcInput.value);}
    catch{calcInput.value="Error";}
}
