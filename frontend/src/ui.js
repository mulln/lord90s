import { initTerminal, write, clear } from "./terminal.js";
import API from "./client.js";

let term;
let inputBuffer = "";

window.onload = () => {
  term = initTerminal();
  splashScreen();
  handleInput();
};

function handleInput() {
  term.onData((e) => {
    if (e === "\r") {
      processInput(inputBuffer.trim());
      inputBuffer = "";
      write("\r\n");
      return;
    }

    if (e === "\u007F") {
      // backspace
      if (inputBuffer.length > 0) {
        inputBuffer = inputBuffer.slice(0, -1);
        write("\b \b");
      }
      return;
    }

    inputBuffer += e;
    write(e);
  });
}

let currentScreen = "splash";

function processInput(text) {
  switch (currentScreen) {
    case "splash": return handleSplashInput(text);
    case "auth_choice": return handleAuthChoice(text);
    case "register_username": return handleRegisterUsername(text);
    case "register_password": return handleRegisterPassword(text);
    case "register_profession": return handleRegisterProfession(text);
    case "login_username": return handleLoginUsername(text);
    case "login_password": return handleLoginPassword(text);
    case "main_menu": return handleMainMenu(text);
    case "encounter_choice": return handleEncounterChoice(text);
    case "combat_exit": return mainMenu;
  }
}

