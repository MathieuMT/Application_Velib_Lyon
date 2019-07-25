// COUNTDOWN 20 minutes:



// OBJET Timer:

var Timer = {
    minutes: 0,
    seconds: 0,
    elm: null,
    refreshIntervalId: null,
    init: function (m,s,elm) {
    m = parseInt(m,10);
    s = parseInt(s,10);
        
        if(m < 0 || s < 0) {
            alert('Invalid Value'); 
            return;
        }
        
        this.minutes = m;
        this.seconds = s;
        this.elm = document.getElementById(elm);
        Timer.start();  
    },
    start: function () {
        this.refreshIntervalId = setInterval((this.doCountDown), 1000);
    },
    doCountDown: function() {
        if (Timer.seconds == 0) {
            if (Timer.minutes == 0) {
                stopTimer();
                return;
            } else {
                Timer.seconds = 60;
                Timer.minutes--;
            }
        }
        Timer.seconds--;
        Timer.updateTimer(Timer.minutes, Timer.seconds);
    },
    updateTimer: function (min, secs) {
        min = min + ' minute' + (min > 1 ? 's' : '');
        secs = secs + ' seconde' + (secs > 1 ? 's' : '');
        (this.elm).innerHTML = min + " " + secs;
        
        sessionStorage.setItem('minStorage', min);
        sessionStorage.setItem('secStorage', secs);
    }
    
    
}

// ARRET DU COUNTDOWN
function stopTimer () {
    clearInterval(Timer.refreshIntervalId);
    $('#session_storage').text('');
    $('#session_storage').text('RESERVATION EXPIRÉE'); 
}
    
// INITIALISE LE COUNTDOWN à 20 MINUTES   
function init() {
    clearInterval(Timer.refreshIntervalId);
    Timer.init(20,1,'countdown');
}


// STOCKAGE DU COUNTDOWN DANS LA MEMOIRE DU SESSION STORAGE DU NAVIGATEUR
function sessionStorageTimer() {
    
    clearInterval(Timer.refreshIntervalId);
    
    var minStorage = sessionStorage.getItem('minStorage');
    var secStorage = sessionStorage.getItem('secStorage');
    
    var nbMinStorage = parseInt(minStorage, 10);
    var nbSecStorage = parseInt(secStorage, 10);
    
    Timer.init(Number(nbMinStorage),Number(nbSecStorage),'countdown');
}                                   
 



