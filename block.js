console.log("Running block.js", location);

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
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

/* Prompt user for password */
getSavedPageState(location.hostname, (state)=>{
  console.log(state);
  if (state) {
    if (typeof sessionStorage.last_auth === "undefined" || Date.now()-sessionStorage.last_auth > 1000*60*15) {
      document.body.innerHTML += `<div id="overlay-pr" style="
      height: 100%;
      width: 100%;
      position: absolute;
      background: #fff;
      z-index: 99999;
      top: 0;
      "></div>`
      chrome.storage.sync.get("password", (items)=>{
        while (prompt("Please enter your password") !== items.password) {
          alert("Sorry! Wrong password! Please try again!");
        }
        console.log("Passwords matched!");
        document.body.removeChild(document.getElementById("overlay-pr"));
        sessionStorage.last_auth = Date.now();
        if (typeof callback !== 'undefined') callback(!state);
      });
    }
  }
});
