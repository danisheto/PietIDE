window.onload=function(){
	var canvas=document.getElementById('canvas'),
		context=canvas.getContext("2d"),
		canvasZoom=1,
		columnSize=20,
		columns=14,
		rows=10,
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
		tab=1,
		DP="right",
		CC="left",
		lastColor="",
		wait=0,
		blockSize=1,
		blockEnd=[],
		DPPosition=[0,0],
		funcToExecute="",
		stack=[];
	for(var key in colorsId){
		colorsValue[colorsId[key]]=key;
	}
	function drawInit(){
		canvas.width=columnSize*columns*canvasZoom;
		canvas.style.width=columnSize*columns*canvasZoom;
		canvas.height=columnSize*rows*canvasZoom;
		canvas.style.height=columnSize*rows*canvasZoom;
		var colorSpacesExists=false;
		if(colorSpaces[columns-1]){
			colorSpacesExists=true;
		}
		if(canvasZoom>=0.5){
			context.beginPath();
			context.lineWidth=1/canvasZoom;
			for(var i=0;i<columns;i++){
				var p=(i*columnSize*canvasZoom)+0.5;
				context.moveTo((p),0);
				context.lineTo(p,rows*columnSize*canvasZoom);
			}
			for(var i=0;i<rows;i++){
				var p=(i*columnSize*canvasZoom)+0.5;
				context.moveTo(0,p);
				context.lineTo(columns*columnSize*canvasZoom,p);
			}
			context.stroke();
		}
		for(var i=0;i<columns;i++){
			if(!colorSpacesExists){
				colorSpaces[i]=[];
			}
			for(var j=0;j<rows;j++){
				if(!colorSpacesExists){
					colorSpaces[i][j]="W";
				}else{
					draw(i,j,window.getComputedStyle(document.getElementById(colorSpaces[i][j])).getPropertyValue("background-color"));
				}
			}
		}
	}
	function draw(x,y,colorToFill){
		if(!colorToFill){
			colorSpaces[x][y]=colorName;
			context.fillStyle=color;
			context.strokeStyle=color;
		}else{
			context.fillStyle=colorToFill;
			context.strokeStyle=colorToFill;
		}
		context.beginPath();
		context.lineWidth=1;
		if(canvasZoom>=0.5){
			context.rect((x*20*canvasZoom)+1.5,(y*20*canvasZoom)+1.5,columnSize*canvasZoom-2,columnSize*canvasZoom-2);
		}else{
			context.rect((x*20*canvasZoom)+0.5,(y*20*canvasZoom)+0.5,columnSize*canvasZoom,columnSize*canvasZoom);
		}
		context.fill();
		context.stroke();
	}
	drawInit();
	canvas.onmousedown=function(e){
		var textRect=canvas.getBoundingClientRect();
		var position=[
			e.pageX-textRect.left-2,
			e.pageY-textRect.top-2
		]
		var square=[
			Math.floor(position[0]/(columnSize*canvasZoom)),
			Math.floor(position[1]/(columnSize*canvasZoom))
		]
		switch(tool){
			case "brush":
				if(position[0]>=0 && position[1]>=0 && colorSpaces[square[0]][square[1]]!=colorName){
					draw(square[0],square[1]);
				}
			break;
			case "bucket":
				var stack=[square];
				var colorPicked=colorSpaces[square[0]][square[1]];
				while(stack.length){
					var position=stack.pop();
					while(--position[1] >=0 && colorSpaces[position[0]][position[1]]==colorPicked){}
					while(++position[1]<rows && colorSpaces[position[0]][position[1]]==colorPicked){
						draw(position[0],position[1]);
						if(position[0]>0){
							if(colorSpaces[position[0]-1][position[1]]==colorPicked){
								stack.push([position[0]-1,position[1]]);
							}
						}
						if(position[0]<columns-1){
							if(colorSpaces[position[0]+1][position[1]]==colorPicked){
								stack.push([position[0]+1,position[1]]);
							}
						}
					}
				}
			break;
			case "eyedropper":
				if(colorSpaces[square[0]][square[1]]!="W"){
					colorName=colorSpaces[square[0]][square[1]];
				}else{
					colorName="W";
				}
				color=window.getComputedStyle(document.getElementById(colorName)).getPropertyValue("background-color");
				document.getElementById("colorPalette").getElementsByClassName("active")[0].style.backgroundColor=color;
			break;
			case "panning":
				canvasCursorOffset=[e.pageX,e.pageY];
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
	canvas.onmouseout=function(e){
		if(tool=="panning" && !!canvasCursorOffset[0]){
			canvasOffset=[parseInt(canvas.style.left.substring(0,canvas.style.left.length-2)),parseInt(canvas.style.top.substring(0,canvas.style.top.length-2))];
			canvasCursorOffset=[];
		}
	}
	document.getElementById("colors").onmousedown=function(e){
		color=window.getComputedStyle(e.target).getPropertyValue("background-color");
		colorName=e.target.id;
		var active=document.getElementById("colorPalette").getElementsByClassName("active")[0];
		active.style.backgroundColor=color;
		active.classList.add(colorName);
	}
	document.getElementById("W").onmousedown=function(e){
		color="#FFFFFF";
		colorName="W";
		var active=document.getElementById("colorPalette").getElementsByClassName("active")[0];
		active.style.backgroundColor=color;
		active.classList.add(colorName);
	}
	document.getElementById("Black").onmousedown=function(e){
		color="#000000";
		colorName="Black";
		var active=document.getElementById("colorPalette").getElementsByClassName("active")[0];
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
					case "B":
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
			if(colorName.length<2){
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
		changeActive(e,this);
		tool="bucket";
	}
	document.getElementById("eyedropper").parentNode.onmousedown=function(e){
		changeActive(e,this);
		tool="eyedropper";
	}
	document.getElementById("pan").parentNode.onmousedown=function(e){
		changeActive(e,this);
		tool="panning";
	}
	var zoomValues=[0.1,0.25,0.5,0.75,1,1.25,1.5,1.75,2,2.5,3,4,5];
	document.getElementById("zoom_in").parentNode.onmousedown=function(e){
		context.clearRect(0,0,columns*columnSize*canvasZoom,rows*columnSize*canvasZoom);
		for(var i=0;i<zoomValues.length;i++){
			if(zoomValues[i]>canvasZoom){
				canvasZoom=zoomValues[i];
				document.getElementById("zoomLevel").innerHTML="Zoom: "+canvasZoom*100+"%";
				document.getElementById("zoomSlide").getElementsByTagName("input")[0].value=canvasZoom*100;
				break;
			}
		}
		drawInit();
	}
	document.getElementById("zoom_out").parentNode.onmousedown=function(e){
		context.clearRect(0,0,columns*columnSize*canvasZoom,rows*columnSize*canvasZoom);
		for(var i=zoomValues.length;i>0;i--){
			console.log(i)
			if(zoomValues[i]<canvasZoom){
				canvasZoom=zoomValues[i];
				document.getElementById("zoomLevel").innerHTML="Zoom: "+canvasZoom*100+"%";
				document.getElementById("zoomSlide").getElementsByTagName("input")[0].value=canvasZoom*100;
				break;
			}
		}
		drawInit();
	}
	document.getElementById("zoomSlide").getElementsByTagName("input")[0].onmousedown=function(){
		if(columns*rows<150){
			this.onmousemove=function(e){
				context.clearRect(0,0,columns*columnSize*canvasZoom,rows*columnSize*canvasZoom);
				canvasZoom=this.value/100;
				document.getElementById("zoomLevel").innerHTML="Zoom: "+this.value+"%";
				drawInit();
			}
		}else{
			this.onchange=function(e){
				context.clearRect(0,0,columns*columnSize*canvasZoom,rows*columnSize*canvasZoom);
				canvasZoom=this.value/100;
				document.getElementById("zoomLevel").innerHTML="Zoom: "+this.value+"%";
				drawInit();
			}
		}
	}
	document.getElementById("zoomSlide").getElementsByTagName("input")[0].onmouseup=function(){
		this.onmousemove=null;
	}
	function moveDP(){
		var blockStack=[DPPosition.slice(0)];
		var colorSpacesCompleted=[];
		for(var i=0;i<columns;i++){
			colorSpacesCompleted[i]=[];
			for(var j=0;j<rows;j++){
				colorSpacesCompleted[i][j]=false;
			}
		}
		while(blockStack.length){
			var position=blockStack.pop();
			if(colorSpacesCompleted[position[0]][position[1]]){
				continue;
			}
			while(position[1]-- >=0 && colorSpaces[position[0]][position[1]]==lastColor){}
			if(CC=="left" && DP=="right"){
				blockEnd.push([position[0],position[1]]);
			}
			while(position[1]++<rows && colorSpaces[position[0]][position[1]]==lastColor){
				blockSize++;
				colorSpacesCompleted[position[0]][position[1]]=true;
				if(position[0]>0){
					if(colorSpaces[position[0]-1][position[1]]==lastColor){
						blockStack.push([position[0]-1,position[1]]);
						if(DP=="left"){
							blockEnd.push([position[0]-1,position[1]]);
						}
					}
				}
				if(position[0]<columns-1){
					if(colorSpaces[position[0]+1][position[1]]==lastColor){
						blockStack.push([position[0]+1,position[1]]);
						if(DP=='right'){
							blockEnd.push([position[0]+1,position[1]]);
						}
					}
				}
			}
		}
		blockSize--;
		switch(DP){
			case "right":
				for(var i=0;i<blockEnd.length;i++){
					if(blockEnd[i][1]>DPPosition[1]){
						DPPosition=blockEnd[i];
					}
					if(blockEnd[i][1]==DPPosition[1] && blockEnd[i][0]<DPPosition[0] && CC=="left"){
						DPPosition=blockEnd[i];
					}
				}
			break;
		}
		blockEnd=[];
	}
	document.getElementById("play").parentNode.onmousedown=function(e){
		
	}
	document.getElementById("step").parentNode.onmousedown=function(e){
		if(funcToExecute.length>0){
			switch(funcToExecute){
				case "push":
					stack.push(blockSize);
					var newStackData=document.createElement("div");
					newStackData.innerHTML=blockSize;
					var el=document.getElementById("stack");
					el.insertBefore(newStackData,el.getElementsByTagName("div")[document.getElementsByTagName("div").length-1]);
				break;
			}
		}
		lastColor=colorSpaces[DPPosition[0]][DPPosition[1]];
		var difference=[];
		var darkness,hue;
		var lastColorHue;
		blockSize=1;
		switch(DP){
			case "right":
				if(DPPosition){

				}
			break;
		}
		moveDP();
		switch(CC){
			case "left":
				switch(DP){
					case "right":
						if(!!colorSpaces[DPPosition[0]][DPPosition[1]-1] && colorSpaces[DPPosition[0]][DPPosition[1]-1]!="Black" && colorSpaces[DPPosition[0]][DPPosition[1]-1]!="W"){
							var blockColor=colorSpaces[DPPosition[0]][DPPosition[1]-1];
							console.log(blockColor)
							if(blockColor.length<2){
								darkness=1;
							}else if(blockColor[0]=="L"){
								darkness=0;
							}else if(blockColor[0]=="D"){
								darkness=2
							}
							switch(blockColor.substr(blockColor.length-1)){
								case "R":
									hue=0;
								break;
								case "Y":
									hue=1;
								break;
								case "G":
									hue=2;
								break;
								case "C":
									hue=3;
								break;
								case "B":
									hue=4;
								break;
								case "M":
									hue=5;
								break;
							}
						}else{
							wait++
							funcToExecute="wait("+wait+")";
						}
					break;
				}
			break;
		}
		if(lastColor.length<2){
			difference[0]=(2+darkness)%3;
		}else if(lastColor[0]=="L"){
			difference[0]=darkness;
		}else if(lastColor[0]="D"){
			difference[0]=(1+darkness)%3;
		}
		switch(lastColor.substr(lastColor.length-1)){
			case "R":
				difference[1]=hue;
			break;
			case "Y":
				difference[1]=(5+hue)%6;
			break;
			case "G":
				difference[1]=(4+hue)%6;
			break;
			case "C":
				difference[1]=(3+hue)%6;
			break;
			case "B":
				difference[1]=(2+hue)%6;
			break;
			case "M":
				difference[1]=(1+hue)%6;
			break;
		}
		switch(difference[0]){
			case 0:
				switch(difference[1]){
					case 0:
						console.log("Error: There isn't a change in color")
					break;
					case 1:
						funcToExecute="add";
					break;
					case 2:
						funcToExecute="divide";
					break;
					case 3:
						funcToExecute="greater";
					break;
					case 4:
						funcToExecute="duplicate";
					break;
					case 5:
						funcToExecute="in(char)";
					break;
				}
			break;
			case 1:
				switch(difference[1]){
					case 0:
						funcToExecute="push";
					break;
				}
			break;
		}
		console.log(DPPosition)
		document.getElementById("nextOp").getElementsByTagName("span")[0].innerHTML="Next Operation: "+funcToExecute;
	}
	document.getElementById("stop").parentNode.onmousedown=function(e){
		
	}

}