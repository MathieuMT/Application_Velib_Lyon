/******************************************** COUNTDOWN 20 MINUTES ********************************************/
class Countdown {
    constructor(){
        this.notification = document.getElementById('notification');
        this.annulation = document.getElementById('annulation');
        this.validation = document.getElementById('btn_validation');
        this.reset = -1;
        this.showTimer();
        this.timerOnLoad();        
    }
    
    /*** MÉTHODE POUR AFFICHER LE COMPTE À REBOURS ***/
    showTimer() {
        console.log('showTimer');
        this.validation.addEventListener('click', () => {
            let twentyMinutes = 60 * 20, /* 60 secondes x 20 minutes  */
            display = document.getElementById('countdown');
            this.startTimer(twentyMinutes, display);
            this.stopTimer();
        })
    }
    
    /*** MÉTHODE POUR DÉMARRER LE COMPTE À REBOURS ***/
    startTimer(duration, display) {
        console.log('startTimer');
        let timer = duration, minutes, seconds;    
        this.reset = setInterval(function() {
            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10);
 
            sessionStorage.setItem('minutes', minutes);
            sessionStorage.setItem('seconds', seconds);
            
            let countdown = {
                minutes : sessionStorage.getItem('minutes'),
                seconds : sessionStorage.getItem('seconds'),
            }
            console.log('startTimer-sessionStorage.getItem.countdown.minutes:  ' + countdown.minutes);
            console.log('startTimer-sessionStorage.getItem.countdown.seconds:  ' + countdown.seconds);
            
            countdown.minutes = countdown.minutes + ' minute' + (countdown.minutes > 1 ? 's' : '');
            countdown.seconds = countdown.seconds + ' seconde' + (countdown.seconds > 1 ? 's' : '');
 
            display.textContent = countdown.minutes + ' ' + countdown.seconds ;//

            if (--timer < 0) {
                timer = duration;
            } 
            if (timer === 0){
                duration = 0;
                clearInterval(this.reset);
                sessionStorage.clear(); 
                document.getElementById('notification').innerHTML = ' ';
                $('#annulation').css('display', 'none');
                $('#countdown').css('display', 'none');
                $('#sectionExpiration').css('display', 'flex');
                /* pour défiler vers la popup d'expiration sur les petits ecrans */
                if ($(window).width() <= 576 ) { 
                    $(window).scrollTop($('#sectionExpiration'));
                }
                
            }
            
        }, 1000);
    }
    
    /*** MÉTHODE POUR AFFICHER LE COMPTE À REBOURS APRÈS LE RAFRAICHISSEMENT DE LA PAGE ***/
    timerOnLoad() {
        console.log('timerOnLoad');
        let that = this;
        let minutes = sessionStorage.getItem('minutes'),
            seconds = sessionStorage.getItem('seconds'),
            timer_amount = parseInt(minutes * 60) + parseInt(seconds),
            display = document.getElementById('countdown');
        console.log('timerOnLoad-sessionStorage.getItem.minutes:  ' + minutes);
        console.log('timerOnLoad-sessionStorage.getItem.seconds:  ' + seconds);
        
        /* AFFICHAGE DU COUNTDOWN APRÈS LE RAFRAICHISSEMENT DE LA PAGE */
        if (sessionStorage.minutes < 20) {
                
            minutes = minutes + ' minute' + (minutes > 1 ? 's' : '');
            seconds = seconds + ' seconde' + (seconds > 1 ? 's' : '');
                        
            display.textContent = minutes + ' ' + seconds ;//
 
            that.reset = setInterval(that.storageTimer(timer_amount, display), 1000);    
                
            this.annulation.addEventListener('click', () => {
                clearInterval(that.reset);                    
                window.location.reload();
                sessionStorage.clear();   
            })
                
        } else if ( sessionStorage.minutes === 0 && sessionStorage.seconds === 0) {
                
            that.reset = setInterval(that.storageTimer(timer_amount, display), 1000);
            clearInterval(that.reset);
            sessionStorage.clear(); 
        }
    }     
    
    /*** MÉTHODE POUR DÉMARRER LE COMPTE À REBOURS APRÈS LE RAFRAICHISSEMENT DE LA PAGE***/
    storageTimer(duration, display) {
        console.log('storageTimer');
        let timer = duration, minutes, seconds;    
        this.reset = setInterval(function() {
            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10);
            
            sessionStorage.setItem('minutes', minutes);
            sessionStorage.setItem('seconds', seconds);
            
            
            let countdown = {
                minutes : sessionStorage.getItem('minutes'),
                seconds : sessionStorage.getItem('seconds'),
            }
            
            console.log('storageTimer-sessionStorage.getItem.countdown.minutes:  ' + countdown.minutes);
            console.log('storageTimer-sessionStorage.getItem.countdown.seconds:  ' + countdown.seconds);
            
            let display = document.getElementById('countdown');
            
            countdown.minutes = countdown.minutes + ' minute' + (countdown.minutes > 1 ? 's' : '');
            countdown.seconds = countdown.seconds + ' seconde' + (countdown.seconds > 1 ? 's' : '');
            
            display.textContent = countdown.minutes + ' ' + countdown.seconds ;//
            
            if (--timer < 0) {
                timer = duration;
            } 
            if (timer === 0 ) {
                duration = 0;
                clearInterval(this.reset);
                sessionStorage.clear(); 
                document.getElementById('notification').innerHTML = ' ';
                $('#annulation').css('display', 'none');
                $('#countdown').css('display', 'none');
                $('#sectionExpiration').css('display', 'flex');
                /* pour défiler vers la popup d'expiration sur les petits ecrans */
                if ($(window).width() <= 576 ) { 
                    $(window).scrollTop($('#sectionExpiration'));
                }
            }

        }, 1000);
    }
    
    /*** MÉTHODE POUR STOPER LE COMPTE À REBOURS ***/
    stopTimer(){
        console.log('stopTimer');
        this.annulation.addEventListener('click', () => {
            clearInterval(this.reset);
            window.location.reload();
            sessionStorage.clear();             
        })
    }
}

/* countdown est l'objet instancié de la classe Countdown */
let countdown = new Countdown();
