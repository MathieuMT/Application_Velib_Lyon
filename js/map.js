// on définit la class Createmap
class Createmap {
    constructor() {
        /* lors de l'instenciation, on appel les méthodes initMap et reservation */    
        this.initMap();
        this.reservation();
    }

    initMap() {

        "use strict";

        /* on instancie l'objet map de la classe google.maps. */
        let map = new google.maps.Map(document.getElementById("map"), {
            center: {lat: 45.750000, lng: 4.850000},
            zoom: 12
        });

        /* chargez les données codées JSON à partir du serveur à l'aide d'une requête HTTPS GET 
        dans PANNEAU d'INFOS de l'API JCDecaux sur les stations de vélos en location dans la ville de Lyon */
        $.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=65e29120ccd2a3ccf250c42bea4945f65e2525a0", function (reponse) {
        
            /* on définit le tableau Marker vide pour les futurs marqueurs */
            let markers = [];
        
            /* on dédini l'objet iconsMarker pour les marqueurs représentant les stations de vélos 
            ouvertes avec vélos, ouvertes sans vélos disponibles et fermés */
            let iconsMarker = {
                open: 'assets/img/marqueurs/open.png',
                noBike: 'assets/img/marqueurs/no_bike.png',
                close: 'assets/img/marqueurs/closed.png'
            }
        
            /* on récupère les informations, les détails de l'état (les données clé = valeur) pour chaque station de vélo sur l'API JCDecaux */
            $.each(reponse, function(key, station) {
            
                /* on définit chaque variable d'information de chaque station de vélo */
                let name = station.name;
                let address = station.address;
                let positionLat = station.position.lat;
                let positionLng = station.position.lng; 
                let status = station.status;
                let lastUpdate = new Date(station.last_update);
                let bikeStands = station.bike_stands;
                let availableBikes = station.available_bikes;
                let availableBikeStands = station.available_bike_stands;
            
                /* on definit la variables coords contenant les coordonnées géographique pour chaque station de vélo sur la carte avec l'API google.maps */
                let coords = new google.maps.LatLng(positionLat, positionLng);
            
                // on définit l'objet markerOptions pour les options de chaque marqueur représentant une station de vélo sur la carte */
                let markerOptions = {
                    position :coords,
                    title:"Station VÉLO’V: " + name,
                    animation: google.maps.Animation.DROP,
                    map:map
                };
            
                /* conditions en fonction des status de la station et si des vélos sont disponibles à la station de vélo 
                pour savoir quel marqueur indiquer : station ouverte avec vélos, ouverte sans vélos disponibles ou fermée */
                if((status === 'OPEN') && (availableBikes > 0)) {
                    markerOptions.icon = iconsMarker.open;
                }else if((status === 'OPEN') && (availableBikes === 0)) {
                    markerOptions.icon = iconsMarker.noBike;
                }else {
                    markerOptions.icon = iconsMarker.close;
                }

                /* on instancie l'objet marker de la class google.maps.Marker avec ses options (markerOption) définie plus haut */
                let marker = new google.maps.Marker(markerOptions);

                // LORSQU'ON CLIC SUR UN MARQUEUR SUR LA CARTE:
                marker.addListener('click', function() {
                    
                    /* on redimensionne la carte au clic sur un marqueur */
                    $('#map').attr('class', 'col-sm-7 col-xs-12');  
                
                    // pour les écrans inférieur à 576px 
                    if ($(window).width() <= 576) {  
                        $('#map').css('height', '670px');
                        $('#map').css('max-height', 'auto');
                        $("#infos_station").css('display', 'flex');
                        /* pour défiler vers le bouton de réservation */
                        window.location.href = "#btn_reservation";
                    }
                    // pour les écran supérieur à 576px
                    else if($(window).width() > 576)  {
                        $('#map').css('min-height', '670px');
                        $('#map').css('height', 'auto');
                        $("#infos_station").css('display', 'flex');
                        /* pour défiler vers le bouton de réservation */
                        window.location.href = "#btn_reservation";
                    } 

                    /* on récupère les informations de chaque station dans les champs du bloc d'informations de la station sélectionnée sur la carte */
                    $('#name').text(name);
                    $('#address').text(address);
                    $('#status').text(status);
                    $('#bike_stands').text(bikeStands);
                    $('#available_bikes').text(availableBikes);
                    $('#available_bike_stands').text(availableBikes);

                    /* style appliqué en fonction du clic sur les marqueurs des stations si elles sont ouvertes avec des vélos disponibles, ouvertes sans vélos disponibles ou fermées */
                    if((status === 'OPEN') && (availableBikes > 0)) {
                        $('#infos_station li p').css('color','#00b150');
                        $('#infos_station li p').css('text-shadow','0.09em 0.1em 0.09em #0a1c1e');
                        $("#btn_reservation").css('display', 'block');
                        $('#notification').html("");
                    }else if((status === 'OPEN') && (availableBikes === 0)) {
                        $('#infos_station li p').css('color','#959595');
                        $("#btn_reservation").css('display', 'none');
                    }else {
                        $('#infos_station li p').css('color','#fe0000');
                        $("#btn_reservation").css('display', 'none');
                    }
                    
/******************************************** SÉCURITÉ POUR ÉVITER PLUSIEURS RÉSERVATION EN MÊME TEMPS *********************************************/
                    
                    
                    /* si on clique sur un autre marqueur pendant une réservation en cours, 
                    on rend la carte inactive pour ne pas cumuler plusieurs réservation en même temps, 
                    en gardant les informations de notre résevation en cours, 
                    car après avoir cliquer sur le bouton "Réservez ici" on stocke en mémoire les informations 
                    grace à l'API webStorage qu'on récupère dans l'affichage dans la div#resultats */
                    /*-----sessionStorage-----*/
                    let infosStation = 
                    JSON.parse(sessionStorage.getItem("datas"));

                    if (infosStation != null) {
                        document.getElementById('name').textContent = infosStation.name;
                        document.getElementById('address').textContent = infosStation.address;
                        document.getElementById('status').textContent = infosStation.status;
                        document.getElementById('bike_stands').textContent = infosStation.bikeStands;
                        document.getElementById('available_bikes').textContent = infosStation.availableBikes - 1;
                        document.getElementById('available_bike_stands').textContent = infosStation.availableBikeStands;
                       
                        /*-----localStorage-----*/
                        /* on recupère les informations du nom et prénom en localStorage dans la mémoire du navigateur 
                        même après avoir fermé le navigateur dans les champs nom et prénom */
                        let nom = JSON.parse(localStorage.getItem("nom"));
                        document.getElementById('nom').value = nom;

                        let prenom = JSON.parse(localStorage.getItem("prenom"));
                        document.getElementById('prenom').value = prenom;
                        /*---------------------*/
                        
                        $("#btn_reservation").css('display', 'none');
                        $('#infos_station li p').css('color','#00b150');

                        document.getElementById('notification').textContent = "1 vélo’v réservé par " + prenom + " " + nom + " à la station " + infosStation.name + " pendant: ";
                    }
/***************************************************************************************************************************************************/
                       
                });
            
                // on ajoute nos objets marker au tableau vide markers
                markers.push(marker);
            })

            // regroupement des markers dans des markerCluster sur la carte.
            let markerCluster = new MarkerClusterer(map, markers, {imagePath: 'assets/img/marqueurs/m'});
        });


