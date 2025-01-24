  const API_URL = "https://script.google.com/macros/s/AKfycbwCqigws5tUSNuKm4IQ2VLiN-KWKWZDrDzDliQzOzxwMgb2BezGSDOww5tZrOtVq2Kt/exec";
const body = document.querySelector("body"), 
      modeToggle = body.querySelector(".mode-toggle"),
      sidebar = body.querySelector("nav"),
      sidebarToggle = body.querySelector(".sidebar-toggle");

// Get and apply saved mode and sidebar status from localStorage
initializeSettings();

function initializeSettings() {
    let getMode = localStorage.getItem("mode");
    if (getMode && getMode === "dark") {
        body.classList.add("dark");
    }

    let getStatus = localStorage.getItem("status");
    if (getStatus && getStatus === "close") {
        sidebar.classList.add("close");
    }
}

// Function to toggle dark mode
function toggleDarkMode() {
    body.classList.toggle("dark");
    const mode = body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("mode", mode);
}

// Function to toggle sidebar open/close
function toggleSidebar() {
    sidebar.classList.toggle("close");
    const status = sidebar.classList.contains("close") ? "close" : "open";
    }

// Event Listeners
modeToggle.addEventListener("click", toggleDarkMode);
sidebarToggle.addEventListener("click", toggleSidebar);


//---------
 // Display user info or intro
/*const userStatusUrl = "https://script.google.com/macros/s/AKfycbyeQ9ro0F_FIfe0i201HDGkn91J09VBSTI5wOcwse-U-NVCo1ll6BBabmuohyKYmf6n/exec"; // Replace with your web app URL
*/
const email = localStorage.getItem("email"); // Assuming 'userEmail' is stored in local storage

window.onload = async function () {
    fetchSettings();
    const loadingTimeout = 5000; // Set timeout duration (10 seconds)
    let loadingTimeoutRef;
    localStorage.removeItem("msgload");
    // Show alert if loading takes too long
    const showInternetAlert = () => {
        alert("It seems the page is taking too long to load. Please check your internet connection.");
        window.location.href = "index.html";
    };

    // Clear the loading timeout if everything loads on time
    const clearLoadingTimeout = () => {
        if (loadingTimeoutRef) {
            clearTimeout(loadingTimeoutRef);
        }
    };

    // Start timeout for slow internet
    loadingTimeoutRef = setTimeout(showInternetAlert, loadingTimeout);

    const passwordResetMessage = localStorage.getItem("passwordResetMessage");
    if (passwordResetMessage) {
        showPopupMessage(passwordResetMessage);
        localStorage.removeItem("passwordResetMessage");
    }

    if (!email) {
        window.location.href = "#";
        waitSec(() => {
            loadimg.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
            waitSec(() => {
                draft.style.display = "block";
            }, 3);
            waitSec(() => {
                hideLoading();
            }, 4);
            waitSec(() => {
                alertPopup.style.display = "block";
            }, 10);
        }, 5);

        clearLoadingTimeout(); // Stop timeout since we know email is missing
        return;
    }

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const clientData = data.find(row => row[1] === email);

        if (clientData) {
            document.getElementById("userName").textContent = clientData[0];
            document.getElementById("profileName").textContent = clientData[0];
            document.getElementById("frontName").textContent = clientData[0];
            document.getElementById("userEmail").textContent = clientData[1];
            const userPasswordElement = document.getElementById("userPassword");
            const chatbotshow = document.querySelector(".chatbotopen");
            userPasswordElement.setAttribute("data-password", clientData[2]);
            document.getElementById("userRole").textContent = clientData[3];
            const url = clientData[5];
            const fileIdMatch = url.match(/\/d\/(.*?)\//); // Extract Google Drive file ID
            if (fileIdMatch && fileIdMatch[1]) {
            const fileId = fileIdMatch[1];
            const imgSrc = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
            document.getElementById("profilePic").src = imgSrc;
            document.getElementById("previewImage").src = imgSrc;
            document.getElementById("profileview").src = imgSrc;
            }
            const userole = clientData[3];
            localStorage.setItem("role", userole);
            logindone();
            loadTickets();
            loadimg.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
            chatbotshow.style.display = "block";
        } else {
            alert("User not found!");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load. Please login again.");
        window.location.href = "index.html";
    } finally {
        // Hide the loading indicator and clear the timeout when done
        loadimg.style.display = "none";
        clearLoadingTimeout();
    }
};


function closePopupalert() {
    document.getElementById("alertPopup").style.display = "none";
document.getElementById("alertEdit").style.display = "none";
  }

  function logout() {
  // Clear the stored user data from localStorage
  localStorage.removeItem("email");
      localStorage.removeItem("recipientEmail");
 
    // Optionally, clear any other session-related data if needed
  // localStorage.removeItem('otherKey'); // Example for other session data
  
  // Redirect the user back to the login page
  window.location.href = "index.html"; // Change to your login page URL
}

function viewHome(){
    yourTicket.style.display = "none";
    viewBoxs.style.display = "block";
    draft.style.display = "block";
}

function viewTickets(){
    yourTicket.style.display = "block";
    viewBoxs.style.display = "none";
    draft.style.display = "none";
}

function waitSec(callback, seconds = 2) {
  setTimeout(callback, seconds * 1000);
}

function showLoading() {
                loadimg.style.display = "flex";
            }

function hideLoading() {
                loadimg.style.display = "none";
            }

function logindone(){
    menuTickets.style.display = "block";
    modeLogout.style.display = "block";
    profiletrue.style.display = "block";
    profilefalse.style.display = "none";
    draft.style.display = "block";
    viewBoxs.style.display = "block";
   const userole = localStorage.getItem("role");
    if (userole === 'admin') {
        setting.style.display = "block";
        return;
    }
    
}

function showPopupMessage(message) {
    popupMsg.textContent = message;
    popupMsg.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        popupMsg.classList.remove('show');
    }, 3000);
    }
