// BONUS AUDIO:

(function ($) {
    
    var audio = new Audio('audio/bicyclette.mp3');
    
    $('#btn_validation').click(function () {
        audio.play();
    });
    
    
    $('#annulation').click(function () {
        audio.pause();
        audio.currentTime = 0;
    });
    
})(jQuery);