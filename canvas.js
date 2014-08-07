var canvasGrid=(function(window,document,undefined){
	var canvas=$("#canvas"),
		context=canvas.getContext("2d"),
		grid=[],
		squareSize=20,
		size=[20,20],//columns,rows
		zoom=1,
		colorHex="#000000",
		tool="brush",
		cursorOffset=[0,0],
		offset=[0,0]
	function init(){
		if(window['localStorage']!=null && !!window.localStorage["dates"]){
			dates=JSON.parse(window.localStorage["dates"])
			lastDate=JSON.parse(localStorage.getItem(dates[dates.length-1]))
			grid=lastDate.grid
			zoom=lastDate.options.zoom;
			tool=lastDate.options.tool;
			size=lastDate.options.size;
			offset=lastDate.options.canvasOffset;
		}
		initCanvas();
		initEvents();
	}
	function initCanvas(){
		context.clearRect(0,0,size[0]*squareSize*zoom,size[1]*squareSize*zoom);
		//initialize canvas size
		canvas.width=squareSize*size[0]*zoom;
		canvas.style.width=canvas.width+"px";
		canvas.height=squareSize*size[1]*zoom;
		canvas.style.height=canvas.height+"px";
		canvas.style.left=offset[0]+"px";
		canvas.style.top=offset[1]+"px";
		if(zoom>=0.5){
			context.beginPath();
			for(var i=0;i<size[0];i++){
				p=squareSize*zoom*i+0.5;
				context.moveTo(p,0);
				context.lineTo(p,size[1]*squareSize*zoom);
			}
			for(var i=0;i<size[1];i++){
				p=squareSize*zoom*i+0.5;
				context.moveTo(0,p);
				context.lineTo(size[0]*squareSize*zoom,p);
			}
			context.stroke();
		}
		if(!grid[size[0]-1]){
			if(window['localStorage']==null || !window.localStorage["dates"]){
				for(var i=0;i<size[0];i++){
					grid[i]=[];
					for(var j=0;j<size[1];j++){
						grid[i][j]="#ffffff";
					}
				}
			}
		}else{
			for(var i=0;i<size[0];i++){
				for(var j=0;j<size[1];j++){
					draw(i,j,grid[i][j])
				}
			}
		}
	}
	function draw(x,y,color,secondColor){
		context.fillStyle=!!color ? color : new RGB(window.getComputedStyle($("#colorPalette").$(".active")[0]).getPropertyValue("background-color")).toHex()
		context.strokeStyle=context.fillStyle
		context.strokeStyle=!!secondColor ? secondColor : context.fillStyle
		context.beginPath();
		if(zoom>=0.5){
			context.rect((x*squareSize*zoom)+1.5,(y*squareSize*zoom)+1.5,squareSize*zoom-2,squareSize*zoom-2)
		}else{
			context.rect((x*squareSize*zoom)+0.5,(y*squareSize*zoom)+0.5,squareSize*zoom,squareSize*zoom)
		}
		context.fill();
		context.stroke();
		grid[x][y]=context.fillStyle;
	}
	function initEvents(){
		function stopTooling(e){
			if(tool=="pan" && !!cursorOffset[0]){
				offset=[parseInt(canvas.style.left.slice(0,-2)),parseInt(canvas.style.top.slice(0,-2))]
				cursorOffset=[];
			}
		}
		canvas.onmousedown=function(e){
			var textRect=canvas.getBoundingClientRect();
			var position=[
				e.pageX-textRect.left-2,
				e.pageY-textRect.top-2
			]
			var square=[
				Math.floor(position[0]/(squareSize*zoom)),
				Math.floor(position[1]/(squareSize*zoom))
			]
			$("#save").classList.remove("done");
			switch(tool){
				case "brush":
					if(position[0]>=0 && position[1]>=0 && grid[square[0]][square[1]]!=colorHex){
						draw(square[0],square[1]);
					}
					break;
				case "bucket":
					var stack=[square];
					var colorPicked=grid[square[0]][square[1]];
					while(stack.length){
						var curPos=stack.pop();
						while(--curPos[1] >=0 && grid[curPos[0]][curPos[1]]==colorPicked){}
						while(++curPos[1]<size[1] && grid[curPos[0]][curPos[1]]==colorPicked){
							draw(curPos[0],curPos[1]);
							if(curPos[0]>0){
								if(!!grid[curPos[0]-1][curPos[1]] && grid[curPos[0]-1][curPos[1]]==colorPicked){
									stack.push([curPos[0]-1,curPos[1]]);
								}
								if(!!grid[curPos[0]+1] && grid[curPos[0]+1][curPos[1]]==colorPicked){
									stack.push([curPos[0]+1,curPos[1]]);
								}
							}
						}
					}
					break;
				case "eyedropper":
					if(grid[square[0]][square[1]]!=colorHex){
						colorHex=grid[square[0]][square[1]];
					}
					pietUI.setColorActive(setColor(colorHex));
					break;
				case "pan":
					cursorOffset=[e.pageX,e.pageY];
					break;
			}
		}
		canvas.onmousemove=function(e){
			if(tool=="pan" && !!cursorOffset[0]){
				canvas.style.left=(e.pageX-cursorOffset[0]+offset[0])+"px";
				canvas.style.top=(e.pageY-cursorOffset[1]+offset[1])+"px";
			}
		}
		canvas.onmouseup=function(e){stopTooling(e)}
		canvas.onmouseout=function(e){stopTooling(e)}
	}
	//specifically public methods
	function setColor(color){
		if(color.slice(0,4)=="rgb("){
			var color=new RGB(color).toHex()
		}
		if(typeof color=="string" && color[0]=="#" && color.length==7){
			colorHex=color;
		}else{
			console.error("Error: color not in proper hex format: /#[\dA-Fa-f]{6}/", color)
		}
		return color;
	}
	function getCurrentColor(){
		return colorHex
	}
	function setZoom(value){
		zoom=value;
	}
	function getZoom(){
		return zoom
	}
	function getGrid(){
		return grid
	}
	function resetGrid(){
		for(var i=0;i<size[0];i++){
			for(var j=0;j<size[1];j++){
				grid[i][j]="#ffffff"
			}
		}
	}
	function setTool(value){
		tool=value;
	}
	function getTool(){
		return tool;
	}
	function setSquare(x,y,color,secondColor){
		context.clearRect(x*zoom*squareSize+1.5,y*zoom*squareSize+1.5,squareSize*zoom-2,squareSize*zoom-2)
		draw(x,y,color,secondColor);
	}
	function getColorDetails(color){
		colorValue=[];
		//check if contains red
		if(color.slice(1,3).search(/[Ff].*/g)>-1 || color.search(/#[cC]0[^fF]{4}/)>-1){
			colorValue=[0]
		}
		//check if contains green
		if(color.slice(3,5).search(/[Ff].*/g)>-1 || color.search(/#[^fF]{2}[cC]0[^fF]{2}/)>-1){
			//and mixes if already contains a color
			if(colorValue[0]==0){
				colorValue[0]++;
			}else{
				colorValue[0]=2;
			}
		}
		//check if contains blue
		if(color.slice(5,7).search(/[fF]{2}/)>-1 || color.search(/#[^fF]{4}[cC]0/)>-1){
			//and mixes if already contains a color
			if(colorValue[0]==2){
				colorValue[0]++;
			}else if(colorValue[0]==0){
				colorValue[0]=5;
			}else{
				colorValue[0]=4;
			}
		}
		if(color.search(/#.*[0Ff]{6}.*/g)>-1){
			colorValue[1]=1
		}else if(color.search(/#.*[0Cc]{6}.*/g)>-1){
			colorValue[1]=2
		}else{
			colorValue[1]=0
		}
		return colorValue
	}
	function saveGrid(name, sidebarOffset){
		var saveObj={};
		saveObj.grid=grid;
		saveObj.options={};
		saveObj.options.active=$("#colorPalette").$(".active")[0].id;
		saveObj.options.primary=window.getComputedStyle($("#primary")).getPropertyValue("background-color");
		saveObj.options.secondary=window.getComputedStyle($("#secondary")).getPropertyValue("background-color");
		saveObj.options.tool=tool;
		saveObj.options.zoom=zoom;
		saveObj.options.size=size;
		saveObj.options.sidebarOffset=sidebarOffset;
		saveObj.options.canvasOffset=offset;
		localStorage.setItem(name,JSON.stringify(saveObj));
	}
	function saveOptions(){
		var saveObj={};
		saveObj.zoom=zoom;
		saveObj.size=size;
	}
	function changeSize(size){
		size=size;
		canvasInit();
	}
	function move(x,y){
		offset=[x,y]
		canvas.style.left=x;
		canvas.style.top=y
	}
	return {
		init:function(){
			return init();
		},
		initCanvas:function(){
			return initCanvas();
		},
		draw:function(color){
			return draw(x,y,color)
		},
		setColor:function(color){
			return setColor(color)
		},
		getCurrentColor:function(){
			return getCurrentColor();
		},
		setZoom:function(value){
			return setZoom(value);
		},
		getZoom:function(){
			return getZoom();
		},
		getGrid:function(){
			return getGrid();
		},
		resetGrid:function(){
			return resetGrid();
		},
		getTool:function(){
			return getTool();
		},
		setTool:function(tool){
			return setTool(tool);
		},
		setSquare:function(x,y,color,secondColor){
			return setSquare(x,y,color,secondColor)
		},
		getColorDetails:function(colorHex){
			return getColorDetails(colorHex);
		},
		saveGrid:function(name, sidebarOffset){
			return saveGrid(name,sidebarOffset);
		},
		changeSize:function(size){
			return changeSize(size)
		},
		move:function(x,y){
			return move(x,y);
		}
	}
})(window, document);