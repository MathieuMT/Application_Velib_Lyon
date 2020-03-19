/* on definit la classe Diaporama */
class Diaporama {
    
    constructor() {
        /* on cible nos attributs lors dans le constructeur de notre classe "Diaporama" */
        // diapo
        this.diapo = document.getElementsByClassName("diapo");
        // première image du démarage
        this.imageIndex = 0;
        // chevron gauche
        this.chevronGauche = document.getElementById("chevronGauche");
        // chevron droite
        this.chevronDroite = document.getElementById("chevronDroite");
        // on intialise l'intervalle du diaporama à null
        this.intervalleDiapo = null;
        // bouton lecture
        this.lecture = document.getElementById("lecture");
        // bouton pause
        this.pause = document.getElementById("pause");
        // methode qui active les boutons du diaporama
        this.boutonsActifs();
        // methode pour aller vers le diaporama
        this.versDiaporama();
    }

    /* methode pour faire défiler les diapositives de manière automatique: */
    diaporamaAuto() {
        for (let i = 0; i < this.diapo.length; i++) {
            /* on démarre le diaporama à partir de la première image avec l'index égale à 0. 
            si l'image n'est pas la dernière, on avance d'une image. 
            on va à l'image spécifiée, on dit au diaporama à travers sa classe "inactive" 
            quelles images il doit cacher pour afficher seulement celle qui n'a pas la classe "inactive". */
            this.diapo[i].classList.add("inactive");
        }
        if (this.imageIndex === this.diapo.length) {
            /* si on a spécifié une image au niveau de la dernière, on revient à la première */
            this.imageIndex = 0;
        }
        if (this.imageIndex === -1) {
            /* si on a spécifié une image avec un index égale à -1, on vas à la dernière image */
            this.imageIndex = this.diapo.length - 1;
        }
        
        /* on dis au diaporama en supprimant la classe "inactive" du diapo spécifié quelle image il doit afficher. 
        on vas donc à l'image spécifiée en supprimant la classe "inactive" du diapo spécifié. */ 
        this.diapo[this.imageIndex].classList.remove("inactive");
    }
    
    // methode pour aller à la diapositive précédente:
    diapoPrec() {
        /* on décrémente l'index d'une image en une image */
        this.imageIndex--; 
        this.diaporamaAuto();
    }
    
    //methode pour aller à la diapositive suivante
    diapoSuiv() {
        /* on incrément l'index d'une image en une image */
        this.imageIndex++; 
        this.diaporamaAuto();
    }
  
    /* methode pour activer le diaporama toutes les 5 secondes avec le bouton lecture */
    lectureDiapo() {
        this.lecture.classList.add("inactive");
        this.pause.classList.remove("inactive");
        this.intervalleDiapo = setInterval(() => this.diapoSuiv(), 5000);
    }
    
    // methode pour mettre en pause le diaporama
    pauseDiapo() {
        this.pause.classList.add("inactive");
        this.lecture.classList.remove("inactive");
        clearInterval(this.intervalleDiapo);
    }
  
    
    
    /* methode pour faire fonctionner le diaporama avec les flèches du clavier: 
    ici e.key fonctionne mieux que e.keycode */
    flechesClavier(e) {
    switch (e.key) {
      case "ArrowRight":
        this.diapoSuiv(); // flèche droite du clavier
        break;
      case "ArrowLeft":
        this.diapoPrec(); // flèche gauche du clavier
        break;
    }
  }
    
    
    /* methode pour activer les boutons du diaporama: */
    boutonsActifs() {
        // clic sur le bouton du chevron droite
        this.chevronDroite.addEventListener("click", () => this.diapoSuiv());
        // clic sur le bouton du chevron gauche
        this.chevronGauche.addEventListener("click", () => this.diapoPrec());
        // défilement automatique toutes les 5 secondes
        this.intervalleDiapo = setInterval(() => this.diapoSuiv(), 5000);
        // clic sur le bouton lecture
        this.lecture.addEventListener("click", () => this.lectureDiapo());
        // clic sur le bouton pause
        this.pause.addEventListener("click", () => this.pauseDiapo());

        /* touches préssées des flèches de gauche et de droite du clavier. 
        ici keypress ne fonctionne pas avec les touches qui ne sont pas des caractères donc on utilise keydown */
        document.addEventListener("keydown", e => this.flechesClavier(e)); 
    }
    
    
    /* methode pour retourner sur le diaporama quand on est sur la carte */
    versDiaporama() {
        $("#versDiaporama").on("click", () => {
          $(document).ready(() => {
            window.scrollTo(0, 0);
          });
        });
      }    
}


// on instancie la class "Diaporama" pour obtenir l'objet "diaporama" :
const diaporama = new Diaporama();
