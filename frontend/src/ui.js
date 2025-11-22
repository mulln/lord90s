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
function splashScreen() {
  clear();
  write(`\x1b[36m
██╗      ██████╗ ██████╗ ██████╗  ██████╗ ██╗  ██╗███████╗
██║     ██╔═══██╗██╔══██╗██╔══██╗██╔═══██╗██║ ██╔╝██╔════╝
██║     ██║   ██║██████╔╝██████╔╝██║   ██║█████╔╝ █████╗  
██║     ██║   ██║██╔═══╝ ██╔══██╗██║   ██║██╔═██╗ ██╔══╝  
███████╗╚██████╔╝██║     ██║  ██║╚██████╔╝██║  ██╗███████╗
╚══════╝ ╚═════╝ ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
\x1b[0m`);

  write("\n\nWelcome to the 90s.\n");
  write("A retro BBS-style RPG — neon, danger, nightlife, romance.\n\n");
  write("Press ENTER to begin...");
}

function handleSplashInput() {
  authChoice();
}
function authChoice() {
  clear();
  currentScreen = "auth_choice";

  write("1) Login\n");
  write("2) Register\n\n");
  write("Choose an option: ");
}

function handleAuthChoice(text) {
  if (text === "1") return loginUsername();
  if (text === "2") return registerUsername();
  write("Invalid option. Try again: ");
}

// REGISTRATION FLOW
let regUser = "";
let regPass = "";
let regProfession = "";

function registerUsername() {
  currentScreen = "register_username";
  clear();
  write("Choose a username: ");
}

function handleRegisterUsername(text) {
  regUser = text;
  registerPassword();
}

function registerPassword() {
  currentScreen = "register_password";
  clear();
  write("Choose a password: ");
}

function handleRegisterPassword(text) {
  regPass = text;
  chooseProfession();
}

const PROF_LIST = ["Hacker", "PI", "Musician", "Hustler", "Cop"];

function chooseProfession() {
  currentScreen = "register_profession";
  clear();
  write("Choose a profession:\n");
  PROF_LIST.forEach((p, i) => write(`${i+1}) ${p}\n`));
  write("\nEnter number: ");
}

function handleRegisterProfession(text) {
  const idx = Number(text) - 1;
  if (idx < 0 || idx >= PROF_LIST.length) {
    write("Invalid. Try again: ");
    return;
  }
  regProfession = PROF_LIST[idx];

  API.register({
    username: regUser,
    password: regPass,
    profession: regProfession
  }).then(res => {
    if (res.error) {
      write(`\n${res.error}\n`);
      return authChoice();
    }
    API.setToken(res.token);
    mainMenu();
  });
}

// LOGIN
let loginUser = "";
let loginPass = "";

function loginUsername() {
  currentScreen = "login_username";
  clear();
  write("Username: ");
}

function handleLoginUsername(text) {
  loginUser = text;
  loginPassword();
}

function loginPassword() {
  currentScreen = "login_password";
  clear();
  write("Password: ");
}

function handleLoginPassword(text) {
  loginPass = text;

  API.login({ username: loginUser, password: loginPass })
    .then(res => {
      if (res.error) {
        write(`\n${res.error}\n`);
        return authChoice();
      }
      API.setToken(res.token);
      mainMenu();
    });
}
function mainMenu() {
  currentScreen = "main_menu";
  clear();

  API.me().then(({ player }) => {
    write(`\nWelcome, ${player.username} (${player.profession})\n`);
    write(`HP: ${player.hp}/${player.max_hp} | AP: ${player.ap} | $${player.cash}\n`);
    write(`Charm:${player.charm}  Grit:${player.grit}  Skill:${player.skill}  Nerve:${player.nerve}\n\n`);

    write("=== Main Menu ===\n");
    write("1) Explore\n");
    write("2) NPC Encounter\n");
    write("3) Fight NPC\n");
    write("4) Logout\n\n");
    write("Choose: ");
  });
}

function handleMainMenu(text) {
  switch (text) {
    case "1": return exploreAction();
    case "2": return npcEncounter();
    case "3": return fightNPC();
    case "4": return logout();
    default: write("Invalid. Choose again: ");
  }
}

function logout() {
  API.setToken(null);
  splashScreen();
}
function exploreAction() {
  clear();
  API.explore().then(res => {
    write(`${res.msg}\n\n`);
    write("Press ENTER to return.");
    currentScreen = "combat_exit";
  });
}
function fightNPC() {
  clear();
  API.fightNPC().then(res => {
    res.log.forEach(line => write(line + "\n"));
    write(`\nHP Remaining: ${res.playerHp}\n`);
    write("\nPress ENTER to return.");
    currentScreen = "combat_exit";
  });
}
let currentChoices = [];

function npcEncounter() {
  clear();
  API.getEncounter().then(res => {
    const enc = res.encounter;
    currentChoices = enc.choices;

    write(`\n${enc.npc} approaches...\n\n`);
    write(enc.text + "\n\n");

    enc.choices.forEach((c, i) => {
      write(`${i+1}) ${c.label}\n`);
    });

    write("\nChoose: ");
    currentScreen = "encounter_choice";
  });
}

function handleEncounterChoice(text) {
  const idx = Number(text) - 1;
  if (idx < 0 || idx >= currentChoices.length) {
    write("Invalid choice. Try again: ");
    return;
  }

  const { tag } = currentChoices[idx];

  API.chooseEncounter(tag).then(res => {
    clear();
    write(res.msg + "\n");

    if (res.affinityDelta > 0)
      write("\nThey seem more into you now…\n");
    if (res.affinityDelta < 0)
      write("\nYou may have blown the moment.\n");

    write("\nPress ENTER to return.");
    currentScreen = "combat_exit";
  });
}


