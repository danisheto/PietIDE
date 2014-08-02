var canvasGrid=(function(window,document,undefined){
	var canvas=$("#canvas"),
		context=canvas.getContext("2d"),
		grid=[],
		squareSize=20,
		size=[20,20],//columns,rows
		zoom=1,
		colorHex="#000000",
		tool="brush",
		cursorOffset=[],
		offset=[0,0]
	function init(){
		initCanvas();
		initEvents();
	}
	function initCanvas(){
		context.clearRect(0,0,size[0]*squareSize*zoom,size[1]*squareSize*zoom);
		//initialize canvas size
		canvas.width=squareSize*size[0]*zoom;
		canvas.style.width=canvas.width;
		canvas.height=squareSize*size[1]*zoom;
		canvas.style.height=canvas.height;
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
			if(window['localStorage']!=null && !!window.localStorage["grid"]){
				grid=window.localStorage["grid"]
			}else{
				for(var i=0;i<size[0];i++){
					grid[i]=[];
					for(var j=0;j<size[1];j++){
						grid[i][j]="#FFFFFF";
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
			console.error("Error: color not in proper hex format: /#[\dA-Fa-f]{6}/")
		}
		return color;
	}
	function getColor(){
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
	function setTool(value){
		tool=value;
	}
	function setSquare(x,y,color,secondColor){
		context.clearRect(x*zoom*squareSize+1.5,y*zoom*squareSize+1.5,squareSize*zoom-2,squareSize*zoom-2)
		draw(x,y,color,secondColor);
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
		getColor:function(){
			return getColor();
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
		setTool:function(tool){
			return setTool(tool);
		},
		setSquare:function(x,y,color,secondColor){
			return setSquare(x,y,color,secondColor)
		}
	}
})(window, document);