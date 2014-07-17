window.onload=function(){
	var canvas=document.getElementById('canvas'),
		context=canvas.getContext("2d"),
		canvasSize=200,
		canvasZoom=1,
		columnSize=20,
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
		colorName="Black";
	for(var key in colorsId){
		colorsValue[colorsId[key]]=key;
	}
	drawInit();
	function drawInit(){
		context.lineWidth=1;
		context.beginPath();
		for(var i=0;i<canvasSize;i+=columnSize){
			var p=(i*canvasZoom)+0.5;
			context.moveTo(p,0);
			context.lineTo(p,canvasSize);
			context.moveTo(0,p);
			context.lineTo(canvasSize,p);
		}
		context.stroke();
	}
	canvas.onmousedown=function(e){
		var textRect=canvas.getBoundingClientRect();
		var position=[
			e.pageX-textRect.left-2,
			e.pageY-textRect.top-2
		]
		if(position[0]>=0 && position[1]>=0){
			var square=[
				Math.floor(position[0]/20),
				Math.floor(position[1]/20)
			]
			//check if color was last one set there-prevent hundreds of the same color being stack upon each other
			context.beginPath();
			context.lineWidth=1;
			context.rect(square[0]*20+0.5,square[1]*20+0.5,20,20);
			context.fillStyle=color;
			context.fill();
			context.stroke();
		}
	}
	document.getElementById("colors").onmousedown=function(e){
		color=window.getComputedStyle(e.target).getPropertyValue("background-color");
		colorName=e.target.id;
		var active=document.getElementsByClassName("active")[0];
		active.className="active";
		active.style.backgroundColor=color;
		active.classList.add(colorName);
	}
	document.getElementById("secondary").onmousedown=function(e){
		colorName=e.target.classList[0];
		e.target.classList.add("active");
		document.getElementById("primary").classList.remove("active");
		color=window.getComputedStyle(e.target).getPropertyValue("background-color");
	}
	document.getElementById("primary").onmousedown=function(e){
		colorName=e.target.classList[0];
		e.target.classList.add("active");
		document.getElementById("secondary").classList.remove("active");
		color=window.getComputedStyle(e.target).getPropertyValue("background-color");
	}
	document.getElementById("commands").onmousedown=function(e){
		if(colorName!="Black" && colorName!="W"){
			command=e.target.id.substring(e.target.id.length-2).split("");
			currentColorVal=[];
			function findHue(colorName){
				switch(colorName){
					case "R":
						currentColorVal=[0];
					break;
					case "Y":
						currentColorVal=[1];
					break;
					case "G":
						currentColorVal=[2];
					break;
					case "C":
						currentColorVal=[3];
					break;
					case "Blue":
						currentColorVal=[4];
					break;
					case "B":
						currentColorVal=[4];
					break;
					case "M":
						currentColorVal=[5];
					break;
					default:
						alert("Please report issue at https://github.com/danisheto/PietIDE");
					break;
				}
			}
			if(colorName.length<2 || colorName=="Blue"){
				findHue(colorName);
				currentColorVal[1]=1;
			}else{
				findHue(colorName.substring(1));
				if(colorName.substring(0,1)=="L"){
					currentColorVal[1]=0;
				}else{
					currentColorVal[1]=2;
				}
			}
			currentColorVal[0]+=command[0];
			currentColorVal[1]+=command[1];
			currentColorVal[0]%=3;
			currentColorVal[1]%=3;
			colorName=colorsValue[currentColorVal];
			color=window.getComputedStyle(document.getElementById(colorName)).getPropertyValue("background-color");
			document.getElementsByClassName("active")[0].style.backgroundColor=color;
		}
	}
}