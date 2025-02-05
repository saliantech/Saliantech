const apiBaseUrl = "https://script.google.com/macros/s/AKfycbxkyhvNQ4FGVFHybDViMQbNCMM3eqA4wbcQaOGTYp7AnI-uzcl_MrHLDNgNKoj_fKw_/exec";
let fetchMessagesInterval; // Variable to hold the setInterval ID
let previousMessageCount = 0; // To track the message count

document.addEventListener("DOMContentLoaded", () => {
  const senderEmail = localStorage.getItem("email");
  const recipientEmail = localStorage.getItem("recipientEmail");

  if (!senderEmail || !recipientEmail) {
    const chatBox = document.getElementById("chat-box");
      chatBox.innerHTML = `<div class="incoming"><div class="user-avatar">
            <p>L</p>
            <div class="tooltip"><p>Loginer</p></div>
          </div>
          <div class="message">
            <p style="font-size: 20px; color:red;"><strong>NOTE:</strong> To Chat with admin Please click below to login</p>
      </div></div>
      <div class="incoming"><div style="visibility: hidden;" class="user-avatar"></div>
          <div onclick="lgnshw()" style="background-color:#007bff;" class="message">
            <p><strong><a style="font-size: 20px; text-decoration: none; color:#fff;">Login</a></strong></p>
      </div></div>
      `;
      return;
  }

  document.getElementById("sender-email").value = senderEmail;
  document.getElementById("recipient-email").value = recipientEmail;

  // Display recipient details
  document.getElementById("recipient-name").textContent = recipientEmail; // Initially set to email
  document.getElementById("recipient-status").textContent = "Online";

  let users = [];
  fetch(`${apiBaseUrl}?action=getUsers`)
    .then(response => response.json())
    .then(data => {
      users = data;
      const recipient = users.find(user => user.email === recipientEmail);
      if (recipient) {
        document.getElementById("recipient-name").textContent = recipient.username; // Display username
      }
    });

function decodeHTML(encodedStr) {
  const doc = new DOMParser().parseFromString(encodedStr, "text/html");
  return doc.documentElement.textContent || doc.documentElement.innerText;
}
    // Function to convert URLs into clickable links
function convertUrlsToLinks(text) {
  // Regex to match URLs (http, https, etc.)
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
}
  // Function to fetch and display chat messages
  function fetchMessages(initialLoad = false) {
    fetch(`${apiBaseUrl}?action=getMessages&sender=${senderEmail}&receiver=${recipientEmail}`)
      .then(response => response.json())
      .then(messages => {
        const chatBox = document.getElementById("chat-box");

        // If initial load or message count changes, update the chat box
        if (initialLoad || messages.length !== previousMessageCount) {
          chatBox.innerHTML = ""; // Clear chat box to avoid duplicates
          messages.forEach(msg => {
            const messageItem = document.createElement("div");
            messageItem.className = msg.sender === senderEmail ? "outgoing" : "incoming";

            const recipient = users.find(user => user.email === msg.sender);
            const senderName = msg.sender === senderEmail ? "You" : (recipient ? recipient.username : msg.sender);
            const avatarInitial = senderName.charAt(0).toUpperCase();
 
              const messageTime = new Date(msg.timestamp); // Convert timestamp to Date object
                const formattedTime = formatDate(messageTime); // Format the date using formatDate()
        // Decode the HTML content of the message (if any)
        let decodedMessage = decodeHTML(msg.message);

        // Convert URLs to clickable links
        decodedMessage = convertUrlsToLinks(decodedMessage);

              messageItem.innerHTML = `
              <div class="user-avatar">
            ${avatarInitial}
            <div class="tooltip">${senderName}</div>
          </div>
              <div class="message">
              <div class="action">•••
          <ul class="dropdown">
          <li class="copy-btn">Copy</li>
          <li class="delete-btn">Delete</li>
          </div>
                <p>${decodedMessage}</p>
              <span class="message-time">${formattedTime}</span> <!-- Display time -->
          </div>
            `;
 
            chatBox.appendChild(messageItem);
              
              const copyButton = messageItem.querySelector('.copy-btn');
        copyButton.addEventListener('click', () => {
          navigator.clipboard.writeText(msg.message).then(() => {
          }).catch(err => {
            console.error('Failed to copy text:', err);
          });
        });

        const deleteButton = messageItem.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
          if (confirm('Are you sure you want to delete this message?')) {
            // API call to delete the message (optional)
            fetch(`${apiBaseUrl}?action=deleteMessage&id=${msg.id}`, { method: 'DELETE' })
              .then(response => {
                if (response.ok) {
                  // Remove the message from the chat box
                  chatBox.removeChild(messageItem);
                  alert('Message deleted successfully!');
                } else {
                  alert('Failed to delete message. Please try again.');
                }
              })
              .catch(error => {
                console.error('Error deleting message:', error);
                alert('An error occurred while deleting the message.');
              });
          }
        });
          });

          // Scroll to the latest message only on initial load or when new messages are fetched
          if (initialLoad || messages.length !== previousMessageCount) {
            chatBox.scrollTop = chatBox.scrollHeight;
              notification();
              localStorage.setItem("msgload", "True");
          }
            document.getElementById("chat-form").style.visibility = "visible";
        }

        // Update the previous message count
        previousMessageCount = messages.length;
      })
      .catch(error => console.error("Error fetching messages:", error));
  }

