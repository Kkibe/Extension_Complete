//This code will create a timer that will check for the "Skip Ad" button every 30 seconds. 
//If the button is found, the code will click it. 
//The timer will be cleared once the "Skip Ad" button is clicked.

var adSkipTimer = setInterval(function() { 
    var adSkipButton = document.querySelector('.ytp-ad-skip-button'); 
    if (adSkipButton) { 
      adSkipButton.click(); 
      clearInterval(adSkipTimer); 
    } 
  }, 30000); 
  

  //A simple solution to the problem of YouTube's Adblock Detection
  
var removeAdElements = () => {
    var elementsToRemove = document.querySelectorAll('tp-yt-paper-dialog[style-target="host"][role="dialog"][tabindex="-1"][style*="position: fixed; top: 242.25px; left: 270px;"]');
    for (var i = 0; i < elementsToRemove.length; i++) {
        elementsToRemove[i].remove();
    }
  }
  
  const clear = (() => {
    const defined = v => v !== null && v !== undefined;
    const timeout = setInterval(() => {
        const ad = [...document.querySelectorAll('.ad-showing')][0];
        if (defined(ad)) {
            const video = document.querySelector('video');
            if (defined(video)) {
                video.currentTime = video.duration;
            }
        }
    }, 500);
    return function() {
        clearTimeout(timeout);
    }
})();
// clear();



setInterval(function() { 
    var cross = document.getElementsByClassName("ytp-ad-overlay-close-container")[0]; 
    var skip = document.getElementsByClassName("ytp-ad-skip-button")[0]; 
    if (cross != undefined) cross.click(); 
    if (skip != undefined) skip.click() 
    }, 2000);


    //remove ads in embedded video elements
    iframe.setAttribute("src", "youtube.com/embed/" + youtube.id + "?modestbranding=1&;showinfo=0&;autohide=1&;rel=0;"); 



    //ad blocker detection