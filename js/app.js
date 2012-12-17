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

var currentTimestamp = Date.now();
var previousTimestamp = 0;
var elapsedTime = 0;

/* Tableau pour stocker les com�tes */
var arrayComete = [];

/* Position des colonnes o� apparaissent les com�tes */
var arrayColonneX = [150, 350, 550, 750];

/* Fonction Step */
var step = function () {
	addComete();
}

/* Fonction addComete */
var addComete = function() {

	/* R�initialisation de l'affichage */
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	/* Remplissage du canvas */
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
		
	/* Mise � jour de l'intervalle d'apparition des com�tes */
	previousTimestamp = currentTimestamp;
	currentTimestamp = Date.now();
	elapsedTime += currentTimestamp - previousTimestamp;
		
	/* 3000 = 3 secondes */
	if (elapsedTime >= 3000) {
		
		/* Cr�ation d'une nouvelle com�te et ajout au tableau */
		var oComete = new Comete(arrayColonneX[Math.floor(Math.random() * 4)], 50, "rgb(255,255,255)");
		arrayComete.push(oComete);
		
		ctx.beginPath();
		ctx.fillStyle = oComete.rgb;
		ctx.arc(oComete.x, oComete.y, oComete.radius, oComete.startAngle, oComete.endAngle);
		ctx.fill();
		
		elapsedTime = 0;
	}
	
	for(var i=0;i<arrayComete.length;i++) {
		ctx.beginPath();
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.arc(arrayComete[i].x, arrayComete[i].y++*0.5, arrayComete[i].radius, arrayComete[i].startAngle, arrayComete[i].endAngle);
		ctx.fill();
	}
	
	
}
/* Fonction main */
var main = function () {
	step();
	requestAnimationFrame(main);
}

main();
//main(Date.now());