function reloadTickets(){
	alert("check load");
	loadTickets();
	alert("done");
}
//-------------

let currentlyVisibleGrid = null; // Keeps track of the currently visible grid

function filterSuggestionsAndContent() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const grids = document.querySelectorAll('.content-grid');
    const suggestionList = document.getElementById('suggestion-list');
    
    suggestionList.innerHTML = ''; // Clear previous suggestions
    let suggestionAdded = false; // Flag to track if any suggestion was added

    grids.forEach(grid => {
        const gridType = grid.dataset.grid; // Get grid type (e.g., 'video', 'image')
        const items = grid.querySelectorAll('.content-item');
        let matchFound = false;

        items.forEach(item => {
            const content = item.innerText.toLowerCase(); // Get the visible text content
            if (content.includes(query)) {
                matchFound = true;
            }
        });

        if (matchFound) {
            // Add matching grid type to suggestions
            const suggestion = document.createElement('li');
            suggestion.innerText = capitalize(gridType);
            suggestion.onclick = () => showGrid(gridType);
            suggestionList.appendChild(suggestion);
            searchicon.style.color = "green";
            searchbox.style.border = "1px solid green"
            suggestionList.style.border = "1px solid #ccc";
            suggestionAdded = true; // Mark that a suggestion was added
        }

        // Also filter content in the visible grid in real-time based on the query
        if (currentlyVisibleGrid && grid.dataset.grid === currentlyVisibleGrid) {
            const items = grid.querySelectorAll('.content-item');
            items.forEach(item => {
                const content = item.innerText.toLowerCase();
                if (content.includes(query)) {
                    item.style.display = 'block'; // Show the matching item
                } else {
                    item.style.display = 'none'; // Hide non-matching item
                }
            });
        }
    });

    // If no grid is selected, show all content
    if (!currentlyVisibleGrid) {
        grids.forEach(grid => {
            const items = grid.querySelectorAll('.content-item');
            items.forEach(item => {
                const content = item.innerText.toLowerCase();
                if (content.includes(query)) {
                    item.style.display = 'block'; // Show the matching item
                } else {
                    item.style.display = 'none'; // Hide non-matching item
                }
            });
        });
    }

    // If no suggestion was added, show "No matches found"
    if (!suggestionAdded) {
        const noMatches = document.createElement('li');
        noMatches.innerText = 'No matches found';
        suggestionList.appendChild(noMatches);
        searchicon.style.color = "red";
        searchbox.style.border = "1px solid red"
        suggestionList.style.border = "1px solid red";
    }
}

