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
		funcToExecute=function(){},
		funcToExecuteName="",
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
		var colorRGB=new Hex(grid[DPPosition[0]][DPPosition[1]]).toRGB().rgb;
		colorRGB[0]=parseInt(Math.cos(x*frequency)*127+127,10);
		colorRGB[1]=parseInt(Math.cos(x*frequency+2*Math.PI/3)*127+127,10);
		colorRGB[2]=parseInt(Math.cos(x*frequency+4*Math.PI/3)*127+127,10);
		x++;
		canvasGrid.setSquare(DPPosition[0],DPPosition[1],lastColor,new RGB("rgb("+colorRGB.join(",")+")").toHex())
		return colorRGB
	}
	var animation=function(){
		var colorRGB=new Hex(grid[DPPosition[0]][DPPosition[1]]).toRGB().rgb;
		colorRGB[0]=parseInt(Math.cos(x*frequency/2)*127+127,10);
		colorRGB[1]=parseInt(Math.cos(x*frequency/2)*127+127,10);
		colorRGB[2]=parseInt(Math.cos(x*frequency/2)*127+127,10);
		x++;
		canvasGrid.setSquare(lastDPPosition[0],lastDPPosition[1],lastColor,new RGB("rgb("+colorRGB.join(",")+")").toHex())
		return colorRGB
	}
	function movePosition(position){
		lastDPPosition=DPPosition
		lastColor=grid[lastDPPosition[0]][lastDPPosition[1]];
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
				if(!!grid[p[0]][p[1]+1] && grid[p[0]][p[1]+1]==lastColor){
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
		switch(DP){
			case 0:
				for(var i=0;i<blockEnd.length;i++){
					if(blockEnd[i][0]>nextDPPosition[0]){
						nextDPPosition=blockEnd[i];
					}
					if(blockEnd[i][0]==nextDPPosition[0] && blockEnd[i][1]<nextDPPosition[1] && !CC){
						nextDPPosition=blockEnd[i];
					}else if(blockEnd[i][0]==nextDPPosition[0] && blockEnd[i][1]>nextDPPosition[1] && CC){
						nextDPPosition=blockEnd[i];
					}
				}
			break;
			case 1:
				for(var i=0;i<blockEnd.length;i++){
					if(blockEnd[i][1]>nextDPPosition[1]){
						nextDPPosition=blockEnd[i];
					}
					if(blockEnd[i][1]==nextDPPosition[1] && blockEnd[i][0]>nextDPPosition[0] && !CC){
						nextDPPosition=blockEnd[i];
					}else if(blockEnd[i][1]==nextDPPosition[1] && blockEnd[i][0]<nextDPPosition[0] && CC){
						nextDPPosition=blockEnd[i]
					}
				}
			break;
			case 2:
				for(var i=0;i<blockEnd.length;i++){
					if(blockEnd[i][0]<nextDPPosition[0]){
						nextDPPosition=blockEnd[i];
					}
					if(blockEnd[i][0]==nextDPPosition[0] && blockEnd[i][1]<nextDPPosition[1] && CC){
						nextDPPosition=blockEnd[i];
					}else if(blockEnd[i][0]==nextDPPosition[0] && blockEnd[i][1]>nextDPPosition[1] && !CC){
						nextDPPosition=blockEnd[i];
					}
				}
			break;
			case 3:
				for(var i=0;i<blockEnd.length;i++){
					if(blockEnd[i][1]<nextDPPosition[1]){
						nextDPPosition=blockEnd[i];
					}
					if(blockEnd[i][1]==nextDPPosition[1] && blockEnd[i][0]>nextDPPosition[0] && CC){
						nextDPPosition=blockEnd[i];
					}else if(blockEnd[i][1]==nextDPPosition[1] && blockEnd[i][0]<nextDPPosition[0] && !CC){
						nextDPPosition=blockEnd[i]
					}
				}
			break;
		}
		if(DPPosition!=nextDPPosition){
			lastDPPosition=DPPosition;
			DPPosition=nextDPPosition;
			anim=setInterval(animation,25)
			anim2=setInterval(animation2,25)
			started=true;
		}
	}
	function changeBlock(){
		//choose colour block
		//compare colors and choose function
		var codel;
		switch(DP){
			case 0:
				switch(CC){
					case false:
						codel=[DPPosition[0],DPPosition[1]-1]
						break;
					case true:
						codel=[DPPosition[0],DPPosition[1]+1]
						break;
				}
				break;
			case 1:
				switch(CC){
					case false:
						codel=[DPPosition[0]+1,DPPosition[1]]
						break;
					case true:
						codel=[DPPosition[0]-1,DPPosition[1]]
						break;
				}
				break;
			case 2:
				switch(CC){
					case false:
						codel=[DPPosition[0],DPPosition[1]+1]
						break;
					case true:
						codel=[DPPosition[0],DPPosition[1]-1]
						break;
				}
				break;
			case 3:
				switch(CC){
					case false:
						codel=[DPPosition[0]-1,DPPosition[1]]
						break;
					case true:
						codel=[DPPosition[0]+1,DPPosition[1]]
						break;
				}
				break;
		}
		currentColorValues=canvasGrid.getColorDetails(grid[DPPosition[0]][DPPosition[1]]);
		codelColorValues=canvasGrid.getColorDetails(grid[codel[0]][codel[1]]);
		difference=[(3+codelColorValues[0]-currentColorValues[0])%3, (6+codelColorValues[1]-currentColorValues[1])%6];
		console.log($.equal(difference,[0,1]))
		switch(true){
			case $.equal(difference,[0,1]):
				functionToExec=function(){
					//push
					stack.push(blockSize);
					pietUI.updateStack(stack);
				}
				funcToExecuteName="push";
				break;
			case $.equal(difference,[0,2]):
				functionToExec=function(){
					//pop
					if(stack.length>0){
						stack.pop();
						pietUI.updateStack(stack)
					}
				}
				funcToExecuteName="pop";
				break;
			case $.equal(difference,[1,0]):
				functionToExec=function(){
					//add
					if(stack.length>1){
						stack.push(stack.pop()+stack.pop());
						pietUI.updateStack(stack)
					}
				}
				funcToExecuteName="add";
				break;
			case $.equal(difference,[1,1]):
				functionToExec=function(){
					//subtract
					if(stack.length>1){
						n1=stack.pop();
						n2=stack.pop();
						stack.push(n2-n1);
						pietUI.updateStack(stack)
					}
				}
				funcToExecuteName="subtract";
				break;
			case $.equal(difference,[1,2]):
				functionToExec=function(){
					//multiply
					if(stack.length>1){
						stack.push(stack.pop()*stack.pop());
						pietUI.updateStack(stack)
					}
				}
				funcToExecuteName="multiply";
				break;
			case $.equal(difference,[2,0]):
				functionToExec=function(){
					//divide
					if(stack.length>1){
						n1=stack.pop();
						n2=stack.pop();
						stack.push(n2/n1);
						pietUI.updateStack(stack)
					}
				}
				funcToExecuteName="divide";
				break;
			case $.equal(difference,[2,1]):
				functionToExec=function(){
					//mod
					if(stack.length>1){
						n1=stack.pop();
						n2=stack.pop();
						stack.push(n2%n1);
						pietUI.updateStack(stack)
					}
				}
				funcToExecuteName="mod";
				break;
			case $.equal(difference,[2,2]):
				functionToExec=function(){
					//not
					if(stack.length>0){
						n1=stack.pop();
						stack.push(!n1 ? 1 : 0);
						pietUI.updateStack(stack);
					}
				}
				funcToExecuteName="not";
				break;
			case $.equal(difference,[3,0]):
				functionToExec=function(){
					//greater
					if(stack.length>1){
						n1=stack.pop();
						n2=stack.pop();
						stack.push((n2>n1)?1:0);
						pietUI.updateStack(stack);
					}
				}
				funcToExecuteName="greater";
				break;
			case $.equal(difference,[3,1]):
				functionToExec=function(){
					//pointer
					if(stack.length>0){
						DP=DP+stack.pop()%4;
						while(DP<0){
							DP+=4;
						}
					}
				}
				funcToExecuteName="pointer";
				break;
			case $.equal(difference,[3,2]):
				functionToExec=function(){
					//switch
					if(stack.length>0){
						for(var i=0;i<stack.pop();i++){
							CC=!CC;
						}
					}
				}
				funcToExecuteName="switch";
				break;
			case $.equal(difference,[4,0]):
				functionToExec=function(){
					//duplicate
					if(stack.length>0){
						var n1=stack.pop();
						stack.push(n1);
						stack.push(n1);
					}
				}
				funcToExecuteName="duplicate";
				break;
			case $.equal(difference,[4,1]):
				functionToExec=function(){
					//roll
					if(stack.length>1){
						n1=stack.pop();
						n2=stack.pop();
						for(var i=0;i<n1;i++){
							var el=stack.splice(-1,1);
							stack.splice(0-n2,0,el);
						}
					}
				}
				funcToExecuteName="roll";
				break;
			case $.equal(difference,[4,2]):
				functionToExec=function(){
					//in(num)
					if($("input").value!="" && /^\d*$/.test($("input").value){
						stack.push($("input").value[0])
					}else if($("input").value==""){
						console.error("Error: nothing in STDIN");
					}else if(!/^\d*$/.test($("input").value)){
						console.error($("input").value+" contains characters other than digits, including spaces");
					}else{
						console.error("Error: Input error");
					}
				}
				funcToExecuteName="in(num)";
				break;
			case $.equal(difference,[5,0]):
				functionToExec=function(){
					//in(char)
					if($("input").value!=""){
						stack.push($("input").value[0])
					}else if($("input").value==""){
						console.error("Error: nothing in STDIN");
					}else{
						console.error("Error: Input error");
					}
				}
				funcToExecuteName="in(char)";
				break;
			case $.equal(difference,[5,1]):
				functionToExec=function(){
					//out(num)
					if(stack.length>0){

					}
				}
				funcToExecuteName="out(num)";
				break;
			case $.equal(difference,[5,2]):
				functionToExec=function(){
					//out(char)
					fromCharCode
				}
				funcToExecuteName="out(char)";
				break;
		}
	}
	function step(){
		if(started){
			functionToExec.call(this)
			blockSize=1;
			// runFunction();//run function to executes
		}
		movePosition(DPPosition);//Program execution #1-2
		changeBlock();//Program Execution #3
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