window.onload=function(){
	var canvas=document.getElementById('canvas'),
		context=canvas.getContext("2d"),
		canvasSize=200,
		canvasZoom=1,
		columnSize=20;
	drawInit();
	function drawInit(){
		context.lineWidth=1;
		context.beginPath();
		for(var i=columnSize;i<canvasSize;i+=columnSize){
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
			context.beginPath();
			context.rect(square[0]*20+0.5,square[1]*20+0.5,20,20);
			context.fillStyle="#000000";
			context.fill();
			context.stroke();
		}
	}
}