function showGrid(gridType) {
    const grids = document.querySelectorAll('.content-grid');
    
    grids.forEach(grid => {
        if (grid.dataset.grid === gridType) {
            grid.style.display = 'block'; // Show the matching grid
            currentlyVisibleGrid = gridType; // Set the currently visible grid
        } else {
            grid.style.display = 'none'; // Hide others
        }
    });

    document.getElementById('suggestion-list').innerHTML = ''; // Clear dropdown
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Hide the dropdown when clicking outside
document.addEventListener('click', (event) => {
    const input = document.getElementById('search-input');
    const suggestionList = document.getElementById('suggestion-list');

    if (!input.contains(event.target) && !suggestionList.contains(event.target)) {
        suggestionList.innerHTML = ''; // Clear dropdown
        suggestionList.style.border = "none";
        searchicon.style.color = "var(--black-light-color)";
        searchbox.style.border = "none"
    }
});



//-------

async function loadTickets() {
	showLoading();
  const data = { action: "getTickets", email: localStorage.getItem("email") };
  const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(data) });
  const result = await res.json();
  if (result.success) {
    const tableBody = document.getElementById("ticketTable");
    const totalCountElement = document.getElementById("totalTickets");

    const tickets = result.tickets;

    // Update the total tickets count
    totalCountElement.textContent = tickets.length;

    // Populate the ticket table
    tableBody.innerHTML = tickets
      .map(ticket => {
        const dueDate = new Date(ticket[3]); // Convert to Date object
        const today = new Date(); // Current date
        const timeDifference = dueDate - today; // Time difference in milliseconds
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert to days

        // Format date as DD-MMM-YY
        const formattedDate = dueDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "2-digit"
        }).replace(/ /g, "-");

        // Determine the style based on expiration status
        let dateStyle = "";
        let blinkClass = "";
        let editButton = "";

        if (daysRemaining < 0) {
          // Expired (date is in the past)
          dateStyle = "color: red; font-weight: bold;";
          editButton = `<button class="btn btn-warning" onclick="NonEdit('${ticket[0]}', '${ticket[3]}')"> 
            <i class="fa fa-pencil fa-sm"></i>
          </button>`;
        } else if (daysRemaining <= 5) {
          // Near expiration (5 days or less)
          blinkClass = "blink-red";
          editButton = `<button class="btn btn-warning" onclick="NonEdit('${ticket[0]}', '${ticket[3]}')"> 
            <i class="fa fa-pencil fa-sm"></i>
          </button>`;
        } else {
          // Not near expiration
          editButton = `<button class="btn btn-primary" onclick="openEditModal('${ticket[0]}', '${ticket[2]}', '${ticket[3]}', '${ticket[4]}', '${ticket[5]}')">
            <i class="fa fa-pencil fa-sm"></i>
          </button>`;
        }

        return `
          <tr>
            <td>${ticket[0]}</td>
            <td>${ticket[2]}</td>
            <td style="${dateStyle}" class="${blinkClass}">${formattedDate}</td>
            <td>${ticket[6]}</td>
            <td>
              ${editButton}
                      <button class="btn btn-danger" data-id="${ticket[0]}" onclick="deleteTicket(this)">
                <i class="fa fa-trash fa-sm"></i>
              </button>
            </td>
          </tr>`;
      })
      .join("");
      hideLoading();
  } else {
    alert("Failed to load tickets");
  }
}

//--------

async function addTicket(event) {
  // Prevent the form from submitting and reloading the page
  event.preventDefault();
  // Get form field values
  const type = document.getElementById("type").value.trim();
  const dueDate = document.getElementById("dueDate").value.trim();
  const fileUrl = document.getElementById("fileUrl").value.trim();
  const description = document.getElementById("description").value.trim();

  // Validate inputs
  if (!type || !dueDate || !fileUrl || !description) {
    showPopupMessage("All fields are required. Please fill in the missing fields.");
    return false;
  }

  // Validate URL format
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(fileUrl)) {
    showPopupMessage("Please provide a valid URL for the file link.");
    return false;
  }

  try {
    // Get user email from localStorage
    const email = localStorage.getItem("email");
    if (!email) {
      showPopupMessage("User email is missing. Please log in again.");
      return false;
    }
      showLoading();

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
    const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(data) });

    // Check if the response is valid
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const result = await res.json(); // Parse response as JSON

    // Handle server response
    if (result.success) {
      showPopupMessage("Ticket added successfully!");
      document.getElementById('id01').style.display = 'none'; // Close popup
      loadTickets(); // Refresh ticket list
        
        document.getElementById("type").value = "";
      document.getElementById("dueDate").value = "";
      document.getElementById("fileUrl").value = "";
      document.getElementById("description").value = "";

    } else {
      showPopupMessage("Failed to add ticket: " + (result.error || "Unknown error"));
    }
  } catch (error) {
    console.error("Error adding ticket:", error);
    showPopupMessage("An unexpected error occurred. Please try again later.");
  }
}
//-----------------------
async function updateTicket(event) {
  event.preventDefault(); // Prevent form submission
  const id = document.getElementById("editTicketId").value;
  const type_of_edit = document.getElementById("editType").value.trim();
  const due_date = document.getElementById("editDueDate").value.trim();
  const files_url = document.getElementById("editFilesUrl").value.trim();
  const description = document.getElementById("editDescription").value.trim();

  // Validate inputs
  if (!type_of_edit || !due_date || !files_url || !description) {
    showPopupMessage("All fields are required. Please fill in the missing fields.");
    return false;
  }

  // Validate URL format
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(files_url)) {
    showPopupMessage("Please provide a valid URL for the file link.");
    return false;
  }
