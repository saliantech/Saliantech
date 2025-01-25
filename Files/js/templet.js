const apiUrl = "https://script.google.com/macros/s/AKfycbxsOtpLh4_o7EapVnGbxJXVp2m8WJ0AFEv2M6RHqqIlYHJTpmeGwMG4VrACh8vcc2wR/exec"; // Replace with your Google Apps Script URL
const API2_URL = "https://script.google.com/macros/s/AKfycbwCqigws5tUSNuKm4IQ2VLiN-KWKWZDrDzDliQzOzxwMgb2BezGSDOww5tZrOtVq2Kt/exec";
fetchSettings();
async function fetchSettings() {
    loadimage.style.display = "block";
      const response = await fetch(apiUrl);
      const data = await response.json();
      const settingsList = document.getElementById("test");

      if (data.success) {
        settingsList.innerHTML = ""; // Clear previous settings

        data.data.forEach((setting, index) => {
          if (index === 0) return; // Skip header row
          const value = setting[2] || "";
           const url = setting[3];
          const settingDiv = document.createElement("div");
          settingDiv.className = "setting";

           const fileIdMatch = url.match(/\/d\/(.*?)\//); // Extract Google Drive file ID
        if (fileIdMatch && fileIdMatch[1]) {
          const fileId = fileIdMatch[1];
          const imgSrc = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
            
            
          settingDiv.innerHTML = `
            <div class="content-item w3-third w3-padding w3-border w3-round" style="margin:5px; max-width:100%;">
            <img src="${imgSrc}" alt="Edited Photos" style="width: 100%; border-radius: 10px;">
            <h3 style="color: #444;"><strong>${setting[1]}</strong></h3>
            <P>${value}</P>
            <button class="w3-button w3-blue w3-text-white w3-round-large" onclick="ticketdiv('${setting[1]}')">BOOK NOW</button>
            </div>
            `;
            settingsList.appendChild(settingDiv);
        }
        });
           
}
    }


function ticketdiv(type) {
  const dueDate = "";
  const fileUrl = "";
  const description = "";
     document.getElementById("TType").textContent = type;
  document.getElementById("TDueDate").value = dueDate;
    document.getElementById("TFilesUrl").value = fileUrl;
  document.getElementById("TDescription").value = description;
document.getElementById("templteTicketModal").style.display = "block";
}

async function templateTicket(event) {
  // Prevent the form from submitting and reloading the page
  event.preventDefault();
  // Get form field values
  const type = document.getElementById("TType").textContent;
  const dueDate = document.getElementById("TDueDate").value.trim();
  const fileUrl = document.getElementById("TFilesUrl").value.trim();
  const description = document.getElementById("TDescription").value.trim();

  // Validate inputs
  if (!type || !dueDate || !fileUrl || !description) {
    alert("All fields are required. Please fill in the missing fields.");
    return false;
  }

  // Validate URL format
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(fileUrl)) {
    alert("Please provide a valid URL for the file link.");
    return false;
  }

  try {
    // Get user email from localStorage
    const email = localStorage.getItem("email");
    if (!email) {
      alert("User email is missing. Please log in again.");
      return false;
    }
      
    // Create the ticket data object
    const data = {
      action: "addTicket",
      email,
      type_of_edit: type,
      due_date: dueDate,
      files_url: fileUrl,
      description,
    };

    // Send ticket data to the server
    const res = await fetch(API2_URL, { method: "POST", body: JSON.stringify(data) });

    // Check if the response is valid
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const result = await res.json(); // Parse response as JSON

    // Handle server response
    if (result.success) {
      alert("Ticket added successfully!");
      document.getElementById("templteTicketModal").style.display = "none";
      // Refresh ticket list
       
    } else {
      alert("Failed to add ticket: " + (result.error || "Unknown error"));
    }
  } catch (error) {
    console.error("Error adding ticket:", error);
    alert("An unexpected error occurred. Please try again later.");
  }
}


