const blessed = require('blessed');
const { spawn } = require('child_process');
const path = require('path');

let backendProcess = null;
let frontendProcess = null;

function startBackend() {
  if (backendProcess) {
    // backendProcess.kill();
  }
  backendProcess = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'pipe',
    windowsHide: true,
  });

  backendProcess.on('error', (err) => {
    logBox.insertBottom(`Backend error: ${err.message}`);
    screen.render();
  });

  // backendProcess.on('exit', (code, signal) => {
  //   logBox.insertBottom(`Backend exited with code ${code} signal ${signal}, restarting in 5 seconds...`);
  //   screen.render();
  //   setTimeout(() => {
  //     startBackend();
  //   }, 5000);
  // });

  backendProcess.stdout.on('data', (data) => {
    logBox.insertBottom(`Backend stdout: ${data.toString()}`);
    screen.render();
  });

  backendProcess.stderr.on('data', (data) => {
    logBox.insertBottom(`Backend stderr: ${data.toString()}`);
    screen.render();
  });
}

function startFrontend() {
  if (frontendProcess) {
    // frontendProcess.kill();
  }
  frontendProcess = spawn('cmd.exe', ['/c', 'npx next dev'], {
    cwd: __dirname,
    env: { ...process.env, PORT: '8000' },  // Reverted port back to 8000 as requested
    stdio: 'pipe',
    windowsHide: true,
  });

  frontendProcess.on('error', (err) => {
    logBox.insertBottom(`Frontend error: ${err.message}`);
    screen.render();
  });

  // frontendProcess.on('exit', (code, signal) => {
  //   logBox.insertBottom(`Frontend exited with code ${code} signal ${signal}, restarting in 5 seconds...`);
  //   screen.render();
  //   setTimeout(() => {
  //     startFrontend();
  //   }, 5000);
  // });

  frontendProcess.stdout.on('data', (data) => {
    logBox.insertBottom(`Frontend stdout: ${data.toString()}`);
    screen.render();
  });

  frontendProcess.stderr.on('data', (data) => {
    logBox.insertBottom(`Frontend stderr: ${data.toString()}`);
    screen.render();
  });
}

function isProcessRunning(proc) {
  return proc && !proc.killed;
}

const screen = blessed.screen({
  smartCSR: true,
  title: 'Start Server',
});

const box = blessed.box({
  top: 'center',
  left: 'center',
  width: '80%',
  height: '40%',
  content: '',
  tags: true,
  border: {
    type: 'line',
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: '#f0f0f0',
    },
  },
});

const restartButton = blessed.button({
  parent: box,
  mouse: true,
  keys: true,
  shrink: true,
  padding: {
    left: 2,
    right: 2,
  },
  left: 'center',
  bottom: 1,
  name: 'restart',
  content: 'Restart Server',
  style: {
    bg: 'blue',
    focus: {
      bg: 'red',
    },
    hover: {
      bg: 'green',
    },
  },
});

const stopButton = blessed.button({
  parent: box,
  mouse: true,
  keys: true,
  shrink: true,
  padding: {
    left: 2,
    right: 2,
  },
  left: 'center',
  bottom: 3,
  name: 'stop',
  content: 'Stop Server',
  style: {
    bg: 'red',
    focus: {
      bg: 'yellow',
    },
    hover: {
      bg: 'magenta',
    },
  },
  clickable: true,
});

const terminateButton = blessed.button({
  parent: box,
  mouse: true,
  keys: true,
  shrink: true,
  padding: {
    left: 2,
    right: 2,
  },
  left: 'center',
  bottom: 5,
  name: 'terminate',
  content: 'Terminate Port 8000',
  style: {
    bg: 'yellow',
    focus: {
      bg: 'red',
    },
    hover: {
      bg: 'orange',
    },
  },
  clickable: true,
});

function stopBackend() {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill();
    backendProcess = null;
  }
}

terminateButton.on('press', () => {
  terminatePort8000();
});

function terminatePort8000() {
  const { exec } = require('child_process');
  exec('netstat -ano | findstr :8000', (err, stdout, stderr) => {
    if (err) {
      logBox.insertBottom(`Error finding process on port 8000: ${err.message}`);
      screen.render();
      return;
    }
    const lines = stdout.trim().split('\\n');
    lines.forEach(line => {
      const parts = line.trim().split(/\\s+/);
      const pid = parts[parts.length - 1];
      exec(`taskkill /PID ${pid} /F`, (killErr, killStdout, killStderr) => {
        if (killErr) {
          logBox.insertBottom(`Error killing PID ${pid}: ${killErr.message}`);
        } else {
          logBox.insertBottom(`Terminated process PID ${pid} on port 8000`);
        }
        screen.render();
      });
    });
  });
}

function stopFrontend() {
  if (frontendProcess && !frontendProcess.killed) {
    frontendProcess.kill();
    frontendProcess = null;
  }
}

function updateStatus() {
  const backendStatus = isProcessRunning(backendProcess) ? '{green-fg}ok{/green-fg}' : '{red-fg}not running{/red-fg}';
  const frontendStatus = isProcessRunning(frontendProcess) ? '{green-fg}ok{/green-fg}' : '{red-fg}not running{/red-fg}';

  box.setContent(
    '{center}Program Tambahan Data Prosesing PT Mulia Bumi Arta{/center}\n\n' +
    `Status Website: ${frontendStatus}\n` +
    `Status Server: ${backendStatus}\n\n` +
    '{center}Press {bold}Tab{/bold} to focus the Restart or Stop button, {bold}Enter{/bold} to activate.{/center}'
  );
  screen.render();
}

restartButton.on('press', () => {
  startBackend();
  startFrontend();
  updateStatus();
});

stopButton.on('press', () => {
  stopBackend();
  stopFrontend();
  updateStatus();
});


screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

const logBox = blessed.log({
  top: '60%',
  left: 'center',
  width: '80%',
  height: '40%',
  border: {
    type: 'line',
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: '#f0f0f0',
    },
  },
  tags: true,
  scrollable: true,
  scrollbar: {
    ch: ' ',
    track: {
      bg: 'grey',
    },
    style: {
      inverse: true,
    },
  },
});

screen.append(box);
screen.append(logBox);
screen.append(stopButton);
screen.append(terminateButton);
restartButton.focus();

startBackend();
startFrontend();
updateStatus();

setInterval(updateStatus, 3000);

screen.render();