showLoading();
  const data = {
    action: "updateTicket",
    id,
    type_of_edit,
    due_date,
    files_url,
    description
  };

  try {
    const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(data) });
    const result = await res.json();

    if (result.success) {
        showLoading();
      showPopupMessage("Ticket updated successfully");
      loadTickets(); // Reload tickets
      closeEditModal(); // Close modal after success
    } else {
      showPopupMessage("Error updating ticket");
    }
  } catch (error) {
    console.error("Error updating ticket:", error);
    showPopupMessage("An unexpected error occurred. Please try again later.");
  }
}

function openEditModal(id, type, dueDate, fileUrl, description) {
   const formattedDate = formatDateForInput(dueDate);
  // Set values in the modal inputs
  document.getElementById("editTicketId").value = id;
  document.getElementById("editType").value = type;
  document.getElementById("editDueDate").value = formattedDate;
    document.getElementById("editFilesUrl").value = fileUrl;
  document.getElementById("editDescription").value = description;
    
  // Display the modal
  document.getElementById("editTicketModal").style.display = "block";
}
function closeEditModal() {
  // Close the modal by hiding it
  document.getElementById("editTicketModal").style.display = "none";
document.getElementById("templteTicketModal").style.display = "none";
    
}

function NonEdit(ticketId, ticketDate) {
    const alertEdit = document.querySelector('#alertEdit');
    const popupTicketId = document.querySelector('#popupTicketId');
    const popupTicketDate = document.querySelector('#popupTicketDate');

    // Format the date to dd-mmm-yy
    const formattedDate = formatDate(ticketDate);

    alertEdit.style.display = "block"; // Show the popup
    popupTicketId.textContent = ticketId; // Set the ticket ID in the popup
    popupTicketDate.textContent = formattedDate; // Set the formatted date in the popup
}
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { day: '2-digit', month: 'short', year: '2-digit' };
    return date.toLocaleDateString('en-GB', options).replace(',', ''); // Format to dd-mmm-yy
}
function formatDateForInput(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
    return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
}
function deleteTicket(button) {
  const id = button.getAttribute("data-id"); // Get the ID from data-id
  
  // Show confirmation dialog
  const confirmation = confirm("Are you sure you want to delete this ticket?");
  if (!confirmation) {
    console.log("Deletion cancelled.");
    return; // Exit if user clicks "No"
  }

  // Proceed with deletion
  console.log("Deleting ticket with ID:", id);
  showLoading();

  const data = { action: "deleteTicket", id };

  fetch(API_URL, {
    method: "POST",
      body: JSON.stringify(data),
  })
    .then((res) => res.text())
    .then((message) => {
      showPopupMessage(message);
      loadTickets();
    })
    .catch((error) => {
      console.error("Error:", error);
      showPopupMessage("Failed to delete the ticket.");
    });
}



//---
function testtemp(){
    localStorage.setItem("email", "sachethansalian@gmail.com");
    window.location.href = "index.html";
}
function reloadpage(){
    window.location.href = "index.html";
}

function toggleSearchBox() {
    const title = document.getElementById('title-container');
    const searchInput = document.getElementById('search-input');
    const suggestionList = document.getElementById('suggestion-list');

    // Hide the main title and show the search input
    title.style.display = 'none';
    searchInput.style.display = 'inline-block'; // Display search input
    suggestionList.style.display = 'block'; // Display suggestion list (optional)
    searchInput.focus(); // Focus on the input
}

