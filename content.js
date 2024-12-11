// Function to create the blur overlay
function createBlurOverlay(pin) {
    // Check if the overlay already exists
    if (document.getElementById("tabLockOverlay")) return;
  
    const overlay = document.createElement("div");
    overlay.id = "tabLockOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.color = "white";
    overlay.style.backdropFilter = "blur(10px)";
    overlay.innerHTML = `
      <div style="text-align: center;">
        <h2>Enter PIN to access this tab</h2>
        <input type="password" id="pinInput" style="padding: 10px; font-size: 16px;" />
        <button id="unlockButton" style="margin-left: 10px; padding: 10px; font-size: 16px;">Unlock</button>
        <p id="errorMessage" style="color: red; display: none; margin-top: 10px;">Incorrect PIN! Try again.</p>
      </div>
    `;
    document.body.appendChild(overlay);
  
    const pinInput = document.getElementById("pinInput");
    const unlockButton = document.getElementById("unlockButton");
    const errorMessage = document.getElementById("errorMessage");
  
    // Focus the input field automatically
    pinInput.focus();
  
    // Unlock button click event
    unlockButton.addEventListener("click", () => {
      const enteredPin = pinInput.value.trim();
      if (enteredPin === pin) {
        overlay.remove(); // Remove the overlay if PIN is correct
      } else {
        errorMessage.style.display = "block"; // Show error message
        pinInput.value = ""; // Clear the input field
        pinInput.focus(); // Refocus the input field
      }
    });
  }
  
  // Fetch the locked URLs and PIN
  chrome.storage.sync.get(["lockedUrls", "pin"], ({ lockedUrls, pin }) => {
    const currentUrl = window.location.href;
  
    // Lock the tab if it matches a locked URL
    if (lockedUrls.some((url) => currentUrl.includes(url))) {
      createBlurOverlay(pin);
  
      // Re-lock the tab on visibility change
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          createBlurOverlay(pin);
        }
      });
    }
  });
  