function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits for day
  const month = date.toLocaleString('en-US', { month: 'short' }); // Abbreviated month name
  const year = date.getFullYear().toString().slice(-2); // Last two digits of the year

  const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure two digits for minutes
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM'; // AM/PM designation

  return `${day}-${month}-${year}, ${hours}:${minutes} ${ampm}`;
}
    
  // Initial fetch of messages
  fetchMessages(true);

  // Periodically fetch messages every second
  fetchMessagesInterval = setInterval(fetchMessages, 1000);

  // Handle message sending
  function sendMessage() {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();
    if (message) {
        const modifiedMessage = `'${message}`;
      fetch(`${apiBaseUrl}?action=sendMessage&sender=${senderEmail}&receiver=${recipientEmail}&message=${encodeURIComponent(modifiedMessage)}`)
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            messageInput.value = ""; // Clear input field after sending
            fetchMessages(); // Immediately update chat box with new message
          }
        })
        .catch(error => console.error("Error sending message:", error));
    }
  }
document.getElementById("message-input").addEventListener('input', function() {
  const messageInput = document.getElementById("message-input");
  if (messageInput.value.trim() !== "") {
    messageInput.style.border = '1px solid #e6e6e6'; // Reset border to original color
  } else {
    messageInput.style.border = '1px solid red'; // Keep red border if empty
  }
});
  // Send message on clicking the button
  document.getElementById("send-button").addEventListener("click", sendMessage);

  // Send message on pressing Enter
  document.getElementById("message-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });


  // Function to stop fetching messages and redirect to index.html
  window.stopsetInterval = function () {
    clearInterval(fetchMessagesInterval);
      chatbtn.style.display = "block";
      msgbox.style.display = "none";
  };
});

function openchating() {
  const chatBox = document.getElementById("chat-box");
  const chatContainer = document.getElementById("chating");

  // Show the chat box
  chatContainer.style.display = "block";

  // Allow the browser to render the chat box before scrolling
  setTimeout(() => {
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
  }, 100); // Delay to ensure the chat box is rendered
}

// Close chat functionality
function closechating() {
  document.getElementById("chating").style.display = "none"; // Hide chat box
}

function notification(){
    const msgload = localStorage.getItem("msgload");
    if (msgload){
    notify.style.display = "block";
        return;
    }
}

function notificationSeen(){
    notify.style.display = "none";
}