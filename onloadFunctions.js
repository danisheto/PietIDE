var canvas=document.getElementById('canvas'),
	context=canvas.getContext("2d"),
	canvasZoom=2,
	columnSize=20,
	columns=40,
	rows=40,
	color="#000000",
	colorsId={
		"LR":[0,0],
		"R"	:[0,1],
		"DR":[0,2],
		"LY":[1,0],
		"Y"	:[1,1],
		"DY":[1,2],
		"LG":[2,0],
		"G"	:[2,1],
		"DG":[2,2],
		"LC":[3,0],
		"C"	:[3,1],
		"DC":[3,2],
		"LB":[4,0],
		"B"	:[4,1],
		"DB":[4,2],
		"LM":[5,0],
		"M"	:[5,1],
		"DM":[5,2]
	},
	colorsValue={},
	hues=["R","Y","G","C","B","M"];
	Lightnesses=["L","","D"]
	colorName="Black",
	colorSpaces=[],
	tool="brush",
	canvasCursorOffset=[],
	canvasOffset=[0,0],
	tab=1;
for(var key in colorsId){
	colorsValue[colorsId[key]]=key;
}
window.onload=function(){
	var functions=[canvasFunc, sidebar];
	for(var i=0;i<functions.length;i++){
		functions[i].call();
	}
}