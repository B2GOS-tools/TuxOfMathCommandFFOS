/* Initialisation requestAnimationFrame */
var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

/* Cr�ation du canvas */
var canvas = document.createElement("canvas");
canvas.id = "game";
canvas.width = 1000;
canvas.height = 600;

/* Cr�ation du contexte */
var ctx = canvas.getContext("2d");

/* Ajout du canvas au document HTML */
document.body.appendChild(canvas);

/* Gestion du timer d'apparition des com�tes */
var currentTimestamp = Date.now();
var previousTimestamp = 0;
var elapsedTime = 0;

/* Gestion du timer du mouvement des com�tes */
var currentTimestamp2 = Date.now();
var previousTimestamp2 = 0;
var elapsedTime2 = 0;

/* Tableau pour stocker les com�tes */
var aListComete = [];

/* Tableau pour stocker les igloos */
var aListIgloo = [];

/* D�finition des colonnes o� apparaissent les com�tes */
var colonneX1 = 150;
var colonneX2 = 350;
var colonneX3 = 550;
var colonneX4 = 750;

/* Tableau pour stocker la position des colonnes */
var aListColonneX = [colonneX1, colonneX2, colonneX3, colonneX4];

var GAME_SPEED = 0.5;
var GAME_ENDLINE_HEIGHT = 360;

for (var i=0;i<4;i++) {

	var oIglooImage = new Image();
	oIglooImage.src = "resources/igloos/intact.png";
	//oIglooImage.onload = function () {
		var oIgloo = new Igloo(oIglooImage, aListColonneX[i] - 15, 500);
		aListIgloo.push(oIgloo);
	//}
}

/* Fonction Step */
var step = function () {

	/* R�initialisation de l'affichage */
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	/* Remplissage du canvas */
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
	
	addIgloo();
	addComete();
}

/* Fonction addIgloo */
var addIgloo = function() {
	
	for(var i=0; i<aListIgloo.length; i++) {
		ctx.drawImage(aListIgloo[i]._img, aListIgloo[i]._x, aListIgloo[i]._y);
	}
}
/* Fonction addComete */
var addComete = function() {

	/* Mise � jour de l'intervalle d'apparition des com�tes */
	previousTimestamp = currentTimestamp;
	currentTimestamp = Date.now();
	elapsedTime += currentTimestamp - previousTimestamp;
	
	/* 5000 = 5 secondes */
	if (elapsedTime >= 5000) {
		
		var oCometeImage = new Image();
		oCometeImage.src = "resources/comets/comet0.png";
		
		/* Cr�ation d'une nouvelle com�te et ajout au tableau */
		var oComete = new Comete(oCometeImage, aListColonneX[Math.floor(Math.random() * 4)], 0);
		aListComete.push(oComete);
		
		ctx.drawImage(oComete._img, oComete._x, oComete._y);

		elapsedTime = 0;
	}
	
	for(var i=0;i<aListComete.length;i++) {
		
		/* Mise � jour de l'intervalle du mouvement des com�tes descendantes */
		previousTimestamp2 = currentTimestamp2;
		currentTimestamp2 = Date.now();
		elapsedTime2 += currentTimestamp2 - previousTimestamp2;
		
		/* 100 = 0.1 secondes */
		if (elapsedTime2 >= 100) {
		
			/* Principe de fonctionnement, pour chacune des com�tes :
				- Si comet0 alors comet1
				- Si comet1 alors comet2
				- Si comet2 alors comet0
			   Et ainsi de suite ... cela permet d'avoir l'illusion de mouvement pour chacune des com�tes
			*/
			for(var j=0;j<aListComete.length;j++) {
			
				if (aListComete[j]._img.src.indexOf("comet0.png") !== -1) {
					var oCometeImage = new Image();
					oCometeImage.src = "resources/comets/comet1.png";
					aListComete[j]._img = oCometeImage;
				}
				else if (aListComete[j]._img.src.indexOf("comet1.png") !== -1) {
					var oCometeImage = new Image();
					oCometeImage.src = "resources/comets/comet2.png";
					aListComete[j]._img = oCometeImage;
				}
				else {
					var oCometeImage = new Image();
					oCometeImage.src = "resources/comets/comet0.png";
					aListComete[j]._img = oCometeImage;
				}
			}
			
			elapsedTime2 = 0;	
		}
		
		
		if (aListComete[i]._y < GAME_ENDLINE_HEIGHT) {
			aListComete[i].descendre(GAME_SPEED);
			ctx.drawImage(aListComete[i]._img, aListComete[i]._x, aListComete[i]._y);
		}
		else {
		
			// TOFIX : Explosion de la com�te
			
			/*var oCometeImage = new Image();
			oCometeImage.src = "resources/comets/cometex0.png";
			aListComete[i]._img = oCometeImage;*/
			//ctx.drawImage(aListComete[i]._img, aListComete[i]._x, aListComete[i]._y);
			//ctx.drawImage(oCometeImage, aListComete[i]._x, aListComete[i]._y);
			
			
			for (var j=0;j<aListIgloo.length;j++) {
				
				/* R�ajustement de la position x des igloos avec celle des com�tes */
				var oIglooX = aListIgloo[j]._x + 15;
				
				/* D�s qu'on a trouv� l'igloo qui correspond � la com�te */
				if (oIglooX == aListComete[i]._x) {
					
					/* Principe de fonctionnement, � chaque fois qu'une com�te touche un igloo :
						- Si igloo intact alors il devient half
						- Si igloo half alors il devient melted1
						- Si igloo melted1 alors GAME OVER
					*/
					if (aListIgloo[j]._img.src.indexOf("intact.png") !== -1) {
					
						var oIglooImage = new Image();
						oIglooImage.src = "resources/igloos/half.png";	
						aListIgloo[j]._img = oIglooImage;
						
						ctx.drawImage(aListIgloo[j]._img, aListIgloo[j]._x, aListIgloo[j]._y);
					}
					else if (aListIgloo[j]._img.src.indexOf("half.png") !== -1) {
					
						var oIglooImage = new Image();
						oIglooImage.src = "resources/igloos/melted1.png";	
						aListIgloo[j]._img = oIglooImage;
						
						/* Repositionnement de la nouvelle image */
						aListIgloo[j]._x = aListIgloo[j]._x - 20;
						aListIgloo[j]._y = aListIgloo[j]._y + 38;
						
						
						ctx.drawImage(aListIgloo[j]._img, aListIgloo[j]._x, aListIgloo[j]._y);
					}
					else {
						// TODO : Il n'y a plus de vies => GAME OVER
					}
				}
			}
			
			/* Suppression de la com�te de l'array aListComete */
			aListComete.remove(i);
		}
		
		
	}
	
	
	
}
/* Fonction main */
var main = function () {
	step();
	requestAnimationFrame(main);
}

main();
//main(Date.now());
