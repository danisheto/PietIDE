function sidebar(){
	document.getElementById("colors").onmousedown=function(e){
		color=window.getComputedStyle(e.target).getPropertyValue("background-color");
		colorName=e.target.id;
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
	// document.getElementById("zoom_in").parentNode.onmousedown=function(e){
	// 	context.clearRect(0,0,columns*columnSize*canvasZoom,rows*columnSize*canvasZoom);
	// 	canvasZoom*=1.1;
	// 	drawInit();
	// }
	// document.getElementById("zoom_out").parentNode.onmousedown=function(e){
	// 	context.clearRect(0,0,columns*columnSize*canvasZoom,rows*columnSize*canvasZoom);
	// 	canvasZoom/=1.1;
	// 	drawInit();
	// }
	document.getElementById("zoomSlide").getElementsByTagName("input")[0].onchange=function(e){
		var el=document.getElementById("zoomSlide").getElementsByTagName("input")[0];
		console.log(el)
		context.clearRect(0,0,columns*columnSize*canvasZoom,rows*columnSize*canvasZoom);
		canvasZoom*=el.value/100;
		drawInit();
	}
	document.getElementById("play").parentNode.onmousedown=function(e){
		
	}
	document.getElementById("step").parentNode.onmousedown=function(e){
		
	}
	document.getElementById("stop").parentNode.onmousedown=function(e){
		
	}
}