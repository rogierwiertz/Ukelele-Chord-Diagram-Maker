//Canvas
let canvas, ctx;
//Tweede canvas (offscreen)
let tempCanvas = document.createElement('canvas');
let tempCtx = tempCanvas.getContext('2d');


let dots = [];
let strings = [[100, ""], [100 + (200/3), ""], [100 + 2 * (200/3), ""], [100 + 3 * (200/3), ""]];

document.addEventListener('DOMContentLoaded', (ev)=>{
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	canvas.width = 400;
	canvas.height = 400;

	drawChordSymbol();
	ukeleleDiagram();

	document.getElementById('chord').addEventListener('input', drawChordSymbol);
	document.getElementById('fret').addEventListener('input', drawStartingFret);
	document.getElementById('clear').addEventListener('click', clear);
	document.getElementById('copy').addEventListener('click', copy);
	document.getElementById('png-download').addEventListener('click', download);
	canvas.addEventListener('mousedown', drawContent);	
});

//Teken het akkoordsymbool boven het fretboard
const drawChordSymbol = function(){
	//style
	let fontFamily = 'music, Roboto';
	ctx.font = `normal 40px ${fontFamily}, monospace`;
	ctx.fillStyle = "#111";
	ctx.textAlign = 'center';
	ctx.textBaseline = 'alphabetic';
	ctx.direction = 'ltr';

	//teken akkoordsymbool
	let txt = document.getElementById('chord').value;
	ctx.clearRect(0, 60, 400, -60);
	ctx.fillText(txt, 200, 50);	
}

//Teken het fretnummer naast het fretboard
const drawStartingFret = function(){
	let fontFamily = 'Roboto';
	ctx.font = `normal 30px ${fontFamily}, monospace`;
	ctx.fillStyle = "#111";
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.direction = 'ltr';

	let txt = document.getElementById('fret').value;

	if (txt == "0") {
		txt = "";
	}
	ctx.clearRect(30, 145, 50, -40);


	ctx.fillText(txt, 55, 131.25);	
}

//Teken het fretboard
const ukeleleDiagram = function(){
	//dikke lijn
	ctx.beginPath();
	ctx.lineCap = "round";
	ctx.lineWidth = 10;
	ctx.moveTo(100, 100);
	ctx.lineTo(300, 100);
	ctx.stroke();

	//snaren
	for(let i = 0; i < 4; i++){
		ctx.beginPath();
		ctx.lineCap = "square";
		ctx.lineWidth = 2;
		ctx.moveTo((100 + (i * (200 / 3))), 100);
		ctx.lineTo((100 + (i * (200 / 3))), 350);
		ctx.stroke();
	}

	//frets
	for(let i = 0; i < 4; i++){
		ctx.beginPath();
		ctx.lineCap = "square";
		ctx.lineWidth = 2;
		ctx.moveTo(100, 162.5 + (i * 62.5));
		ctx.lineTo(300, 162.5 + (i * 62.5));
		ctx.stroke();
	}	
}

//Teken content op de canvas gebaseerd op muisklik
const drawContent = function(ev){

	//style
	let fontFamily = 'Roboto';
		ctx.font = `normal 30px ${fontFamily}, monospace`;
		ctx.fillStyle = "#111";
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.direction = 'ltr';
	
	/***********************************************
		Voor gevulde cirkels op het fretboard
	************************************************/	
	if ((ev.offsetX > 90) && (ev.offsetX < 310) && (ev.offsetY > 90) && (ev.offsetY < 360) ) {
		
		//set x en y
		let x = getX(ev.offsetX);
		let y = getY(ev.offsetY);
		
		//Controleer of op dezelfde snaar al een cirkel is getekend.
		//Zo ja, verwijder deze cirkel en teken de nieuwe.
		//Indien er op de bestaande cirkel wordt geklikt: verwijder deze cirkel.
		for (let i = 0; i < dots.length; i++) {
			if (dots[i].includes(x) ) {
				let dot = dots[i];
				dots.splice(i, 1);
				redraw();
				if(dot.includes(y)){
					return;
				}
				
			}
		}			
		 
		 //Teken de cirkel met de huidige x en y coördinaten
		ctx.beginPath();
		ctx.arc(x, y, 20, 0, Math.PI * 2, false);
		ctx.fill();

		//Voeg x en y toe aan array met coordinaten
		dots.push([x,y]);	

		//Verwijder eventuele 0 of X boven de snaar 
		for (let i = 0; i < strings.length; i++) {
			if (strings[i].includes(x)) {
				strings[i][1] = "";
				break;
			}
		}

		ctx.clearRect(80, 90, 240, -40);
		

		strings.forEach( string => {
			txt = string[1];
			ctx.fillText(txt, string[0], 80);	
		});
	}

	/***********************************************
		Voor X / 0 / "" boven de snaren
	************************************************/	
	else if ((ev.offsetX > 90) && (ev.offsetX < 310) && (ev.offsetY > 60) && (ev.offsetY < 100) ) {
		
		//set x en y
		let x = getX(ev.offsetX);
		let y = 80;		

		//Toggle O, X en ""
		for (let i = 0; i < strings.length; i++) {
			if (strings[i].includes(x)) {
				switch(strings[i][1]){
					case "":
						strings[i][1] = 'O';
						break;
					case "O":
						strings[i][1] = "X";
						break;
					case "X":
						strings[i][1] = "";
						break;
				}
				break;
			}
		}

		//Verwijder en teken opnieuw
		ctx.clearRect(80, 90, 240, -40);

		strings.forEach( string => {
			txt = string[1];
			ctx.fillText(txt, string[0], y);	
		});

		//Haal eventuele cirkel weg op dezelfde snaar
		for (let i = 0; i < dots.length; i++) {
			if (dots[i].includes(x)) {
				dots.splice(i, 1);
				redraw();
				return;
			}
		}	
	}

}

