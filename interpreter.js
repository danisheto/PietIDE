var interpreter=(function(window,document,undefined){
	var DPPosition=[0,0],
		nextDPPosition=[0,0],
		lastDPPosition=[0,0],
		DP=0,
		CC=false,
		grid=[],
		lastColor="",
		wait=0,
		blockSize=1,
		funcToExecute="",
		stack=[],
		started=false,
		anim=null,
		anim2=null,
		frequency=0.05,
		x=0.00
	function init(){
		grid=canvasGrid.getGrid();
	}
	var animation2=function(){
		grid[DPPosition[0]][DPPosition[1]]
		var colorRGB=new Hex(grid[DPPosition[0]][DPPosition[1]]).toRGB().rgb;
		colorRGB[0]=parseInt(Math.sin(x*frequency)*127+127,10);
		colorRGB[1]=parseInt(Math.sin(x*frequency+2*Math.PI/3)*127+127,10);
		colorRGB[2]=parseInt(Math.sin(x*frequency+4*Math.PI/3)*127+127,10);
		x++;
		canvasGrid.setSquare(DPPosition[0],DPPosition[1],lastColor,new RGB("rgb("+colorRGB.join(",")+")").toHex())
		return colorRGB
	}
	var animation=function(){
		grid[DPPosition[0]][DPPosition[1]]
		var colorRGB=new Hex(grid[DPPosition[0]][DPPosition[1]]).toRGB().rgb;
		colorRGB[0]=parseInt(Math.sin(x*frequency)*127+127,10);
		colorRGB[1]=parseInt(Math.sin(x*frequency)*127+127,10);
		colorRGB[2]=parseInt(Math.sin(x*frequency)*127+127,10);
		x++;
		canvasGrid.setSquare(lastDPPosition[0],lastDPPosition[1],lastColor,new RGB("rgb("+colorRGB.join(",")+")").toHex())
		return colorRGB
	}
	function movePosition(position){
		lastDPPosition=DPPosition
		var blockEnd=[];
		var blockStack=[position.slice(0)];
		var gridIterated=[];
		for(var i=0;i<grid.length;i++){
			gridIterated[i]=[];
			for(var j=0;j<grid[0].length;j++){
				gridIterated[i][j]=false;
			}
		}
		while(blockStack.length>0){
			var p=blockStack.pop();
			if(gridIterated[p[0]][p[1]]){
				continue;
			}
			while(--p[1]>=0 && grid[p[0]][p[1]]==lastColor){};
			if(!CC && DP==0 || CC && DP==2 || DP==3){
				if(!!grid[p[0]][p[1]+1] && grid[p[0]][p[1]]==lastColor){
					blockEnd.push([p[0],p[1]+1])
				}
			}
			while(p[1]++<grid[0].length && grid[p[0]][p[1]]==lastColor){
				blockSize++;
				gridIterated[p[0]][p[1]]=true;
				if(p[0]>0){
					if(!!grid[p[0]-1] && grid[p[0]-1][p[1]]==lastColor){
						blockStack.push([ p[0]-1, p[1] ]);
						if(DP==2 || (DP==1 && CC) || (DP==3 && !CC)){
							blockEnd.push([ p[0]-1, p[1] ]);
						}
					}
				}
				if(p[0]<grid.length){
					if(!!grid[p[0]+1] && grid[ p[0]+1 ][ p[1] ]==lastColor){
						blockStack.push([ p[0]+1, p[1] ]);
						if(DP==0 || (DP==1 && !CC) || (DP==3 && CC)){
							blockEnd.push([ p[0]+1, p[1] ]);
						}
					}
				}
			}
			if(CC && DP==0 || !CC && DP==2 || DP==1){
				blockEnd.push([ p[0], p[1] ]);
			}
		}
		blockSize--;
		console.log(blockEnd)
		switch(DP){
			case 0:
				for(var i=0;i<blockEnd.length;i++){
					if(blockEnd[i][0]>DPPosition[0]){
						nextDPPosition=blockEnd[i];
					}
					if(blockEnd[i][0]==DPPosition[0] && blockEnd[i][1]<DPPosition[1] && !CC){
						nextDPPosition=blockEnd[i];
					}else if(blockEnd[i][0]==DPPosition[0] && blockEnd[i][1]>DPPosition[1] && CC){
						nextDPPosition=blockEnd[i];
					}
				}
			break;
			case 1:
				for(var i=0;i<blockEnd.length;i++){
					if(blockEnd[i][1]>DPPosition[1]){
						nextDPPosition=blockEnd[i];
					}
					if(blockEnd[i][1]==DPPosition[1] && blockEnd[i][0]>DPPosition[0] && !CC){
						nextDPPosition=blockEnd[i];
					}else if(blockEnd[i][1]==DPPosition[1] && blockEnd[i][0]<DPPosition[0] && CC){
						nextDPPosition=blockEnd[i]
					}
				}
			break;
			case 2:
				for(var i=0;i<blockEnd.length;i++){
					if(blockEnd[i][0]<DPPosition[0]){
						nextDPPosition=blockEnd[i];
					}
					if(blockEnd[i][0]==DPPosition[0] && blockEnd[i][1]<DPPosition[1] && CC){
						nextDPPosition=blockEnd[i];
					}else if(blockEnd[i][0]==DPPosition[0] && blockEnd[i][1]>DPPosition[1] && !CC){
						nextDPPosition=blockEnd[i];
					}
				}
			break;
			case 3:
				for(var i=0;i<blockEnd.length;i++){
					if(blockEnd[i][1]<DPPosition[1]){
						nextDPPosition=blockEnd[i];
					}
					if(blockEnd[i][1]==DPPosition[1] && blockEnd[i][0]>DPPosition[0] && CC){
						nextDPPosition=blockEnd[i];
					}else if(blockEnd[i][1]==DPPosition[1] && blockEnd[i][0]<DPPosition[0] && !CC){
						nextDPPosition=blockEnd[i]
					}
				}
			break;
		}
		if(DPPosition!=nextDPPosition){
			lastDPPosition=DPPosition;
			DPPosition=nextDPPosition;
			console.log(nextDPPosition)
		}
		anim=setInterval(animation,25)
		anim2=setInterval(animation2,25)
	}
	function step(){
		if(started){
			changeBlock();//Program Execution #2-3
		}
		movePosition(DPPosition);//Program execution #1
	}
	function stop(){
		clearInterval(anim)
		clearInterval(anim2)
		canvasGrid.setSquare(DPPosition[0],DPPosition[1],lastColor,lastColor);
		canvasGrid.setSquare(lastDPPosition[0],lastDPPosition[1],lastColor,lastColor);
	}
	return {
		init:function(){
			init();
		},
		step:function(){
			return step();
		},
		stop:function(){
			stop();
		}
	}
})(window,document)