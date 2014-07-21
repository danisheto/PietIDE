var canvasCtrl={
	canvas:document.getElementById("canvas"),
	context:canvas.getContext("2d"),
	canvasZoom:1,
	columnSize:20,
	columns:14,
	rows:10,
};
var colorCtrl={
	color:"#000000",
	colorsId:{
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
	colorsValue:{},
	init:function(){
		for(var key in this.colorsId){
			colorsValue[colorsId[key]]=key;
		}
	}
}
colorCtrl.init();
console.log(colorCtrl.colorsValue)