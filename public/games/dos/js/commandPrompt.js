export function initCommandPrompt(win, showNotification) {
  const contentArea = win.querySelector('.window-content');
  contentArea.innerHTML = ""; // Clear any existing content
  contentArea.style.padding = "0";
  contentArea.style.backgroundColor = "black";
  contentArea.style.color = "white";
  contentArea.style.fontFamily = "Consolas, monospace";
  contentArea.style.cursor = 'text'; // Change cursor to indicate text input
  
  const terminal = document.createElement('pre');
  terminal.style.margin = "0";
  terminal.style.padding = "10px";
  terminal.style.whiteSpace = "pre-wrap";
  terminal.style.boxSizing = "border-box";
  terminal.style.outline = "none";
  
  const header = `Microsoft Windows XP [Version 5.1.2600]
(C) Copyright 1985-2001 Microsoft Corp.

`;
  
  let currentPath = "C:\\"; // Ensure it's not "C:\\" again
  let currentPrompt = `${currentPath}>`;
  let commandHistory = [];
  let historyIndex = -1;
  let currentInput = "";
  let displayBuffer = header;
  let cursorVisible = true;
  let waitingForPassword = false; // For password prompt state
  
  // Refocus terminal when clicking inside the window to ensure typing works
  contentArea.addEventListener('click', () => {
    terminal.focus();
  });

  function updateDisplay() {
    let displayText = displayBuffer + currentPrompt + currentInput;
    if (cursorVisible) {
      displayText += "_";
    }
    terminal.textContent = displayText;
    contentArea.scrollTop = contentArea.scrollHeight;
  }
  
  // Blink cursor
  setInterval(() => {
    cursorVisible = !cursorVisible;
    updateDisplay();
  }, 530);
  
  function getItemByPath(path) {
    // If no path is given, return root
    if (!path) return { item: window.fileSystem['C:'], path: "C:\\" };

    // Convert Windows path format to our internal format
    const cleanPath = path.replace(/^C:\\/, '').replace(/\\/g, '/');
    if (!cleanPath) return { item: window.fileSystem['C:'], path: "C:\\" };

    const parts = cleanPath.split('/').filter(Boolean);
    let current = window.fileSystem['C:'];
    let correctPath = "C:\\";

    for (let part of parts) {
      if (current && current.children) {
        // Find matching child name case-insensitively but preserve original case
        const matchingKey = Object.keys(current.children).find(
          key => key.toLowerCase() === part.toLowerCase()
        );
        if (matchingKey) {
          current = current.children[matchingKey];
          correctPath = correctPath === "C:\\" ? 
            `C:\\${matchingKey}` : 
            `${correctPath}\\${matchingKey}`;
        } else {
          return { item: null, path: null };
        }
      } else {
        return { item: null, path: null };
      }
    }
    return { item: current, path: correctPath };
  }
  
  function startDeletionSequence() {
    displayBuffer += 'Deleting system... This may take a moment.\n';
    updateDisplay();
    
    // Progress bar simulation
    let progress = 0;
    const progressBarInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressBarInterval);
        displayBuffer += `Deletion complete. System shutting down.\n\n`;
        updateDisplay();
        setTimeout(deleteSystem, 1000); // Trigger the BSOD
      }
      displayBuffer += `[${'#'.repeat(Math.floor(progress / 5)).padEnd(20, ' ')}] ${Math.floor(progress)}%\n`;
      updateDisplay();
    }, 300);
  }
  
  function deleteSystem() {
    // Stop any running intervals that might interfere
    // A bit hacky, but find and clear all known intervals
    if (window.__virusInterval) clearInterval(window.__virusInterval);
    if (window._idiotBouncingInterval) clearInterval(window._idiotBouncingInterval);
    // This is not exhaustive, but good enough for a crash simulation

    // Hide everything
    document.body.innerHTML = '';
    document.body.style.backgroundColor = 'black'; // Black screen before BSOD

    // Show Blue Screen of Death after a short delay
    setTimeout(() => {
        const bsodSound = new Audio("bsod.mp3");
        bsodSound.play().catch(e => console.error("Could not play BSOD sound:", e));
        
        const bsod = document.createElement('div');
        bsod.style.position = "fixed";
        bsod.style.top = "0";
        bsod.style.left = "0";
        bsod.style.width = "100%";
        bsod.style.height = "100%";
        bsod.style.backgroundColor = "#0000aa";
        bsod.style.color = "white";
        bsod.style.fontFamily = "Courier New, monospace";
        bsod.style.fontSize = "16px";
        bsod.style.padding = "50px";
        bsod.style.boxSizing = "border-box";
        bsod.style.zIndex = "10000";
        bsod.style.cursor = "default";
        
        bsod.innerHTML = `
          <pre>
A problem has been detected and Windows has been shut down to prevent damage
to your computer.

KERNEL_DATA_INPAGE_ERROR

If this is the first time you've seen this error screen,
restart your computer. If this screen appears again, follow
these steps:

Check to make sure any new hardware or software is properly installed.
If this is a new installation, ask your hardware or software manufacturer
for any Windows updates you might need.

If problems continue, disable or remove any newly installed hardware
or software. Disable BIOS memory options such as caching or shadowing.
If you need to use Safe Mode to remove or disable components, restart
your computer, press F8 to select Advanced Startup Options, and then
select Safe Mode.

Technical information:

*** STOP: 0x0000007A (0xC000009D, 0x89F1B4E0, 0xBF92A000, 0x00000000)


Beginning dump of physical memory
Physical memory dump complete.

Contact your system administrator or technical support group for further
assistance.
          </pre>
        `;
        document.body.appendChild(bsod);
    }, 1500);
  }

  function processCommand(cmd) {
    if (waitingForPassword) {
      if (cmd.trim() === 'SpongeBobMan20') {
        displayBuffer += '\nPermission granted.\n';
        startDeletionSequence();
      } else {
        displayBuffer += '\nIncorrect password.\n\n';
        currentPrompt = `${currentPath}>`;
        updateDisplay();
      }
      waitingForPassword = false;
      return;
    }

    const cmdLower = cmd.toLowerCase().trim();
    let output = "\n";
    
    // Split command and arguments
    const args = cmd.split(/\s+/);
    const mainCmd = args[0].toLowerCase();
    
    // Easter Egg: Delete system command
    if (cmd.trim() === 'sudo rm -rf /* --no-preserve-root') {
      displayBuffer += currentPrompt + cmd + '\n';
      startDeletionSequence();
      return; // Stop further processing
    }

    if (cmd.trim() === 'sudo rm -rf /*') {
      displayBuffer += currentPrompt + cmd;
      output += 'Password:';
      displayBuffer += output;
      currentPrompt = ``; // Hide prompt for password entry
      waitingForPassword = true;
      updateDisplay();
      return; // Stop further processing
    }

    if (mainCmd === "help") {
      output += `Available commands:
HELP     Shows this help message.
CLS      Clears the screen.
DIR      Lists files in current directory.
CD       Shows current directory.
CD ..    Goes up one directory.
CD dir   Changes to specified directory.
MKDIR    Creates a new directory.
RMDIR    Removes a directory.
DEL      Deletes a file or shortcut.
TYPE     Displays contents of a text file.
ECHO     Displays a message or turns echo on/off.
VER      Shows Windows version.
TIME     Shows current time.
DATE     Shows current date.
START    Starts a program or app.
EXIT     Closes the Command Prompt.\n`;
    } else if (mainCmd === "del") {
      if (args.length < 2) {
        output += "Error: Please specify a file name.\n";
      } else {
        const fileName = args[1];
        const result = getItemByPath(currentPath.replace(/^C:\\/, ''));
        const parentFolder = result.item;
        
        if (parentFolder && parentFolder.children) {
          // Find the file case-insensitively but preserve original case
          const actualFileName = Object.keys(parentFolder.children).find(
            key => key.toLowerCase() === fileName.toLowerCase()
          );
          
          if (!actualFileName) {
            output += `Could not find ${fileName}\n`;
          } else {
            const fileToDelete = parentFolder.children[actualFileName];
            
            if (fileToDelete.type !== "file" && fileToDelete.type !== "shortcut") {
              output += `${fileName} is not a file or shortcut.\n`;
            } else {
              delete parentFolder.children[actualFileName];
              output += `${fileName} was deleted.\n`;
            }
          }
        } else {
          output += "Access denied.\n";
        }
      }
    } else if (mainCmd === "echo") {
      if (args.length === 1) {
        output += "ECHO is on.\n";
      } else {
        // Join all arguments after "echo" with original spacing
        const message = cmd.substring(cmd.indexOf(' ') + 1);
        output += message + "\n";
      }
    } else if (mainCmd === "type") {
      if (args.length < 2) {
        output += "Error: Please specify a file name.\n";
      } else {
        const fileName = args[1];
        const result = getItemByPath(currentPath.replace(/^C:\\/, ''));
        const parentFolder = result.item;
        
        if (parentFolder && parentFolder.children) {
          // Find the file case-insensitively but preserve original case
          const actualFileName = Object.keys(parentFolder.children).find(
            key => key.toLowerCase() === fileName.toLowerCase()
          );
          
          if (!actualFileName) {
            output += `The system cannot find the file specified.\n`;
          } else {
            const fileToRead = parentFolder.children[actualFileName];
            
            if (fileToRead.type !== "file") {
              output += `Access denied.\n`;
            } else {
              output += fileToRead.content + "\n";
            }
          }
        } else {
          output += "Access denied.\n";
        }
      }
    } else if (mainCmd === "mkdir") {
      if (args.length < 2) {
        output += "Error: Please specify a directory name.\n";
      } else {
        const dirName = args[1];
        const result = getItemByPath(currentPath.replace(/^C:\\/, ''));
        const parentFolder = result.item;
        
        if (parentFolder && parentFolder.children) {
          // Check if directory already exists (case-insensitive)
          const exists = Object.keys(parentFolder.children).some(
            key => key.toLowerCase() === dirName.toLowerCase()
          );
          
          if (exists) {
            output += `A subdirectory or file ${dirName} already exists.\n`;
          } else {
            parentFolder.children[dirName] = {
              type: "folder",
              children: {}
            };
            output += `Directory created successfully.\n`;
          }
        } else {
          output += "Access denied.\n";
        }
      }
    } else if (mainCmd === "rmdir") {
      if (args.length < 2) {
        output += "Error: Please specify a directory name.\n";
      } else {
        const dirName = args[1];
        const result = getItemByPath(currentPath.replace(/^C:\\/, ''));
        const parentFolder = result.item;
        
        if (parentFolder && parentFolder.children) {
          // Find the directory case-insensitively but preserve original case
          const actualDirName = Object.keys(parentFolder.children).find(
            key => key.toLowerCase() === dirName.toLowerCase()
          );
          
          if (!actualDirName) {
            output += `The system cannot find the file specified.\n`;
          } else {
            const dirToRemove = parentFolder.children[actualDirName];
            
            if (dirToRemove.type !== "folder") {
              output += `${dirName} is not a directory.\n`;
            } else if (Object.keys(dirToRemove.children).length > 0) {
              output += `The directory is not empty.\n`;
            } else {
              delete parentFolder.children[actualDirName];
              output += `Directory removed successfully.\n`;
            }
          }
        } else {
          output += "Access denied.\n";
        }
      }
    } else if (mainCmd === "start") {
      if (args.length < 2) {
        output += "Error: Please specify a program to start.\n";
      } else {
        const programName = args.slice(1).join(" ").toUpperCase();
        let found = false;
        
        // First check Apps folder
        for (const [key, value] of Object.entries(window.fileSystem['C:'].children['Apps'].children)) {
          if (key.toUpperCase() === programName) {
            window.openItem(`C:/Apps/${key}/`);
            output += `Starting ${key}...\n`;
            found = true;
            break;
          }
        }
        
        // Then check Games folder if not found
        if (!found) {
          for (const [key, value] of Object.entries(window.fileSystem['C:'].children['Games'].children)) {
            if (key.toUpperCase() === programName) {
              window.openItem(`C:/Games/${key}/`);
              output += `Starting ${key}...\n`;
              found = true;
              break;
            }
          }
        }
        
        // Check Desktop folder if still not found
        if (!found) {
          for (const [key, value] of Object.entries(window.fileSystem['C:'].children['Desktop'].children)) {
            if (key.toUpperCase() === programName) {
              window.openItem(`C:/Desktop/${key}`);
              output += `Starting ${key}...\n`;
              found = true;
              break;
            }
          }
        }
        
        if (!found) {
          output += `'${args.slice(1).join(" ")}' is not recognized as an operable program or batch file.`;
        }
      }
    } else if (cmdLower === "cls") {
      displayBuffer = "";
      return updateDisplay();
    } else if (cmdLower === "dir") {
      const result = getItemByPath(currentPath.replace(/^C:\\/, ''));
      const currentItem = result.item;
      if (currentItem && currentItem.children) {
        output += ` Volume in drive C is Windows XP\n Volume Serial Number is 1234-5678\n\n Directory of ${currentPath}\n\n`;
        
        let totalFiles = 0;
        let totalSize = 0;
        
        for (const [name, item] of Object.entries(currentItem.children)) {
          if (item.type === "folder") {
            output += `${new Date().toLocaleString()}    <DIR>          ${name}\n`;
          } else {
            totalFiles++;
            let size;
            if (item.type === "file") {
              size = item.content ? item.content.length : 0;
            } else if (item.type === "shortcut") {
              // Shortcuts are typically small files, between 1-4KB
              size = Math.floor(Math.random() * 3000) + 1000;
            } else if (item.type === "app") {
              // Apps can be anywhere from 100KB to 10MB
              size = Math.floor(Math.random() * 9900000) + 100000;
            } else {
              size = 0;
            }
            totalSize += size;
            output += `${new Date().toLocaleString()}           ${size.toString().padStart(10)} ${name}\n`;
          }
        }
        
        output += `              ${totalFiles} File(s)    ${totalSize} bytes\n`;
        output += `               2 Dir(s)   4,294,967,296 bytes free\n`;
      }
    } else if (cmdLower === "cd") {
      output += `${currentPath}\n`;
    } else if (cmdLower.startsWith("cd ")) {
      const newPath = cmd.slice(3).trim();
      if (newPath.toLowerCase() === "..") {
        if (currentPath !== "C:\\" && currentPath !== "C:\\") {
          const parts = currentPath.split('\\').filter(Boolean);
          parts.pop(); // Remove the last part
          if (parts.length === 1) {
            currentPath = "C:\\"; // Ensure it's not "C:\\" again
          } else {
            const result = getItemByPath(parts.slice(1).join('\\'));
            currentPath = result.path;
          }
        }
      } else {
        let targetPath;
        if (newPath.startsWith("C:\\")) {
          targetPath = newPath;
        } else {
          targetPath = currentPath === "C:\\" ? 
            `C:\\${newPath}` : 
            `${currentPath}\\${newPath}`;
        }
        const result = getItemByPath(targetPath);
        if (result.item && result.item.type === "folder") {
          currentPath = result.path;
        } else {
          output += `The system cannot find the path specified.\n`;
        }
      }
    } else if (cmdLower === "ver") {
      output += `\nMicrosoft Windows XP [Version 5.1.2600]\n`;
    } else if (cmdLower === "time") {
      const now = new Date();
      output += `The current time is: ${now.toLocaleTimeString()}`;
    } else if (cmdLower === "date") {
      const now = new Date();
      output += `The current date is: ${now.toLocaleDateString()}`;
    } else if (cmdLower === "exit") {
      const closeBtn = win.querySelector('button[aria-label="Close"]');
      if (closeBtn) closeBtn.click();
      return;
    } else if (cmdLower !== "") {
      output += `'${cmd}' is not recognized as an internal or external command,
operable program or batch file.\n`;
    }
    
    // Add an extra newline to all output
    output += "\n";
    
    displayBuffer += currentPrompt + cmd + output;
    currentPrompt = `${currentPath}>`;
    updateDisplay();
  }

  terminal.tabIndex = 0;
  terminal.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const command = currentInput;
      if (command.trim() !== "") {
        commandHistory.push(command);
        historyIndex = commandHistory.length;
      }
      processCommand(command);
      currentInput = "";
      updateDisplay();
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      currentInput = currentInput.slice(0, -1);
      updateDisplay();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        currentInput = commandHistory[historyIndex];
        updateDisplay();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        currentInput = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        currentInput = "";
      }
      updateDisplay();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      currentInput += e.key;
      updateDisplay();
    }
  });
  
  contentArea.appendChild(terminal);
  updateDisplay();
  terminal.focus();
  
  // Set initial window size
  win.style.width = '640px';
  win.style.height = '400px';
}