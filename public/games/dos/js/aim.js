export async function initAIM(win, showNotification) { 
  // Sounds and timers for connection simulation
  const dialUpSound = new Audio("modem_dial_up.mp3");
  const openSound = new Audio("AIM-open.mp3");
  let connectionTimeout;
  let unsubscribeRoomState = () => {}; // Initialize to empty function for safe cleanup

  // Play modem sound immediately
  dialUpSound.play().catch(err => {
    console.warn('Could not play dial up sound:', err);
  });
  
  // Schedule AIM "welcome" sound for after "connection"
  connectionTimeout = setTimeout(() => {
    openSound.play().catch(err => {
      console.warn('Could not play AIM open sound:', err);
    });
  }, 10000); // Play after 10 seconds

  // --- Window Close Handling ---
  // We need to take over the close button's behavior to properly clean up sounds and subscriptions.
  const closeBtn = win.querySelector('button[aria-label="Close"]');
  if (closeBtn) {
    // Clone button to remove listeners from windowManager and prevent conflicts
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    
    newCloseBtn.addEventListener('click', () => {
      // Cleanup all resources associated with this window
      clearTimeout(connectionTimeout);
      dialUpSound.pause();
      dialUpSound.currentTime = 0;
      openSound.pause();
      openSound.currentTime = 0;
      unsubscribeRoomState();

      // Manually remove window and its taskbar button
      win.remove();
      const taskbarBtn = document.querySelector(`.taskbar-button[data-id="${win.dataset.id}"]`);
      if (taskbarBtn) taskbarBtn.remove();
    });
  }

  const container = win.querySelector('.window-content');
  container.innerHTML = "";

  // Create chat display area with pure white background and black border
  const chatArea = document.createElement('div');
  chatArea.style.height = "calc(100% - 112px)";
  chatArea.style.overflowY = "auto";
  chatArea.style.padding = "10px";
  chatArea.style.backgroundColor = "#ffffff";
  chatArea.style.fontFamily = "Times New Roman, serif";
  chatArea.style.fontSize = "16px";
  chatArea.style.borderLeft = "1px solid black";
  chatArea.style.borderTop = "1px solid black";
  container.appendChild(chatArea);

  // Create input container for message input and send button with new layout
  const inputContainer = document.createElement('div');
  inputContainer.style.display = "flex";
  inputContainer.style.flexDirection = "column";
  inputContainer.style.paddingTop = "5px";
  inputContainer.style.paddingBottom = "5px";
  inputContainer.style.height = "80px";
  container.appendChild(inputContainer);

  // Wrap the textarea in its own div for border control
  const textareaWrapper = document.createElement('div');
  textareaWrapper.style.borderLeft = "1px solid black";
  textareaWrapper.style.borderTop = "1px solid black";
  textareaWrapper.style.flexGrow = "1";

  const chatInput = document.createElement('textarea');
  chatInput.style.width = "100%";
  chatInput.style.height = "100%";
  chatInput.style.resize = "none";
  chatInput.style.fontFamily = "Times New Roman, serif";
  chatInput.style.fontSize = "16px";
  chatInput.style.border = "none";
  chatInput.style.padding = "5px";
  chatInput.style.boxSizing = "border-box";
  textareaWrapper.appendChild(chatInput);
  inputContainer.appendChild(textareaWrapper);

  const sendBtn = document.createElement('button');
  sendBtn.textContent = "Send";
  sendBtn.style.padding = "5px 10px";
  sendBtn.style.alignSelf = "flex-end";
  sendBtn.style.width = "100px";
  sendBtn.style.marginTop = "5px";
  inputContainer.appendChild(sendBtn);

  // --- Initialize WebsimSocket connection for chat ---
  const room = new WebsimSocket();
  await room.initialize(); // Wait for initialization

  let lastProcessedMessageKey = null; // Track the last message key processed
  let initialMessagesLoaded = false; // Flag to track initial message load

  // Function to display a single message
  function displayMessage(key, messageData, isInitialLoad = false) {
      const msgElem = document.createElement('div');
      msgElem.style.marginBottom = "5px";

      const username = document.createElement('span');
      // Use the username directly from messageData, fallback to fetching if needed (though unlikely with this structure)
      username.textContent = (messageData.username || 'Unknown') + ": ";
      username.style.color = (messageData.clientId === room.clientId) ? '#FF0000' : '#0000FF';
      username.style.fontWeight = 'bold';

      const message = document.createElement('span');
      message.textContent = messageData.message;

      msgElem.appendChild(username);
      msgElem.appendChild(message);
      chatArea.appendChild(msgElem);

      // Always scroll to the bottom when a new message is added.
      chatArea.scrollTop = chatArea.scrollHeight;

      // Play sound for incoming messages ONLY if they are new (not initial load)
      if (!isInitialLoad && messageData.clientId !== room.clientId) {
        const receiveSound = new Audio("AIM-message-receive.mp3");
        receiveSound.play().catch(err => {
          console.warn('Could not play receive sound:', err);
        });
      }
  }

  // Function to process and display messages from roomState
  function processMessages(messages, isInitialLoad = false) {
      if (!messages) return;

      // Get message keys and sort them chronologically (using timestamp prefix)
      const sortedKeys = Object.keys(messages).sort();

      // Find the index of the last processed message key
      const startIndex = lastProcessedMessageKey ? sortedKeys.indexOf(lastProcessedMessageKey) + 1 : 0;

      // Display new messages
      for (let i = startIndex; i < sortedKeys.length; i++) {
          const key = sortedKeys[i];
          displayMessage(key, messages[key], isInitialLoad);
      }

      // Update the last processed message key if new messages were processed
      if (sortedKeys.length > 0) {
          lastProcessedMessageKey = sortedKeys[sortedKeys.length - 1];
      }
  }

  // --- Handle initial state and updates ---
  // Process initial messages without playing sounds
  if (room.roomState && room.roomState.messages) {
      processMessages(room.roomState.messages, true); // Pass true for initial load
  }
  initialMessagesLoaded = true; // Set the flag after initial processing

  // Subscribe to room state updates and store the unsubscribe function for cleanup
  unsubscribeRoomState = room.subscribeRoomState((currentRoomState) => {
      if (currentRoomState && currentRoomState.messages) {
          processMessages(currentRoomState.messages, false); // Pass false for updates
      }
  });

  function sendMessage() {
    const originalText = chatInput.value.trim();
    if (originalText === "") return;

    // --- Profanity Filter ---
    const swearWords = ['fuck', 'shit', 'bitch', 'cunt', 'asshole', 'dick', 'pussy', 'nigger', 'nigga', 'faggot', 'retard'];
    // Use word boundaries to avoid censoring words like 'Scunthorpe'
    const regex = new RegExp(`\\b(${swearWords.join('|')})\\b`, 'gi'); 
    
    let censored = false;
    const censoredText = originalText.replace(regex, (match) => {
        censored = true;
        return '*'.repeat(match.length);
    });

    if (censored) {
        showNotification("Your message contains inappropriate language and has been censored.");
    }
    // --- End Profanity Filter ---

    // Play the send sound
    const sendSound = new Audio("AIM-message-send.mp3");
    sendSound.play().catch(err => {
      console.warn('Could not play send sound:', err);
    });

    // Create a unique key using timestamp and client ID
    const messageKey = `${Date.now()}_${room.clientId}`;
    const messageData = {
      clientId: room.clientId,
      username: room.peers[room.clientId]?.username || 'Anonymous',
      message: censoredText // Send the censored text
    };

    // Update room state with the new message
    room.updateRoomState({
      messages: {
        [messageKey]: messageData
      }
    });

    chatInput.value = "";
  }

  sendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if(e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  showNotification("AIM Chat connected. You can now chat with other users!");
}