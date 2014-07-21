function canvasFunc(){
	drawInit();
	function drawInit(){
		canvas.width=columnSize*columns*canvasZoom;
		canvas.style.width=columnSize*columns*canvasZoom;
		canvas.height=columnSize*rows*canvasZoom;
		canvas.style.height=columnSize*rows*canvasZoom;
		context.lineWidth=1/canvasZoom;
		context.beginPath();
		var colorSpacesExists=false;
		if(colorSpaces[columns-1]){
			colorSpacesExists=true;
		}
		for(var i=0;i<columns;i++){
			var p=(i*columnSize*canvasZoom)+0.5;
			context.moveTo((p),0);
			context.lineTo(p,rows*columnSize*canvasZoom);
			if(!colorSpacesExists){
				colorSpaces[i]=[];
			}
		}
		for(var i=0;i<rows;i++){
			var p=(i*columnSize*canvasZoom);
			context.moveTo(0,p);
			context.lineTo(columns*columnSize*canvasZoom,p);
			for(var j=0;j<columns;j++){
				if(!colorSpacesExists){
					colorSpaces[j][i]="W";
				}else{
					draw(j,i,window.getComputedStyle(document.getElementById(colorSpaces[j][i])).getPropertyValue("background-color"));
				}
			}
		}
		context.stroke();
		context.translate(0,0)
	}
	function draw(x,y,colorToFill){
		if(!colorToFill){
			colorSpaces[x][y]=colorName;
			context.fillStyle=color;
		}else{
			context.fillStyle=colorToFill
		}
		context.beginPath();
		context.lineWidth=1;
		context.rect((x*20*canvasZoom)+0.5,(y*20*canvasZoom)+0.5,columnSize*canvasZoom,columnSize*canvasZoom);
		context.fill();
		context.stroke();
	}
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
					while(++position[1]<rows-1 && colorSpaces[position[0]][position[1]]==colorPicked){
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
	canvas.onmouseout=function(e){
		if(tool=="panning" && !!canvasCursorOffset[0]){
			canvasOffset=[parseInt(canvas.style.left.substring(0,canvas.style.left.length-2)),parseInt(canvas.style.top.substring(0,canvas.style.top.length-2))];
			canvasCursorOffset=[];
		}
	}
}