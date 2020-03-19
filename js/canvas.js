/* on définit la classe Canvas */ 
class Canvas{
	constructor(){
		this.canvas = document.querySelector("canvas");
		this.cleanCanvas = document.getElementById("btn_effacer");
		this.ctx = this.canvas.getContext("2d");
		this.canvas.width = 300;
		this.canvas.height = 150;
		this.canvasBlank = true;
		this.painting = false;
		this.controlMouse();
        this.controlTouch();
		this.btnCleaning();
		this.cleaning();
       
     }
    
    /* methode pour démarer la position du dessin */
	startPosition()  {
        let Canvas = this;
		Canvas.painting = true;  
		Canvas.canvasBlank = false;
		console.log(Canvas); 
	 }
    
    /* methode pour terminer la position du dessin */
	finishedPosition() {
		let Canvas = this;
        Canvas.painting = false;
	    Canvas.ctx.beginPath();
	}

    /* methode dessiner */
	draw(e) {
		let Canvas = this;
		if (!Canvas.painting) return;
        Canvas.ctx.lineWidth = 2;
        Canvas.ctx.lineCap = "round";
        Canvas.ctx.lineTo(e.offsetX, e.offsetY); 
        Canvas.ctx.stroke();
        Canvas.ctx.beginPath();
        Canvas.ctx.moveTo(e.offsetX, e.offsetY);
        Canvas.ctx.strokeStyle = "#007bff";
	}
    
    /* methode pour nettoyer dessin du canvas */
	cleaning() {
		let Canvas = this;
		Canvas.ctx.clearRect(0, 0, 300, 150);
		Canvas.canvasBlank = true;
     }
 
    
    /* Obtenir la position d'une touche par rapport à la toile */
    getTouchPos(canvasDom, touchEvent) {
        let rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }

 
    /* METHODE POUR DESSINER AVEC LA SOURIS */
    controlMouse(){
        let Canvas = this;
 
        Canvas.canvas.addEventListener("mousedown", function(){
			 Canvas.startPosition();
		});
 
		Canvas.canvas.addEventListener("mousemove", function (e) {
		        Canvas.draw(e);
		});
 
        Canvas.canvas.addEventListener("mouseup", function(){
			Canvas.finishedPosition();
		});
 
		Canvas.canvas.addEventListener("mouseleave", function(){
			Canvas.finishedPosition();
		});
        
	}
    
    /* METHODE POUR DESSINER SUR ECRAN TACTILE */
    controlTouch() {
        
        let Canvas = this;
        
        let mousePos = { x:0, y:0 };
        
		 Canvas.canvas.addEventListener("touchstart", function (e) {
             
            if (e.target == Canvas.canvas) {
                /* Empêcher scrolling sur le canvas */
                e.preventDefault();

                mousePos = Canvas.getTouchPos(Canvas.canvas, e);
                let touch = e.touches[0];
                let mouseEvent = new MouseEvent("mousedown", {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });

                Canvas.canvas.dispatchEvent(mouseEvent);
             }
            
        }, false);
 
		Canvas.canvas.addEventListener("touchmove", function (e) {
            
            if (e.target == Canvas.canvas) {
                /* Empêcher scrolling sur le canvas */
                e.preventDefault();

                let touch = e.touches[0];
                let mouseEvent = new MouseEvent("mousemove", {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });

                Canvas.canvas.dispatchEvent(mouseEvent);
            }
            
        }, false);
 
		 Canvas.canvas.addEventListener("touchend", function (e) {
            
            if (e.target == Canvas.canvas) {
                /* Empêcher scrolling sur le canvas */
                e.preventDefault();

                let mouseEvent = new MouseEvent("mouseup", {});

                Canvas.canvas.dispatchEvent(mouseEvent);
             
            }
        }, false);
        
    }


    
    
    /* methode qui nettoie le canvas au clic sur le bouton "effacer" */
	btnCleaning(){
		let Canvas = this;
		Canvas.cleanCanvas.onclick = function (){ 
			Canvas.cleaning();
	         }
	}
 
}  

/* c est l'objet instancié de la classe Canvas */
let c = new Canvas();
