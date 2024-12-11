document.addEventListener("DOMContentLoaded", () => {
    const urlInput = document.getElementById("urlInput");
    const addUrlButton = document.getElementById("addUrlButton");
    const urlList = document.getElementById("urlList");
    const pinInput = document.getElementById("pinInput");
    const setPinButton = document.getElementById("setPinButton");
  
    // Load existing settings
    chrome.storage.sync.get(["lockedUrls", "pin"], ({ lockedUrls, pin }) => {
      lockedUrls?.forEach(addUrlToList);
      if (pin) pinInput.value = pin;
    });
  
    // Add URL
    addUrlButton.addEventListener("click", () => {
      const url = urlInput.value.trim();
      if (url) {
        chrome.storage.sync.get(["lockedUrls"], ({ lockedUrls }) => {
          const updatedUrls = [...(lockedUrls || []), url];
          chrome.storage.sync.set({ lockedUrls: updatedUrls }, () => {
            addUrlToList(url);
            urlInput.value = "";
          });
        });
      }
    });
  
    // Set PIN
    setPinButton.addEventListener("click", () => {
      const pin = pinInput.value.trim();
      if (pin) {
        chrome.storage.sync.set({ pin }, () => {
          alert("PIN updated!");
        });
      }
    });
  
    // Add URL to the list
    function addUrlToList(url) {
      const li = document.createElement("li");
      li.textContent = url;
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.style.marginLeft = "10px";
      removeButton.addEventListener("click", () => {
        chrome.storage.sync.get(["lockedUrls"], ({ lockedUrls }) => {
          const updatedUrls = lockedUrls.filter((u) => u !== url);
          chrome.storage.sync.set({ lockedUrls: updatedUrls }, () => {
            li.remove();
          });
        });
      });
      li.appendChild(removeButton);
      urlList.appendChild(li);
    }
  });
  