/******************************************** ACTIONS LORS D'UNE RÉSERVATION ********************************************/  
        
        /* methode qui vide la session storage du navigateur concernant les infos de la station Vélo‘v: */
        let clearInfos = function() {
            /*-----néttoyage de la sessionStorage-----*/
            /* on recharge la page */
            window.location.reload();
            sessionStorage.clear();
            $('#notification').html("");
        }   

        // LORS DU CLIC SUR BOUTON "Réservez ici"
        $('#btn_reservation').click(function () {
            /*-----localStorage-----*/
            /* on sauvegarde les nom et prénom dans le navigateur */
            let nom = document.getElementById('nom').value;
            localStorage.setItem("nom", JSON.stringify(nom));
            let prenom = document.getElementById('prenom').value;
            localStorage.setItem("prenom", JSON.stringify(prenom));
            /*----------------------*/
            // Si les champs de texte nom et prénom sont vides:
            if (document.getElementById('nom').value === "" || document.getElementById('prenom').value === "") {
                
                /* alerter qu'il faut remplir les nom et prenom dans les champs de text */
                $('.modal').css('display', 'inline-block');
                $('#btn_reservation').css('display', 'none'); 
        
                /* fermer la popup d'alerte */
                // au clic sur la croix:
                $('.close').click(function () {
                    $('.modal').css('display', 'none'); 
                    $('#btn_reservation').css('display', 'block'); 
                });     
            } 
            /* Si non (champs de texte nom et prénom remplis), alors on execute ceci au clic sur le bouton "RESERVEZ ICI": */
            else {
                $('#btn_reservation').css('display', 'none');   
                $('#signature').css('display', 'flex');
                
                $('#btn_validation').css('display', 'none');
                $('#btn_effacer').css('display', 'none');
                
                /* fermer la popup de signature avec la croix */
                $('.close_canvas').click(function () {
                    $('#signature').css('display', 'none');
                    $('#btn_reservation').css('display', 'block');
                });
                
                /* DÉCLIC SUR LE CANVAS POUR FAIRE APPARAITRE LES BOUTONS "Confirmation" ET "Effacer" SUR LA POPUP DU CANVAS */
                /* avec la souris après avoir dessiné */
                $('#canvas').mouseup(function () {
                    $('#btn_validation').css('display', 'block');
                    $('#btn_effacer').css('display', 'block');
                    $('#btn_effacer').click(function () {
                        $('#btn_validation').css('display', 'none');
                    })
                    
                    $('#btn_validation').click(function () {
                        $('#signature').css('display', 'none');
                    });
                });
                /* sur écran tactil après avoir dessiné */
                $('#canvas').on('touchend click',function () {
                    $('#btn_validation').css('display', 'block');
                    $('#btn_effacer').css('display', 'block'); 
                    $('#btn_effacer').click(function () {
                        $('#btn_validation').css('display', 'none');
                    })
                    
                    $('#btn_validation').click(function () {
                        $('#signature').css('display', 'none');
                    });
                });
                
                /* on recupère les informations de la station de vélo en sessionStorage dans la mémoire du navigateur lors d'une session */
                /*-----sessionStorage-----*/
                let infosStation = 
                JSON.parse(sessionStorage.getItem("datas"));
                /*------------------------*/
                if (infosStation != null) {
                    document.getElementById('name').textContent = infosStation.name;
                    document.getElementById('address').textContent = infosStation.address;
                    document.getElementById('status').textContent = infosStation.status;
                    document.getElementById('bike_stands').textContent = infosStation.bikeStands;
                    document.getElementById('available_bikes').textContent = infosStation.availableBikes - 1;
                    document.getElementById('available_bike_stands').textContent = infosStation.availableBikeStands;
                }
                /*-----localStorage-----*/
                /* on recupère les informations du nom et prénom en localStorage dans la mémoire du navigateur même après une session */
                let nom = JSON.parse(localStorage.getItem("nom"));
                document.getElementById('nom').value = nom;

                let prenom = JSON.parse(localStorage.getItem("prenom"));
                document.getElementById('prenom').value = prenom;
                /*----------------------*/
                $('#notification').html("");
            }  
        });
        
        // LORS DU CLIC SUR BOUTON "Annulez ici"
        $('#annulation').click(function () {
                $('#countdown').css('display', 'none');
                $('#annulation').css('display', 'none');
                $('#btn_validation').css('display', 'none');
                clearInfos();
        })

        // POPUP D'EXPIRATION: si on clic sur la croix ou le bouton "Faites une nouvelle réservation"
        $('.close_expiration').click(function () {
            clearInfos();
        })
        
        $('#btnNouvelleReservation').click(function () {
            clearInfos();
        })

        /* METHODE QUI SAUVEGARDE DANS LA MÉMOIRE DU NAVIGATEUR EN sessionStorage LORS D'UNE SESSION, 
        LES INFOS DE LA STATION SÉLECTIONNÉE DANS LE BLOC DES INFORMATIONS DE LA STATION SÉLECTIONNÉE */
        let onSauve = function() {
            let infosStation = {
                name: document.getElementById('name').textContent,
                address: document. getElementById('address').textContent,
                status: document.getElementById('status').textContent,
                bikeStands: document.getElementById('bike_stands').textContent,
                availableBikes: document.getElementById('available_bikes').textContent,
                availableBikeStands: document.getElementById('available_bike_stands').textContent
            };
            /*-----sessionStorage-----*/
            sessionStorage.setItem("datas", JSON.stringify(infosStation));
            /*------------------------*/
        }

        // METHODE QUI RESTORE LES DONNÉES EN MÉMOIRE LORS DU RAFRAÎCHISSEMENT DE LA PAGE WEB   
        let onRestore = function () {
            
            /* on recupère les informations de la station de vélo en sessionStorage dans la mémoire du navigateur lors d'une session */
            /*-----sessionStorage-----*/
            let infosStation = JSON.parse(sessionStorage.getItem("datas"));
            /*------------------------*/
            
            /*-----localStorage-----*/
            /* on recupère les informations du nom et prénom en localStorage dans la mémoire du navigateur même après une session */
            let nom = JSON.parse(localStorage.getItem("nom"));
            let prenom = JSON.parse(localStorage.getItem("prenom"));
            /*----------------------*/
            
            /* si les champs du bloc d'informations de la station séléctionnées ne sont pas vides alors, on fait ceci :*/
            if (infosStation != null) {
                /* redimensionner la carte au clic sur un marqueur */
                $('#map').attr('class', 'col-sm-7 col-xs-12');  
                
                // pour les écrans inférieur à 576px 
                if ($(window).width() <= 576) {  
                    $('#map').css('height', '670px');
                    $('#map').css('max-height', 'auto');
                    $("#infos_station").css('display', 'flex');
                }
                // pour les écrans supérieur à 576px 
                else if($(window).width() > 576)  {
                    $('#map').css('min-height', '670px');
                    $('#map').css('height', 'auto');
                    $("#infos_station").css('display', 'flex');   
                } 

                $("#btn_reservation").css('display', 'none');
                $('#annulation').css('display', 'block');
                
                $('#annulation').click(function (){
                    $("#btn_reservation").css('display', 'block');
                    $('#annulation').css('display', 'none'); 
                } ); 
                
                $('#resultats').css('display','flex');
                
                document.getElementById('name').textContent = infosStation.name;
                $('#name').css('color', '#00b150');
                $('#name').css('text-shadow','0.09em 0.1em 0.09em #0a1c1e');

                document. getElementById('address').textContent = infosStation.address;
                $('#address').css('color', '#00b150');
                $('#address').css('text-shadow','0.09em 0.1em 0.09em #0a1c1e');

                document.getElementById('status').textContent = infosStation.status;
                $('#status').css('color', '#00b150');
                $('#status').css('text-shadow','0.09em 0.1em 0.09em #0a1c1e');

                document.getElementById('bike_stands').textContent = infosStation.bikeStands;
                $('#bike_stands').css('color', '#00b150');
                $('#bike_stands').css('text-shadow','0.09em 0.1em 0.09em #0a1c1e');

                document.getElementById('available_bikes').textContent = infosStation.availableBikes - 1;
                $('#available_bikes').css('color', '#00b150');
                $('#available_bikes').css('text-shadow','0.09em 0.1em 0.09em #0a1c1e');

                document.getElementById('available_bike_stands').textContent = infosStation.availableBikeStands;
                $('#available_bike_stands').css('color', '#00b150');
                $('#available_bike_stands').css('text-shadow','0.09em 0.1em 0.09em #0a1c1e');
                
                /*---localStorage---*/
                /* on recupère les informations du nom et prénom en localStorage dans la mémoire du navigateur 
                même après une session dans les champs texte nom et prénom */
                document.getElementById('nom').value = nom;
                document.getElementById('prenom').value = prenom;
               /*-------------------*/
                
                document.getElementById('notification').textContent = "1 vélo’v réservé par " + prenom + " " + nom +  " à la station " + infosStation.name + " pendant: ";

                $('#annulation').click(function (){
                    $('#countdown').css('display', 'none');
                    clearInfos(); /* on vide les données d'informations de la station sauvegardés en sessioStorage */
                    $('#btn_reservation').css('display', 'block');
                }); 
            }
            // Si non on fait cela:
            else  {
                /*---localStorage---*/
                /* pour que le nom et le prénom soient conservés dans les inputs type texte 
                même si on ferme le navigateur grace à localStorage */
                let nom = JSON.parse(localStorage.getItem("nom"));
                let prenom = JSON.parse(localStorage.getItem("prenom"));

                document.getElementById('nom').value = nom;
                document.getElementById('prenom').value = prenom;
                /*-------------------*/
                
            }
 
        }
        
        //LORS DU CLIC SUR BOUTON "CONFIRMATION"   
        $('#btn_validation').click(function() {
            
            /* appel de la methode qui sauvegarde les données de la sation avec sessionStorage */
            onSauve();
            
            /* appel de la methode qui conserve les données dans la mémoire du navigateur au rafraichissement de la page web */
            onRestore();

            $('#resultats').css('display','flex');
            $('#countdown').css('display', 'block');
            $('#annulation').css('display', 'block');
            $('#btn_reservation').css('display', 'none');
            $('#notification').html("");
            let str ="1 vélo’v réservé par " + $('#prenom').val() + " " + $('#nom').val() + " à la station " +  $('#name').text() + " pendant: ";
            $('#notification').html(str);
        })
       
        // LORSQU'ON RAFRAICHIT LA PAGE WEB:
        /* appel de la méthode qui conserve les données dans la mémoire du navigateur au rafraichissement de la page web */
        onRestore();
    }

    /* méthode pour faire scroller vers la zone de réservation sur la carte */
    reservation() {
        $("#versReservation").on("click", () => {
            if(screen.width < 576){
                $(document).ready(() => {
                    window.scrollTo(0, 1600);
                });
            }
            else if(screen.width < 812){
                $(document).ready(() => {
                    window.scrollTo(0, 1400);
                });
            }
            else if(screen.width < 1024){
                $(document).ready(() => {
                    window.scrollTo(0, 670);
                });
            }
            else
                $(document).ready(() => {
                    window.scrollTo(0, 820);
                });
        });
    }
   
}

/* on instencie la constante mapObj au chargement de la page à partir de la class Createmap: */
window.onload = function () {
    'use strict'; 
    const mapObj = new Createmap;
}; 

