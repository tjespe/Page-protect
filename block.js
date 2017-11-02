console.log("running block.js", location);

/**
 * gets the saved state for url.
 *
 * @param {string} url url whose background color is to be retrieved.
 * @param {function(string)} callback called with the saved state value for
 *     the given url on success, or a false value if no state is retrieved.
 */
function getsavedpagestate(url, callback) {
  // see https://developer.chrome.com/apps/storage#type-storagearea. we check
  // for chrome.runtime.lasterror to ensure correctness even when the api call
  // fails.
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lasterror ? null : items[url]);
  });
}

/* prompt user for password */
getsavedpagestate(location.hostname, (state)=>{
  console.log(state);
  if (state) {
    if (typeof sessionStorage.last_auth === "undefined" || date.now()-sessionstorage.last_auth > 1000*60*15*0) {
      document.body.innerhtml += `<div id="overlay-pr" style="
      height: 100%;
      width: 100%;
      position: fixed;
      background: #fff;
      z-index: 99999;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      ">
        <div>
          <h3 style="text-align:center">enter your password:</h3>
          <input type=password id="pp-pass" style="border-radius: 5px; border: 1px solid #bbb; font-size: 1.3em; text-align: center">
        </div>
      </div>`
      chrome.storage.sync.get("password", (items)=>{
        //while (document.getElementById("pp-pass").value !== items.password) {
        //}
        //console.log("Passwords matched!");
        //document.body.removeChild(document.getElementById("overlay-pr"));
        //sessionStorage.last_auth = Date.now();
        //if (typeof callback !== 'undefined') callback(!state);
      });
    }
  }
});
