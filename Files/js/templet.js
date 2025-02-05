const apiUrl = "https://script.google.com/macros/s/AKfycbxsOtpLh4_o7EapVnGbxJXVp2m8WJ0AFEv2M6RHqqIlYHJTpmeGwMG4VrACh8vcc2wR/exec"; // Replace with your Google Apps Script URL
const API2_URL = "https://script.google.com/macros/s/AKfycbwCqigws5tUSNuKm4IQ2VLiN-KWKWZDrDzDliQzOzxwMgb2BezGSDOww5tZrOtVq2Kt/exec";
fetchSettings();
async function fetchSettings() {
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                const settingsList = document.getElementById("test");

                if (data.success) {
                    settingsList.innerHTML = ""; 

                    data.data.forEach((setting, index) => {
                        if (index === 0) return; 
                        const title = setting[1] || "";
                        const value = setting[2] || "";
                        const url = setting[3];

                        // Extract Google Drive file ID
                        const fileIdMatch = url.match(/\/d\/(.*?)\//);
                        if (fileIdMatch && fileIdMatch[1]) {
                            const fileId = fileIdMatch[1];
                            const imgSrc = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
                            const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
                            const email = localStorage.getItem("email");
                            const displayStyle = email ? "flex" : "none";
                            const settingDiv = document.createElement("div");
                            settingDiv.className = "setting w3-third w3-padding";
                            
                            settingDiv.innerHTML = `
                                <div class="content-item w3-border w3-round" style="margin:5px; max-width:100%;">
                                    <img class="dynamicImg" src="https://saliantech.github.io/Saliantech/Files/resources/waiting.gif" alt="Loading Image..." style="width: 100%;">
                                    <div class="text-container">
                                        <h3 class="w3-text-dark-gray typing"><strong>${title}</strong></h3>
                                        <p>${value}</p></div>
                                        <div style="display:flex">
                                        <button id="downld" class="w3-button w3-blue w3-round-large" style="display: ${displayStyle};margin:5px;" onclick="ticketdiv('${title}')">BOOK NOW</button>
                                        <a href="${downloadUrl}" style="margin:5px;" class="w3-button w3-green w3-round-large" download="image.jpg">DOWNLOAD</a>
                                </div></div>
                            `;

                            // Load image dynamically
                            const imgElement = settingDiv.querySelector('.dynamicImg');
                            const img = new Image();
                            img.src = imgSrc;
                            img.onload = () => {
                                imgElement.src = imgSrc;
                            };

                            settingsList.appendChild(settingDiv);
                        }
                    });
                   
                    applyScrollEffects();
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        }

        function applyScrollEffects() {
            gsap.utils.toArray(".setting").forEach((card) => {
                let textContainer = card.querySelector('.text-container');
                let titleElement = card.querySelector('.typing strong');

                // Scroll effect for image & container
                gsap.fromTo(card, 
                    { opacity: 0, scale: 0.8 }, 
                    { 
                        opacity: 1, scale: 1, duration: 1.2, ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            toggleActions: "play none none reset",
                        },
                    }
                );

                // Scroll effect for text
                gsap.fromTo(textContainer, 
                    { opacity: 0, x: -50 }, 
                    { 
                        opacity: 1, x: 0, duration: 1, delay: 0.5, ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            toggleActions: "play none none reset",
                        },
                    }
                );

                // Typing Effect Reset
                if (titleElement) {
                    let text = titleElement.innerText;
                    titleElement.innerText = ""; 

                    function typingEffect(i = 0) {
                        if (i < text.length) {
                            titleElement.innerText += text[i];
                            setTimeout(() => typingEffect(i + 1), 50);
                        }
                    }

                    // Re-trigger typing effect on scroll
                    ScrollTrigger.create({
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reset",
                        onEnter: () => typingEffect(),
                        onLeaveBack: () => titleElement.innerText = "", 
                    });
                }
            });
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


