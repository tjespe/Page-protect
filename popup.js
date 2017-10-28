console.log("Running popup.js");
/**
 * Get the current domain.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var url = tabs[0].url.split("/")[2];
    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

/**
 * Gets the saved state for url.
 *
 * @param {string} url URL whose background color is to be retrieved.
 * @param {function(string)} callback called with the saved state value for
 *     the given url on success, or a false value if no state is retrieved.
 */
function getSavedPageState(url, callback) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
  // for chrome.runtime.lastError to ensure correctness even when the API call
  // fails.
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? false : items[url]);
  });
}

/**
 * Sets the given background color for url.
 *
 * @param {string} url URL for which page protection state is to be saved.
 * @param {function} callback Function to be called after saving state.
 */
function changePageProtectionState(callback) {
  if (prompt("Enter your password to proceed:") == localStorage.password) {
    var items = {};
    getCurrentTabUrl((url)=>{
      getSavedPageState(url, (state)=>{
        items[url] = !state;
        chrome.storage.sync.set(items);
        if (typeof callback !== 'undefined') callback(!state);
      });
    });
  }
}

/**
 * Check if a password is set
 * @param {function(bool)} callback Function to be called after checking if password is set.
 */
function getKeyState(callback) {
  console.log("Getting state of password");
  callback(typeof localStorage.password === "string");
}

/**
 * Set a password
 * @param {function()} callback Function to be called after setting password.
 */
function setKey(callback) {
  while (typeof key !== "string" || !key.length) {
    var key = prompt("Please enter a password");
  }
  localStorage.password = key;
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    var a = document.getElementById('a');
    var sp = document.getElementById("set-password");

    // Check if a password is set and update the popup view accordingly
    function updateContentIfKeyIsSet () {
      getKeyState((keyIsSet)=>{
        if (keyIsSet) {
          sp.style.display = "none";
          a.style.display = "block";
          updateContent();
        }
      });
    }
    updateContentIfKeyIsSet();

    // Load the saved state for this domain and modify the popup window
    // text, if needed.
    function updateContent () {
      getSavedPageState(url, (state) => {
        a.innerText = state ? "Disable password protection for this page" : "Enable password protection for this page";
      });
    }

    // Allow user to change page state
    a.addEventListener('click', () => {
      a.innerText = "";
      changePageProtectionState(updateContent);
    });

    // Allow user to set password
    sp.addEventListener('click', ()=>{
      setKey(updateContentIfKeyIsSet);
    });
  });
});
