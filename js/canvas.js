// OBJET Canvas:

var Canvas = {
    init: function() {
        this.mouseX;
        this.mouseY;
        this.mouseDown = 0;
        
        this.touchX;
        this.touchY;
        
        this.radius = 2;
        
        this.canvas = document.getElementById('canvas');
        
        this.ctx = this.canvas.getContext('2d');
        
        
    
    
        // Évènements souris:
        
        this.canvas.addEventListener('mousedown', this.sketchpad_mouseDown, false);
        
        this.canvas.addEventListener('mousemove', this.sketchpad_mouseMove, false);
        
        this.canvas.addEventListener('mouseup', this.sketchpad_mouseUp, false);
        
        
        // Évènements tactil:
        
        this.canvas.addEventListener('touchstart', this.sketchpad_touchStart, false);
        
        this.canvas.addEventListener('touchmove', this.sketchpad_touchMove, false);
        
        this.canvas.addEventListener('touchend', this.skechpad_touchEnd, false);
    
     },
        
    drawLine: function (ctx, x, y, size) {
        // Si lastX n'est pas défini, définissez lastX et lastY sur la position actuelle 
        if (Canvas.lastX == -1) {
            Canvas.lastX = x;
            Canvas.lastY = y;
        }
    
        // Utilisons le noir en réglant les valeurs RVB sur 0 et 255 alpha (complètement opaque)
        r=0; g=0; b=0; a=255;
    
        // Sélectionnez un style de remplissage
        Canvas.ctx.strokeStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
    
        // Réglez le style de la ligne "cap" sur "round", afin que les lignes à différents angles puissent se rejoindre
        Canvas.ctx.lineCap = "round";
    
        // Dessiner une ligne remplie
        Canvas.ctx.beginPath();
    
        // D'abord, passez à l'ancienne position (précédente)
        Canvas.ctx.moveTo(Canvas.lastX, Canvas.lastY);
    
        // Dessinez maintenant une ligne jusqu'à la position actuelle du pointeur
        Canvas.ctx.lineTo(x,y);
    
        // Définir l'épaisseur de la ligne et dessiner la ligne
        Canvas.ctx.lineWidth = size;
        Canvas.ctx.stroke();
    
        Canvas.ctx.closePath();
    
        // Mettre à jour la dernière position pour référencer la position actuelle
        Canvas.lastX = x;
        Canvas.lastY = y;
    
    },
    
    effacerSignature: function(){
        Canvas.ctx.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
    },
    
    sketchpad_mouseDown: function () {
        Canvas.mouseDown = 1;
        Canvas.drawLine(Canvas.ctx, Canvas.mouseX, Canvas.mouseY, Canvas.radius);
    },
    
    sketchpad_mouseUp: function () {
        Canvas.mouseDown = 0;
        
        Canvas.lastX = -1;
        Canvas.lastY = -1;
    },
    
    sketchpad_mouseMove: function (e) {
        Canvas.getMousePos(e);
        
        if (Canvas.mouseDown == 1) {
            Canvas.drawLine (Canvas.ctx, Canvas.mouseX, Canvas.mouseY, Canvas.radius);
        }
    },
    
    getMousePos: function (e) {
        if (!e) {
            var e = event;
        }
    
    if (e.offsetX) {
            Canvas.mouseX = e.offsetX;
            Canvas.mouseY = e.offsetY;
        }
    
    else if (e.layerX) {
            Canvas.mouseX = e.layerX;
            Canvas.mouseY = e.layerY;
        }
    },
    
    sketchpad_touchStart: function (e) {
        Canvas.getTouchPos (e);
        Canvas.drawLine(Canvas.ctx, Canvas.touchX, Canvas.touchY, Canvas.radius);
        
        e.preventDefault();
    },
    
    skechpad_touchEnd: function () {
        Canvas.lastX = -1;
        Canvas.lastY = -1;
    },
    
    sketchpad_touchMove: function (e) {
        Canvas.getTouchPos (e);
        
        Canvas.drawLine (Canvas.ctx, Canvas.touchX, Canvas.touchY, Canvas.radius);
        
        e.preventDefault();
    },
    
    getTouchPos: function (e) {
        if (!e) 
        var e = event;
   
    
        if (e.touches) {
            if (e.touches.length == 1) {// Ne traiter qu'avec un doigt
            
                var touch = e.touches[0]; // Obtenez l'information pour le doigt # 1
                Canvas.touchX = touch.pageX-touch.target.offsetLeft;
                Canvas.touchY = touch.pageY-touch.target.offsetTop;
            }
        }
    },
    
};


window.addEventListener('load', function(){
    
    Canvas.init();
    
} );
