// Marqueurs de la carte et boutons interractifs avec l'utilisateur:

function initMap() {

    "use strict";
    
  //objet map.
    var map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 45.750000, lng: 4.850000},
        zoom: 12
    });
    
    
    
    
// PANNEAU d'INFOS
    
  $.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=65e29120ccd2a3ccf250c42bea4945f65e2525a0", function (reponse) {
        
        
        
        var markers = [];
        
        
          
      
      
        var iconsMarker = {
            open: 'assets/img/marqueurs/open.png',
            close: 'assets/img/marqueurs/closed.png',
            noVelib: 'assets/img/marqueurs/no_velib.png'
        }
      
        $.each(reponse, function(key, station) {
          var name = station.name;
          var address = station.address;
          var positionLat = station.position.lat;
          var positionLng = station.position.lng; 
          var status = station.status;
          var lastUpdate = new Date(station.last_update);
          var bikeStands = station.bike_stands;
          var availableBikes = station.available_bikes;
          var availableBikeStands = station.available_bike_stands;
          
              
            
          var coords = new google.maps.LatLng(positionLat, positionLng);
            
          var markerOptions = {
            position :coords,
            title:"Station VÉLIB‘: " + name,
            animation: google.maps.Animation.DROP,
            map:map
        };
          
            if((status === 'OPEN') && (availableBikes > 0)) {
                markerOptions.icon = iconsMarker.open;
            }else if((status === 'OPEN') && (availableBikes === 0)) {
                markerOptions.icon = iconsMarker.noVelib;
            }else {
                markerOptions.icon = iconsMarker.close;
            }
            
            
           var marker = new google.maps.Marker(markerOptions);
           
            
           marker.addListener('click', function() {
               $('#name').text(name);
               $('#address').text(address);
               $('#status').text(status);
               $('#bike_stands').text(bikeStands);
               $('#available_bikes').text(availableBikes);
               $('#available_bike_stands').text(availableBikes);
               
               
               if((status === 'OPEN') && (availableBikes > 0)) {
                $('#infos_station li p').css('color','#85ab10');
                $("#btn-reserve").css('display', 'block');
                $("#state").css('display', 'none');   
            }else if((status === 'OPEN') && (availableBikes === 0)) {
                $('#infos_station li p').css('color','#8d8d8b');
                $("#btn-reserve").css('display', 'none');
                $("#state").css('display', 'block');
            }else {
                $('#infos_station li p').css('color','#ff0000');
                $("#btn-reserve").css('display', 'none');
                $("#state").css('display', 'block');
            }
                 
            });
            
            
            
            markers.push(marker);
            
            
            
      })
      
      
      
        // regroupement des markers.

        var markerCluster = new MarkerClusterer(map, markers, {imagePath: 'assets/img/marqueurs/m'});
      
      
              
        
    });

    
// CLIC SUR BOUTON "RESERVEZ ICI"
    
    $('#btn_reservation').click(function () {
        $('#map').css('display', 'none');
        $('#signature').css('display', 'flex');
        $('#btn_reservation').css('display', 'none');
        $('#annulation').css('display', 'block');
        
        var infosStation = JSON.parse(sessionStorage.getItem("datas"));
        document.getElementById('available_bikes').textContent = infosStation.availableBikes;
        document.getElementById('name').textContent = infosStation.name;
        clearInfos();
        $('#session_storage').html("");
        var str = "LA DERNIÈRE RÉSERVATION DE VOTRE VÉLO À LA STATION " + infosStation.name + " VA ÊTRE ANNULÉE, CONFIMRMER L'ANNULATION DE VOTRE RÉSERVATION EN CLIQUANT SUR LE BOUTON 'ANNULER ICI'";
        $('#session_storage').html(str);
        $('#session_storage').css('color', 'aqua');
        $('#countdown').css('color', 'aqua');
    });
    