// Event listener for clicking outside
document.addEventListener('click', (event) => {
    const searchBox = document.getElementById('searchbox');
    const searchInput = document.getElementById('search-input');
    const suggestionList = document.getElementById('suggestion-list');
    const title = document.getElementById('title-container');
    const searchIcon = document.getElementById('searchicon');

    // Check if the clicked element is outside the search box and search icon
    if (!searchBox.contains(event.target) && event.target !== searchIcon) {
        searchInput.style.display = 'none'; // Hide the search input
        suggestionList.style.display = 'none'; // Hide suggestion list
        title.style.display = 'inline'; // Show the main title
    }
});



//-------

// Function to handle user details update
async function modifyUserDetails(event) {
  event.preventDefault(); // Prevent form submission

  const email = localStorage.getItem("email"); // Retrieve email from local storage
  const newUsername = document.getElementById("modalNewUsername").value.trim();
  const newPassword = document.getElementById("modalNewPassword").value.trim();

  // Validate inputs
  if (!newUsername && !newPassword) {
    showPopupMessage("Please enter at least one field to update.");
    return false;
  }

  // Prepare data for API
  const data = {
    action: "modifyUserDetails",
    email,
    username: newUsername || undefined, // Optional field
    password: newPassword || undefined, // Optional field
  };

  // Show loading indicator
  showLoading();

  try {
    const response = await fetch(API_URL, { 
      method: "POST",
        body: JSON.stringify(data) 
    });

    const result = await response.json();

    if (result.success) {
      showPopupMessage("User details updated successfully.");
      closeEditUserModal(); // Close modal on success
    } else {
      showPopupMessage(result.message || "Error updating user details.");
    }
  } catch (error) {
    console.error("Error modifying user details:", error);
    showPopupMessage("An unexpected error occurred. Please try again later.");
  } finally {
    hideLoading();
  }
}

// Function to open the edit user modal and populate email, username, and password
// Function to open the edit user modal and populate email, username, and password
async function openEditUserModal() {
    showLoading();
  const email = localStorage.getItem("email");

  if (!email) {
    showPopupMessage("No email found. Please log in again.");
    return;
  }

  try {
    // Fetch user data from the server
    const response = await fetch(API_URL);  // Use the correct API URL
    const data = await response.json();

    // Find the user details by email (assuming email is in column 1)
    const clientData = data.find(row => row[1] === email); // Find user by email (column 1)
    if (clientData) {
      // Pre-fill modal fields with the user's details
      document.getElementById("userEmailDisplay").textContent = `Email ID: ${clientData[1]}`;  // Email (column 1)
      document.getElementById("modalNewUsername").value = clientData[0]; // Username (column 0)
      document.getElementById("modalNewPassword").value = clientData[2]; // Password (column 2)
        document.getElementById('id02').style.display='none';
        hideLoading();
      // Open the modal
      document.getElementById("editUserModal").style.display = "block";
    } else {
        hideLoading();
      showPopupMessage("User not found.");
    }
  } catch (error) {
      hideLoading();
    console.error("Error fetching user details:", error);
    showPopupMessage("Failed to load user details. Please try again.");
  }
}


// Function to close the edit user modal
function closeEditUserModal() {
  document.getElementById("editUserModal").style.display = "none";
}

//--------------------------------------------

const profilePic = document.getElementById('profilePic');
const popup = document.getElementById('id04');
const profileInput = document.getElementById('profileInput');
const previewImage = document.getElementById('previewImage');


profilePic.addEventListener('click', () => {
    popup.style.display = 'block';
});


previewImage.addEventListener('click', () => {
    profileInput.click();
});

// Image preview on file selection
profileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

//const GOOGLE_TEST_URL = "https://script.google.com/macros/s/AKfycbxze3_dDVa_hV70v23hZJjTCZqidigubb5DKxhvGEp-4IC96j1L-cWh7lFmsJ2o4UDk4g/exec"; // Replace with your Apps Script URL

async function updateFile() {
            showLoading();
            const fileInput = document.getElementById("profileInput");
            const file = fileInput.files[0];

            if (!file) return alert("Please select a file to update.", "error");

            const reader = new FileReader();
            reader.onload = async function (event) {
                const response = await fetch(API_URL, {
                    method: "POST",
                    body: JSON.stringify({ action: "update", email, fileName: file.name, fileData: event.target.result })
                });
                const result = await response.json();
                showPopupMessage(result.message, result.status);
                if (result.status === "success");
                profilePic.src = previewImage.src;
                popup.style.display = 'none'
                hideLoading();
            };
            reader.readAsDataURL(file);
    hideLoading();
        }

  // Close the popup when clicking outside the content