//Teken het akkoorddiagram met de cirkels (bewaard in array) opnieuw
const redraw = function(){
		ctx.clearRect(80,90,310,360);
		ukeleleDiagram();

		dots.forEach(dot => {
			ctx.beginPath();
			ctx.arc(dot[0], dot[1], 20, 0, Math.PI * 2, false);
			ctx.fill();
		})
}

//Krijg de x-waarde gebaseerd op de muisklik
const getX = function(offsetX){
	if (offsetX >= 90 && offsetX < (100 + (200 / 3 * 0.5))) {
			x = 100;
		} 
		else if(offsetX >= (100 + (200 / 3 * 0.5)) && offsetX < (100 + (3 * (200 / 3 * 0.5)))) {
			x = 100 + (200 / 3);
		}
		else if(offsetX >= (100 + (3 * (200 / 3 * 0.5))) && offsetX < (100 + (5 * (200 / 3 * 0.5))) ) {
			x = 100 + 2 * (200 / 3);
		}
		else if(offsetX >= (100 + (5 * (200 / 3 * 0.5))) && offsetX < (100 + (7 * (200 / 3 * 0.5)))) {
			x = 100 + 3 * (200 / 3);
		}

		return x;
}

//Krijg de y-waarde gebaseerd op de muisklik
const getY = function(offsetY){
	if(offsetY > 90 && offsetY <= (162.5)) {
			y = 131.25;
		}
		else if(offsetY > 162.5 && offsetY <= (162.5 + 62.5)) {
			y = 162.5 + 31.25;
		}
		else if(offsetY > (162.5 + 62.5) && offsetY <= (162.5 + (2* 62.5))) {
			y = (162.5 + 62.5) + 31.25;
		} else if(offsetY > (162.5 + (2 * 62.5)) && offsetY <= (162.5 + (3 * 62.5))) {
			y = (162.5 + (2 * 62.5)) + 31.25;
		}

		return y;
}

//Terug naar beginwaarden
const clear = function(ev){
	ev.preventDefault();
	document.getElementById('chord').value = "";
	document.getElementById('fret').value = "";
	ctx.clearRect(0,0,400,400);
	ukeleleDiagram();
}


//Resize en transparantie
const format = function(){
	let radiobuttons = document.querySelectorAll('input[name="size"]');
	let size = 800;
	
	radiobuttons.forEach(input =>{
			if (input.checked === true) {
				size = input.value;
			}
	});

	tempCanvas.width = size;
	tempCanvas.height = size;
	
	tempCtx.drawImage(canvas, 0, 0, size, size);

	if(! document.getElementById('transparent').checked ) {
		tempCtx.globalCompositeOperation = "destination-over";
		tempCtx.fillStyle = '#FFF';
		tempCtx.fillRect(0,0,size,size);
	}

}

//Kopier canvas naar het klembord
const copy = function(ev){
	ev.preventDefault();
	
	format();	

	//Kopieren naar klembord
	tempCanvas.toBlob(function(blob){
		let item = new ClipboardItem({ "image/png": blob});
		navigator.clipboard.write([item]);
	}, "image/png", 1.0);
	
}

//Download de afbeelding als PNG bestand
const download = function(ev){
	ev.preventDefault();

	format();

	let a = document.createElement('a');
	a.href = tempCanvas.toDataURL("image/png", 1);
	
	let filename = "ukelele-chord-";
	let chordname = document.getElementById('chord').value;
	
	const regex = RegExp('[^A-Ga-gm#.0-9]');

	if(chordname !== "" && regex.test(chordname) === false){	
		filename += chordname + ".png";		
	} else {
		filename += "unknown.png";
	}
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