// CLIC SUR BOUTON "ANNULER"
    
    $('#annulation').click(function () {
        
        stopTimer();
        
        $('#countdown').css('display', 'none');
        
        $('#session_storage').html("LA RÉSERVATION DE VOTRE VÉLO À LA STATION " + $('#name').text() + " EST ANNULÉE");
        $('#map').css('display', 'block');
        $('#signature').css('display', 'none');
        $('#btn_reservation').css('display', 'block');
        $('#btn_validation').css('display', 'none');
        $('#annulation').css('display', 'none');
        $('#filter').css('background-color', 'transparent');
        $('footer').css('background-color', 'fuchsia');
        $('#logo_footer').css('display', 'none');
        Canvas.effacerSignature(Canvas.canvas, Canvas.ctx);
        
        var infosStation = 
         JSON.parse(sessionStorage.getItem("datas"));
        document.getElementById('available_bikes').textContent = infosStation.availableBikes;
        
        clearInfos();
        $('#session_storage').html("");
        var str = "LA RÉSERVATION DE VOTRE VÉLO À LA STATION " + $('#name').text() + " EST ANNULÉE";
        $('#session_storage').html(str);
        $('#session_storage').css('color', 'aqua');
        $('#session_storage').html("LA RÉSERVATION DE VOTRE VÉLO À LA STATION " + $('#name').text() + " EST ANNULÉE");
    })

    
    
    
    
    
// DÉCLIC SUR LE CANVAS
    $('#canvas').mouseup(function () {
        $('#btn_validation').css('display', 'block');
    })
    
    document.getElementById("canvas").addEventListener('touchend', function () {
        document.getElementById("btn_validation").style.display = "block";
    })
    
    
// SAUVEGARDER LES INFOS DE LA STATION SÉLECTIONNÉE DANS LA SIDE BAR DE DROITE

    var onSauve = function() {
        var infosStation = {
            name: document.getElementById('name').textContent,
            address: document. getElementById('address').textContent,
            status: document.getElementById('status').textContent,
            bikeStands: document.getElementById('bike_stands').textContent,
            availableBikes: document.getElementById('available_bikes').textContent,
            availableBikeStands: document.getElementById('available_bike_stands').textContent
        };
        sessionStorage.setItem("datas", JSON.stringify(infosStation));
    }
    
// CLIC SUR BOUTON "CONFIRMER VOTRE RESERVATION"   
    
    
    $('#btn_validation').click(function() {
        
         onSauve();
        onRestore();
        
        $('#countdown').css('display', 'block');
        
        $('#session_storage').html("");
        var str ="1 VÉLO RÉSERVÉ À LA STATION " +  $('#name').text() + " PENDANT: ";
        $('#session_storage').html(str);
        $('#logo_footer').css('display', 'none');
        
        init(); // METTRE UN TERNAIRE POUR UN SEUL CLIC. 
        
        $('#btn_validation').css('display','none'); // 1 seul clic sur le bouton "confirmer"
    })
    
    
    
// AU RAFRAÎCHISSEMENT DE LA PAGE WEB   
    
  var onRestore = function () {
      
      
      
        var infosStation = JSON.parse(sessionStorage.getItem("datas"));
      
        if (infosStation != null) {
        
            document.getElementById('name').textContent = infosStation.name;
            $('#name').css('color', '#85ab10');
        
            document. getElementById('address').textContent = infosStation.address;
            $('#address').css('color', '#85ab10');
        
            document.getElementById('status').textContent = infosStation.status;
            $('#status').css('color', '#85ab10');
        
            document.getElementById('bike_stands').textContent = infosStation.bikeStands;
            $('#bike_stands').css('color', '#85ab10');
        
            document.getElementById('available_bikes').textContent = infosStation.availableBikes - 1;
            $('#available_bikes').css('color', '#85ab10');
        
            document.getElementById('available_bike_stands').textContent = infosStation.availableBikeStands;
            $('#available_bike_stands').css('color', '#85ab10');
        
            document.getElementById('session_storage').textContent = "1 VÉLO RÉSERVÉ À LA STATION " + infosStation.name + " PENDANT: ";
        
            sessionStorageTimer();
        }
    }
    
    onRestore();

    
    
    // vide la session storage du navigateur concernant les infos de la station Vélib‘:
    var clearInfos = function() {
        
        sessionStorage.clear();
        
        $('#session_storage').html("");
    }
       
    
}

    
   




