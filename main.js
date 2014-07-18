window.onload=function(){
	var canvas=document.getElementById('canvas'),
		context=canvas.getContext("2d"),
		canvasZoom=1,
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
	drawInit();
	function drawInit(){
		canvas.width=columnSize*columns*canvasZoom;
		canvas.style.width=columnSize*columns*canvasZoom;
		canvas.height=columnSize*rows*canvasZoom;
		canvas.style.height=columnSize*rows*canvasZoom;
		context.lineWidth=1;
		context.beginPath();
		for(var i=0;i<columns;i++){
			var p=(i*columnSize*canvasZoom)+0.5;
			context.moveTo(p,0);
			context.lineTo(p,rows*columnSize*canvasZoom);
			colorSpaces[i]=[];
		}
		for(var i=0;i<rows;i++){
			var p=(i*columnSize*canvasZoom)+0.5;
			context.moveTo(0,p);
			context.lineTo(columns*columnSize*canvasZoom,p)
			for(var j=0;j<columns;j++){
				colorSpaces[j][i]="";
			}
		}
		context.stroke();
	}
	canvas.onmousedown=function(e){
		var textRect=canvas.getBoundingClientRect();
		var position=[
			e.pageX-textRect.left-2,
			e.pageY-textRect.top-2
		]
		var square=[
			Math.floor(position[0]/20),
			Math.floor(position[1]/20)
		]
		switch(tool){
			case "brush":
				if(position[0]>=0 && position[1]>=0 && colorSpaces[square[0]][square[1]]!=colorName){
					colorSpaces[square[0]][square[1]]=colorName;
					context.beginPath();
					context.lineWidth=1;
					context.rect(square[0]*20+0.5,square[1]*20+0.5,20,20);
					context.fillStyle=color;
					context.fill();
					context.stroke();
				}
			break;
			case "bucket":
				
			break;
			case "eyedropper":
				if(colorSpaces[square[0]][square[1]]!=""){
					colorName=colorSpaces[square[0]][square[1]];
					color=window.getComputedStyle(document.getElementById(colorName)).getPropertyValue("background-color");
					document.getElementById("")

				}
			break;
			case "panning":
				canvasCursorOffset=[e.pageX,e.pageY];
			break;
			case "zoom_in":
				
			break;
			case "zoom_out":
				
			break;
			case "play":
				
			break;
			case "step":
				
			break;
			case "stop":
				
			break;
		}
	}
	canvas.onmousemove=function(e){
		if(tool=="panning" && !!canvasCursorOffset[0]){
			canvas.style.left=(e.pageX-canvasCursorOffset[0]+canvasOffset[0])+"px";
			canvas.style.top=(e.pageY-canvasCursorOffset[1]+canvasOffset[1])+"px";
		}
	}
	canvas.onmouseup=function(e){
		if(tool=="panning" && !!canvasCursorOffset[0]){
			canvasOffset=[parseInt(canvas.style.left.substring(0,canvas.style.left.length-2)),parseInt(canvas.style.top.substring(0,canvas.style.top.length-2))];
			canvasCursorOffset=[];
		}
	}
	document.getElementById("colors").onmousedown=function(e){
		color=window.getComputedStyle(e.target).getPropertyValue("background-color");
		colorName=e.target.id;
		var active=document.getElementById("colorPalette").getElementsByClassName("active")[0];
		active.className="active";
		active.style.backgroundColor=color;
		active.classList.add(colorName);
	}
	//primary and secondary switching
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
	//functionality for commands table
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
			document.getElementById("colorPalette").getElementsByClassName("active")[0].style.backgroundColor=color;
		}
	}
	//sidebar tabs
	document.getElementById("colorsTab").onmousedown=function(e){
		document.getElementById("colorsTabContent").classList.add("active");
		document.getElementById("fileTabContent").classList.remove("active");
		document.getElementById("debugTabContent").classList.remove("active");
		document.getElementById("colorsTab").classList.add("active");
		document.getElementById("fileTab").classList.remove("active");
		document.getElementById("debugTab").classList.remove("active");
	}
	document.getElementById("fileTab").onmousedown=function(e){
		document.getElementById("colorsTabContent").classList.remove("active");
		document.getElementById("fileTabContent").classList.add("active");
		document.getElementById("debugTabContent").classList.remove("active");
		document.getElementById("colorsTab").classList.remove("active");
		document.getElementById("fileTab").classList.add("active");
		document.getElementById("debugTab").classList.remove("active");
	}
	document.getElementById("debugTab").onmousedown=function(e){
		document.getElementById("colorsTabContent").classList.remove("active");
		document.getElementById("fileTabContent").classList.remove("active");
		document.getElementById("debugTabContent").classList.add("active");
		document.getElementById("colorsTab").classList.remove("active");
		document.getElementById("fileTab").classList.remove("active");
		document.getElementById("debugTab").classList.add("active");
	}
	//buttons
	//change button
	function changeActive(e,el){
		if(!el.classList.contains("active")){
			document.getElementById("fileTabContent").getElementsByClassName("active")[0].classList.remove("active");
			el.classList.add("active");
		}
	}
	document.getElementById("brush").parentNode.onmousedown=function(e){
		changeActive(e,this);
		tool="brush";
	}
	document.getElementById("bucket").parentNode.onmousedown=function(e){
		
	}
	document.getElementById("eyedropper").parentNode.onmousedown=function(e){
		changeActive(e,this);
		tool="eyedropper";
	}
	document.getElementById("pan").parentNode.onmousedown=function(e){
		changeActive(e,this);
		tool="panning";
	}
	document.getElementById("zoom_in").parentNode.onmousedown=function(e){
		
	}
	document.getElementById("zoom_out").parentNode.onmousedown=function(e){
		
	}
	document.getElementById("play").parentNode.onmousedown=function(e){
		
	}
	document.getElementById("step").parentNode.onmousedown=function(e){
		
	}
	document.getElementById("stop").parentNode.onmousedown=function(e){
		
	}
}