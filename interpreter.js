var interpreter=(function(window,document,undefined){
	var DPPosition=[0,0],
		nextDPPosition=[0,0],
		lastDPPosition=[0,0],
		DP=0,
		CC=false,
		grid=[],
		color="",
		color="",
		wait=0,
		blockSize=1,
		functionToExecute=function(){},
		functionToExecuteName="",
		stack=[],
		started=false,
		anim=new animDaemon(),
		anim2=new animDaemon(),
		anim3=new animDaemon(),
		frequency=0.05,
		x=0.00
	function init(){
		grid=canvasGrid.getGrid();
	}
	function animDaemon(affecting, func){
		this.func=func;
		this.affecting=affecting;
	}
	function movePosition(position){
		lastDPPosition=nextDPPosition
		lastColor=color;
		color=grid[lastDPPosition[0]][lastDPPosition[1]];
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
			while(--p[1]>=0 && grid[p[0]][p[1]]==color){};
			if(!CC && DP==0 || CC && DP==2 || DP==3){
				if(!!grid[p[0]][p[1]+1] && grid[p[0]][p[1]+1]==color){
					blockEnd.push([p[0],p[1]+1])
				}
			}
			while(++p[1]<grid[0].length && grid[p[0]][p[1]]==color){
				blockSize++;
				gridIterated[p[0]][p[1]]=true;
				if(p[0]>0){
					if(!!grid[p[0]-1] && grid[p[0]-1][p[1]]==color){
						blockStack.push([ p[0]-1, p[1] ]);
						if(DP==2 || (DP==1 && CC) || (DP==3 && !CC)){
							blockEnd.push([ p[0]-1, p[1] ]);
						}
					}
				}
				if(p[0]<grid.length){
					if(!!grid[p[0]+1] && grid[ p[0]+1 ][ p[1] ]==color){
						blockStack.push([ p[0]+1, p[1] ]);
						if(DP==0 || (DP==1 && !CC) || (DP==3 && CC)){
							blockEnd.push([ p[0]+1, p[1] ]);
						}
					}
				}
			}
			p[1]--;
			if(CC && DP==0 || !CC && DP==2 || DP==1){
				blockEnd.push([ p[0], p[1] ]);
			}
		}
		blockSize--;
		switch(DP){
			case 0:
				for(var i=0;i<blockEnd.length;i++){
					if(blockEnd[i][0]>DPPosition[0]){
						DPPosition=blockEnd[i];
					}
					if(blockEnd[i][0]==DPPosition[0] && blockEnd[i][1]<DPPosition[1] && !CC){
						DPPosition=blockEnd[i];
					}else if(blockEnd[i][0]==DPPosition[0] && blockEnd[i][1]>DPPosition[1] && CC){
						DPPosition=blockEnd[i];
					}
				}
			break;
			case 1:
				for(var i=0;i<blockEnd.length;i++){
					if(blockEnd[i][1]>DPPosition[1]){
						DPPosition=blockEnd[i];
					}
					if(blockEnd[i][1]==DPPosition[1] && blockEnd[i][0]>DPPosition[0] && !CC){
						DPPosition=blockEnd[i];
					}else if(blockEnd[i][1]==DPPosition[1] && blockEnd[i][0]<DPPosition[0] && CC){
						DPPosition=blockEnd[i]
					}
				}
			break;
			case 2:
				for(var i=0;i<blockEnd.length;i++){
					if(blockEnd[i][0]<DPPosition[0]){
						DPPosition=blockEnd[i];
					}
					if(blockEnd[i][0]==DPPosition[0] && blockEnd[i][1]<DPPosition[1] && CC){
						DPPosition=blockEnd[i];
					}else if(blockEnd[i][0]==DPPosition[0] && blockEnd[i][1]>DPPosition[1] && !CC){
						DPPosition=blockEnd[i];
					}
				}
			break;
			case 3:
				for(var i=0;i<blockEnd.length;i++){
					if(blockEnd[i][1]<DPPosition[1]){
						DPPosition=blockEnd[i];
					}
					if(blockEnd[i][1]==DPPosition[1] && blockEnd[i][0]>DPPosition[0] && CC){
						DPPosition=blockEnd[i];
					}else if(blockEnd[i][1]==DPPosition[1] && blockEnd[i][0]<DPPosition[0] && !CC){
						DPPosition=blockEnd[i]
					}
				}
			break;
		}
		console.log(DPPosition)
		if(lastDPPosition!=DPPosition){
			// if(!!anim.affecting){
			// 	stop();
			// }
			// anim=new animDaemon(setInterval(function(){
			// 	var colorRGB=new Hex(grid[DPPosition[0]][DPPosition[1]]).toRGB().rgb;
			// 	colorRGB[0]=parseInt(Math.cos(x*frequency)*127+127,10);
			// 	colorRGB[1]=parseInt(Math.cos(x*frequency)*127+127,10);
			// 	colorRGB[2]=parseInt(Math.cos(x*frequency)*127+127,10);
			// 	x++;
			// 	canvasGrid.setSquare(lastDPPosition[0],lastDPPosition[1],color,new RGB("rgb("+colorRGB.join(",")+")").toHex())
			// 	return colorRGB
			// },25),DPPosition);
			// anim2=new animDaemon(setInterval(function(){
			// 	var colorRGB=new Hex(grid[DPPosition[0]][DPPosition[1]]).toRGB().rgb;
			// 	colorRGB[0]=parseInt(Math.cos(x*frequency)*127+127,10);
			// 	colorRGB[1]=parseInt(Math.cos(x*frequency+2*Math.PI/3)*127+127,10);
			// 	colorRGB[2]=parseInt(Math.cos(x*frequency+4*Math.PI/3)*127+127,10);
			// 	x++;
			// 	canvasGrid.setSquare(DPPosition[0],DPPosition[1],color,new RGB("rgb("+colorRGB.join(",")+")").toHex())
			// 	return colorRGB
			// },25),DPPosition);
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
		if(grid[codel[0]] && !!grid[codel[0]][codel[1]] && grid[codel[0]][codel[1]].toLowerCase()!="#ffffff"){
			console.log(DPPosition[0],DPPosition[1],codel,grid)
			currentColorValues=canvasGrid.getColorDetails(grid[DPPosition[0]][DPPosition[1]]);
			codelColorValues=canvasGrid.getColorDetails(grid[codel[0]][codel[1]]);
			difference=[(6+codelColorValues[0]-currentColorValues[0])%6, (3+codelColorValues[1]-currentColorValues[1])%3];
			nextDPPosition=codel;
			console.log(difference,currentColorValues,codelColorValues)
			switch(true){
				case $.equal(difference,[0,1]):
					functionToExecute=function(){
						//push
						stack.push(blockSize);
						pietUI.updateStack(stack);
					}
					functionToExecuteName="push";
					break;
				case $.equal(difference,[0,2]):
					functionToExecute=function(){
						//pop
						if(stack.length>0){
							stack.pop();
							pietUI.updateStack(stack)
						}
					}
					functionToExecuteName="pop";
					break;
				case $.equal(difference,[1,0]):
					functionToExecute=function(){
						//add
						if(stack.length>1){
							stack.push(stack.pop()+stack.pop());
							pietUI.updateStack(stack)
						}
					}
					functionToExecuteName="add";
					break;
				case $.equal(difference,[1,1]):
					functionToExecute=function(){
						//subtract
						if(stack.length>1){
							n1=stack.pop();
							n2=stack.pop();
							stack.push(n2-n1);
							pietUI.updateStack(stack)
						}
					}
					functionToExecuteName="subtract";
					break;
				case $.equal(difference,[1,2]):
					functionToExecute=function(){
						//multiply
						if(stack.length>1){
							stack.push(stack.pop()*stack.pop());
							pietUI.updateStack(stack)
						}
					}
					functionToExecuteName="multiply";
					break;
				case $.equal(difference,[2,0]):
					functionToExecute=function(){
						//divide
						if(stack.length>1){
							n1=stack.pop();
							n2=stack.pop();
							stack.push(n2/n1);
							pietUI.updateStack(stack)
						}
					}
					functionToExecuteName="divide";
					break;
				case $.equal(difference,[2,1]):
					functionToExecute=function(){
						//mod
						if(stack.length>1){
							n1=stack.pop();
							n2=stack.pop();
							stack.push(n2%n1);
							pietUI.updateStack(stack)
						}
					}
					functionToExecuteName="mod";
					break;
				case $.equal(difference,[2,2]):
					functionToExecute=function(){
						//not
						if(stack.length>0){
							n1=stack.pop();
							stack.push(!n1 ? 1 : 0);
							pietUI.updateStack(stack);
						}
					}
					functionToExecuteName="not";
					break;
				case $.equal(difference,[3,0]):
					functionToExecute=function(){
						//greater
						if(stack.length>1){
							n1=stack.pop();
							n2=stack.pop();
							stack.push((n2>n1)?1:0);
							pietUI.updateStack(stack);
						}
					}
					functionToExecuteName="greater";
					break;
				case $.equal(difference,[3,1]):
					functionToExecute=function(){
						//pointer
						if(stack.length>0){
							DP=DP+stack.pop()%4;
							while(DP<0){
								DP+=4;
							}
							pietUI.updateStack(stack)
						}
					}
					functionToExecuteName="pointer";
					break;
				case $.equal(difference,[3,2]):
					functionToExecute=function(){
						//switch
						if(stack.length>0){
							var n1=stack.pop()
							for(var i=0;i<n1;i++){
								CC=!CC;
							}
							pietUI.updateStack(stack)
						}
					}
					functionToExecuteName="switch";
					break;
				case $.equal(difference,[4,0]):
					functionToExecute=function(){
						//duplicate
						if(stack.length>0){
							var n1=stack.pop();
							stack.push(n1);
							stack.push(n1);
							pietUI.updateStack(stack)
						}
					}
					functionToExecuteName="duplicate";
					break;
				case $.equal(difference,[4,1]):
					functionToExecute=function(){
						//roll
						if(stack.length>1){
							n1=stack.pop();
							n2=stack.pop();
							for(var i=0;i<n1;i++){
								var el=stack.splice(-1,1);
								stack.splice(0-n2,0,el);
							}
							pietUI.updateStack(stack);
						}
					}
					functionToExecuteName="roll";
					break;
				case $.equal(difference,[4,2]):
					functionToExecute=function(){
						//in(num)
						if($("#input").value!="" && /^\d*$/.test($("#input").value)){
							stack.push($("#input").value.charAt(0));
							$("#input").value=$("#input").value.substr(1);
							pietUI.updateStack(stack);
						}else if($("#input").value==""){
							console.error("Error: nothing in STDIN");
						}else if(!/^\d*$/.test($("#input").value)){
							console.error($("input").value+" contains characters other than digits, including spaces");
						}else{
							console.error("Error: Input error");
						}
					}
					functionToExecuteName="in(num)";
					break;
				case $.equal(difference,[5,0]):
					functionToExecute=function(){
						//in(char)
						if($("input").value!=""){
							stack.push($("#input").value.charCodeAt(0))
							$("#input").value=$("#input").value.substr(1);
							pietUI.updateStack(stack);
						}else if($("#input").value==""){
							console.error("Error: nothing in STDIN");
						}else{
							console.error("Error: Input error");
						}
					}
					functionToExecuteName="in(char)";
					break;
				case $.equal(difference,[5,1]):
					functionToExecute=function(){
						//out(num)
						if(stack.length>0){
							$("#output").innerHTML+=stack.pop();
							pietUI.updateStack(stack);
						}
					}
					functionToExecuteName="out(num)";
					break;
				case $.equal(difference,[5,2]):
					functionToExecute=function(){
						//out(char)
						if(stack.length>0){
							$("#output").innerHTML+=String.fromCharCode(stack.pop());
							pietUI.updateStack(stack);
						}
					}
					functionToExecuteName="out(char)";
					break;
			}
			// anim3=new animDaemon(setInterval(function(){
			// 	var colorRGB=new Hex(grid[codel[0]][codel[1]]).toRGB().rgb;
			// 	colorRGB[0]=parseInt(Math.cos(x*frequency+5)*127+127,10);
			// 	colorRGB[1]=parseInt(Math.cos(x*frequency+5)*127+127,10);
			// 	colorRGB[2]=parseInt(Math.cos(x*frequency+5)*127+127,10);
			// 	x+=2/3;
			// 	canvasGrid.setSquare(codel[0],codel[1],color,new RGB("rgb("+colorRGB.join(",")+")").toHex())
			// 	return colorRGB
			// },25), codel);
			$("#nextOp").$("span")[0].innerHTML="Next Operation: "+functionToExecuteName;
		}else{
			nextDPPosition=DPPosition;
			wait++;
			$("#nextOp").$("span")[0].innerHTML="Next Operation: wait("+wait+")";
			if(wait%2==0){
				DP=DP+1%4;
			}else{
				CC=!CC;
			}
		}
	}
	function step(){
		if(started){
			functionToExecute.call()
			blockSize=1;
			// runFunction();//run function to executes
		}
		console.log(lastDPPosition, DPPosition, nextDPPosition)
		movePosition(DPPosition);//Program execution #1-2
		console.log(lastDPPosition, DPPosition, nextDPPosition)
		changeBlock();//Program Execution #3
		console.log(lastDPPosition, DPPosition, nextDPPosition)
	}
	function stop(){
		console.log(DPPosition,lastColor)
		clearInterval(anim.func)
		clearInterval(anim2.func)
		console.log(anim)
		canvasGrid.setSquare(anim.affecting[0],anim.affecting[1],lastColor,lastColor);
		canvasGrid.setSquare(anim2.affecting[0],anim2.affecting[1],lastColor,lastColor);
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