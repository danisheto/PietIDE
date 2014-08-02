var Color=function(colorString){
	this.colorString=colorString;
}
var RGB=function(colorString){
	Color.call(this,colorString);
	this.rgb=colorString.slice(4,-1).replace(/ /g,"").split(",");
	this.toHex=function(){
		var hex="#";
		for(var i=0;i<this.rgb.length;i++){
			hex+=parseInt(this.rgb[i],10).toString(16)
			if(hex.length%2==0){
				hex=hex.replace(hex,hex.slice(0,-1)+"0"+hex.slice(-1));
			}
		};
		return hex
	}
}
var Hex=function(colorString){
	Color.call(this,colorString)
	this.hex=colorString;
	this.toRGB=function(){
		var rgb="rgb("
		for (var i = 1; i < this.hex.length; i+=2) {
			rgb+=parseInt(this.hex.slice(i,i+2),16)+",";
		};
		rgb=rgb.slice(0,-1)+")"
		return new RGB(rgb);
	}
}