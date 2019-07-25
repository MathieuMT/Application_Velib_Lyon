// OBJET prototype "Diaporama":

var Diaporama = {
    index: 1,
    timer: 0,
    init: function () {
        
         // bouton gauche
        $('#prev').click(function () {
            Diaporama.prev(1);
            clearTimeout(Diaporama.timer);
            Diaporama.timer = setTimeout(Diaporama.autoDiapo, 3000);
        });
        
        // bouton droite
        $('#next').click(function () {
            Diaporama.next(1);
            clearTimeout(Diaporama.timer);
            Diaporama.timer = setTimeout(Diaporama.autoDiapo, 3000);
        });

        // diaporama automatique
        Diaporama.autoDiapo();

        // défile en avant ou en arrère avec les flèches droite et gauche du clavier
        Diaporama.toucheFleche();  
    },
    
///////////////////////////////////////////////////
/*                                               */
/* Le diaporama réagit au clic sur chaque bouton */
/*                                               */ 
///////////////////////////////////////////////////


    montrerImage: function (n) {

        var i, diapoElts = $('.diapo');
        
        if (n > diapoElts.length) {
            Diaporama.index = 1;
        }
        
        if (n < 1) {
            Diaporama.index = diapoElts.length;
        }
        
        for (i = 0; i < diapoElts.length; i++) {
            diapoElts[i].style.display = "none";
        }
        
        diapoElts[Diaporama.index - 1].style.display = "block";

    },

    // bouton droite
    next: function (n) {
        Diaporama.index = Diaporama.index += n;
        Diaporama.montrerImage(Diaporama.index);
    },

    // bouton gauche
    prev: function (n) {
        Diaporama.index = Diaporama.index -= n;
        Diaporama.montrerImage(Diaporama.index);
    },

///////////////////////////////////////////////////
/*                                               */
/*   Le diaporama défile automatiquement toutes  */
/*               les 3 secondes                  */
/*                                               */ 
///////////////////////////////////////////////////

    autoDiapo: function () {

        Diaporama.montrerImage(Diaporama.index);
        
        Diaporama.index++;
   
        Diaporama.timer = setTimeout(Diaporama.autoDiapo, 3000);
    },

///////////////////////////////////////////////////
/*                                               */
/*  Le diaporama réagit aux touches des flèches  */
/*           doite et gouche du clavier          */
/*                                               */ 
///////////////////////////////////////////////////

    toucheFleche: function () {
        $(document).keydown(function (e) {
            switch(e.which) {
                case 37: // fleche gauche
                    Diaporama.prev(1);
                    clearTimeout(Diaporama.timer);
                    Diaporama.timer = setTimeout(Diaporama.autoDiapo, 3000);
                break;
                case 39: // fleche droite
                    Diaporama.next(1);
                    clearTimeout(Diaporama.timer);
                    Diaporama.timer = setTimeout(Diaporama.autoDiapo, 3000);
                break;
                default: console.log("touche invalide");
            }
        });
    }
}



    // Création de l'objet "diapo" avec "Diaporama" comme prototype:
    var diapo = Object.create(Diaporama);

    // Appel de l'initialisation de l'objet "diapo":
    diapo.init();
   
