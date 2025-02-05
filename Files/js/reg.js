const modal = document.getElementById("popupForm");
  const openPopup = document.getElementById("profilefalse");
  const closeBtn = document.querySelector(".close");
  const toggleLinks = document.querySelectorAll(".toggleForm");
  const forms = document.querySelectorAll(".form");

  // Open the popup
  openPopup.addEventListener("click", () => {
    modal.style.display = "block";
    showForm("loginForm");
  });

  // Close the popup
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Function to show a specific form
  function showForm(formId) {
    forms.forEach((form) => {
      form.style.display = form.id === formId ? "block" : "none";
    });
  }

  // Toggle between forms
  toggleLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetForm = link.getAttribute("data-target");
      showForm(targetForm);
    });
  });

  function lgnshw(){
    closechating();
    closePopupalert();
    modal.style.display = "block";
  }

// Show Verify OTP Form
function showVerifyOTPForm() {
    requestResetPassword.classList.remove('block');
    verifyOtpResetPassword.classList.remove('none');
    requestResetPassword.classList.toggle('none');
    verifyOtpResetPassword.classList.toggle('block');
}

const Login_URL = "https://script.google.com/macros/s/AKfycbwCqigws5tUSNuKm4IQ2VLiN-KWKWZDrDzDliQzOzxwMgb2BezGSDOww5tZrOtVq2Kt/exec";

// Check if the user is already logged in by checking localStorage

//-------
//const userStatusUrl = "https://script.google.com/macros/s/AKfycbzFgpCMbyypB9oat7GW05uvncFiayTSzoXqcT3t6WrlKyz8Oe07ZpLO9fpHLcjdEQ9c/exec"; // Replace with your web app URL
async function register() {
  showLoading();

  // Input validation
  const username = document.getElementById("r_username").value;
  const email = document.getElementById("r_email").value;
  const password = document.getElementById("r_password").value;

  if (username.length < 4) {
    showPopupMessage("Username must be at least 4 characters long.");
    hideLoading();
    return;
  }

  if (!isValidEmail(email)) {
    showPopupMessage("Please enter a valid email address.");
    hideLoading();
    return;
  }

 if (password.length < 4 || !/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
  showPopupMessage("Password must be at least 4 characters long and contain at least one special character.");
  hideLoading();
  return;
}

  // If validation passes, proceed with registration
  const data = {
    action: "register",
    username: username,
    email: email,
    password: password,
  };

  const res = await fetch(Login_URL, { method: "POST", body: JSON.stringify(data) });
  const responseText = await res.text();

  // Parse the JSON response
  const responseJSON = JSON.parse(responseText);

  // Check if there's an error message
  if (!responseJSON.success) {
    showPopupMessage(responseJSON.message);
  } else {
    hideLoading();

  // Store success message in localStorage for displaying on login page
  localStorage.setItem("passwordResetMessage", "Registration Done successfully! Please login.");

  // Redirect to login page
  showForm("loginForm");
  }
    hideLoading();
  // Redirect to login page
  window.location.href = "#";
}

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function login() {
      const data = {
        action: "login",
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value,
      };
    showLoading();
      const res = await fetch(Login_URL, { method: "POST", body: JSON.stringify(data) });
      const result = await res.json();
      if (result.success) {
          localStorage.setItem("email", data.email);
        localStorage.setItem("passwordResetMessage", "Login Successfully done.");
          localStorage.setItem("firstTimeLogin", "True");
      localStorage.setItem("recipientEmail", "admin@example.com");
          // Redirect to login page
          hideLoading();
      window.location.href = "index.html";
      } else {
          hideLoading();
        showPopupMessage("Invalid credentials");
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

    function showLoading() {
                loadimg.style.display = "flex";
            }

function hideLoading() {
                loadimg.style.display = "none";
            }

// Request OTP
async function requestPasswordReset() {
  const email = document.getElementById("resetEmail").value;
showLoading();
  const data = {
    action: "requestPasswordReset",
    email: email,
  };

  try {
    const res = await fetch(Login_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await res.json();
    hideLoading();
      if (result.success) {
      showPopupMessage(result.message);
        showForm("verify-otp-reset-password");
    } else {
      showPopupMessage(result.message, "red");
    }
  } catch (error) {
    showPopupMessage("Failed to connect to the server.", "red");
  }
}

// Verify OTP & Reset Password
async function verifyOTPAndResetPassword() {
  const email = document.getElementById("resetEmail").value;
  const otp = document.getElementById("otp").value;
  const newPassword = document.getElementById("newPassword").value;
showLoading();
  const data = {
    action: "resetPasswordWithOTP",
    email: email,
    otp: otp,
    newPassword: newPassword,
  };

  try {
    const res = await fetch(Login_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await res.json();
    hideLoading();
      if (result.success) {
      showPopupMessage(result.message);
        showForm("loginForm");      // Store success message in localStorage for displaying on login page
      localStorage.setItem("passwordResetMessage", "Password changed successfully! Please login.");
      
      // Redirect to login page
    } else {
      showPopupMessage(result.message, "red");
    }
  } catch (error) {
    showPopupMessage("Failed to connect to the server.", "red");
  }
}

