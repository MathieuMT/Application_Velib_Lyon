/* on définit la classe Canvas */ 
class Canvas{
	constructor(idCanvas, width, height){
        this.canvas = document.getElementById(idCanvas);
		this.cleanCanvas = document.getElementById("btn_effacer");
        this.btnClosePopupSignature = document.querySelector(".close_canvas");
		this.ctx = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;
        this.drawing = false;
        this.mouseEvents();
		this.btnCleaning();
        this.closeCleaningSignature();
		this.cleaning();
    }
    
    /* methode pour démarer la position du dessin */
    startPosition(e) {
        let Canvas = this;
        this.drawing = true;
        if (e.type === "mousedown") {
          Canvas.x = e.pageX - Canvas.canvas.offsetLeft;
          Canvas.y = e.pageY - Canvas.canvas.offsetTop;
        } else if (e.type === "touchstart") {
          Canvas.x = e.touches[0].pageX - Canvas.canvas.offsetLeft; /* on utilise touches[0] ce qui signifie qu'on affichera que les coordonnées d'un doigt (le premier doigt) qui touche l'écran tactil */
          Canvas.y = e.touches[0].pageY - Canvas.canvas.offsetTop;
          e.preventDefault(); /* pour empecher le canvas de bouger et d'éviter le défilement de l'écran afin de pouvoir dessiner */
        }
        Canvas.draw(e); /* ajouter cette fonction ici permet de dessiner sur le canvas */
    }
    
    /* methode pour terminer le dessin sur le canvas */
	finishedPosition() {
		let Canvas = this;
        Canvas.drawing = false;
	    Canvas.ctx.beginPath();
	}
    
    /* méthode pour dessiner */
    draw(e) {
        
        let Canvas = this;
        
        if (!Canvas.drawing) return; /* si on ne dessine pas rien ne se passe */
            Canvas.ctx.lineWidth = 2; /* taille du trait de dessin */
            Canvas.ctx.lineCap = "round";/* forme ronde du point de dessin */
            Canvas.ctx.strokeStyle = "#007bff";/* couleur du trait du dessin */
        if (e.type === "mousemove") {
              Canvas.x = e.pageX - Canvas.canvas.offsetLeft; // devrait servir a ne plus decaler le dessin et le canvas?
              Canvas.y = e.pageY - Canvas.canvas.offsetTop;
        } else if (e.type === "touchmove") {
              Canvas.x = e.touches[0].pageX - Canvas.canvas.offsetLeft; //uses touches[0] meaning that it will only show the coordinates of one finger (the first).
              Canvas.y = e.touches[0].pageY - Canvas.canvas.offsetTop;
              e.preventDefault(); /* pour empecher le défilement sur l'écran afin que le canvas ne bouge pas pour qu'on puisse dessiner */
        }
        Canvas.ctx.lineTo(Canvas.x, Canvas.y);
        Canvas.ctx.stroke(); /* commence a dessiner la ligne */
        Canvas.ctx.beginPath(); /* cela fonction sans cette ligne mais cela permet d'etre moins pixelisé et d'avoir un trait plus lisse */
        Canvas.ctx.moveTo(Canvas.x, Canvas.y);
    }
    
    /* methode pour nettoyer le dessin du canvas */
	cleaning() {
		let Canvas = this;
        Canvas.ctx.clearRect(0, 0, Canvas.canvas.width, this.canvas.height);
     }
    
    /* méthode pour déssiner soit avec la souris soit sur écran tactil */
    mouseEvents() {  
        let Canvas = this;  
        Canvas.canvas.addEventListener("mousedown", e => Canvas.startPosition(e));
        Canvas.canvas.addEventListener("touchstart", e => Canvas.startPosition(e));
        Canvas.canvas.addEventListener("mouseup", () => Canvas.finishedPosition());
        Canvas.canvas.addEventListener("touchend", () => Canvas.finishedPosition());
        Canvas.canvas.addEventListener("mousemove", e => Canvas.draw(e));
        Canvas.canvas.addEventListener("touchmove", e => Canvas.draw(e));
    }

    /* methode qui nettoie le canvas au clic sur le bouton "effacer" */
	btnCleaning(){
		let Canvas = this;
		Canvas.cleanCanvas.onclick = function (){ 
			Canvas.cleaning();
	   }
	}
    
    /* méthode qui nettoie le canvas au clic sur la croix de fermeture de la popup de signature */
	closeCleaningSignature(){
		let Canvas = this;
		Canvas.btnClosePopupSignature.onclick = function (){ 
			Canvas.cleaning();
	   }
	}
}  

/* la constante c est l'objet instancié de la classe Canvas avec les arguments de la méthode constructor(idCanvas, width, height) qui sont initialisés lors de l'instanciation de l'objet c */
const c = new Canvas("canvas", 300, 150);

