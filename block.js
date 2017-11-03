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
      position: fixed;
      background: #fff;
      z-index: 99999;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: ubuntu,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';
      font-size: 18px!important;
      ">
        <div style="padding-bottom:100px">
          <h3 style="text-align:center;font-weight:200;font-size:18px!important;margin:18px auto!important">Enter your password:</h3>
          <input type=password id="pp-pass" style="border-radius: 5px; border: 1px solid #bbb; font-size: 1.3em; text-align: center" autofocus>
        </div>
      </div>`
      chrome.storage.sync.get("password", (items)=>{
        let interval = setInterval(()=>{
          if (document.getElementById("pp-pass").value === items.password) {
            console.log("Passwords matched!");
            document.body.removeChild(document.getElementById("overlay-pr"));
            sessionStorage.last_auth = Date.now();
            if (typeof callback !== 'undefined') callback(!state);
            clearInterval(interval);
          }
        }, 50);
      });
    }
  }
});
