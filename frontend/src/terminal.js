let term;

export function initTerminal() {
  term = new Terminal({
    cursorBlink: true,
    allowTransparency: true,
    theme: {
      background: "#000000",
      foreground: "#31d7ff",
      cursor: "#31d7ff"
    }
  });

  term.open(document.getElementById("terminal"));
  resizeTerminal();

  window.addEventListener("resize", resizeTerminal);

  return term;
}

function resizeTerminal() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  document.getElementById("terminal").style.width = `${w}px`;
  document.getElementById("terminal").style.height = `${h}px`;
}

export function write(text) {
  term.write(text.replace(/\n/g, "\r\n"));
}

export function clear() {
  term.clear();
}

