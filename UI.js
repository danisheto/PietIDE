var pietUI=(function(window,document,undefined){
	function init(){
		tabsInit();
		toolsInit();
		debugInit();
		colorPickerInit();
	}
	function colorPickerInit(){
		$("#colors").onmousedown=function(e){
			$("#colorPalette").$(".active")[0].style.backgroundColor=canvasGrid.setColor(window.getComputedStyle(e.target).getPropertyValue("background-color"));
		}
		$("#W").onmousedown=function(e){
			$("#colorPalette").$(".active")[0].style.backgroundColor=canvasGrid.setColor("#FFFFFF");
		}
		$("#Black").onmousedown=function(e){
			$("#colorPalette").$(".active")[0].style.backgroundColor=canvasGrid.setColor("#000000");
		}
		$("#secondary").onmousedown=function(e){
			$("#colorPalette").$(".active")[0].classList.remove("active");
			this.classList.add("active");
			$("#colorPalette").$(".active")[0].style.backgroundColor=canvasGrid.setColor(window.getComputedStyle(this).getPropertyValue("background-color"));
		}
		$("#primary").onmousedown=function(e){
			$("#colorPalette").$(".active")[0].classList.remove("active");
			this.classList.add("active")
			$("#colorPalette").$(".active")[0].style.backgroundColor=canvasGrid.setColor(window.getComputedStyle(this).getPropertyValue("background-color"));
		}
		$("#commands").onmousedown=function(e){
			if(canvasGrid.getColor()!="#000000" && canvasGrid.getColor().toLowerCase()!="#FFFFFF"){
				command=e.target.id.slice(-2).split("");
				colorValue=[];
				//check if contains red
				if(canvasGrid.getColor().slice(1,3).search(/[Ff].*/g)>-1 || canvasGrid.getColor().search(/#[cC]0[^fF]{4}/)>-1){
					colorValue=[0]
				}
				//check if contains green
				if(canvasGrid.getColor().slice(3,5).search(/[Ff].*/g)>-1 || canvasGrid.getColor().search(/#[^fF]{2}[cC]0[^fF]{2}/)>-1){
					//and mixes if already contains a color
					if(colorValue[0]==0){
						colorValue[0]++;
					}else{
						colorValue[0]=2;
					}
				}
				//check if contains blue
				if(canvasGrid.getColor().slice(5,7).search(/[fF]{2}/)>-1 || canvasGrid.getColor().search(/#[^fF]{4}[cC]0/)>-1){
					//and mixes if already contains a color
					if(colorValue[0]==2){
						colorValue[0]++;
					}else if(colorValue[0]==0){
						colorValue[0]=5;
					}else{
						colorValue[0]=4;
					}
				}
				if(canvasGrid.getColor().search(/#.*[0Ff]{6}.*/g)>-1){
					colorValue[1]=1
				}else if(canvasGrid.getColor().search(/#.*[0Cc]{6}.*/g)>-1){
					colorValue[1]=2
				}else{
					colorValue[1]=0
				}
				colorValue[0]+=parseInt(command[0],10);
				colorValue[1]+=parseInt(command[1],10);
				colorValue[0]%=6;
				colorValue[1]%=3;
				$("#colorPalette").$(".active")[0].style.backgroundColor=canvasGrid.setColor(window.getComputedStyle($("#colors").$("tr")[colorValue[0]].$("td")[colorValue[1]]).getPropertyValue("background-color"))
			}
		}
	}
	function toolsInit(){
		//also includes zoomSlider
		var zoomValues=[0.1,0.25,0.5,0.75,1,1.25,1.5,1.75,2,2.5,3,4,5];
		function changeActive(e,el){
			if(!el.classList.contains("active")){
				$("#fileTabContent").$(".active")[0].classList.remove("active");
				el.classList.add("active")
			}
		}
		$("#brush").parentNode.onmousedown=function(e){
			changeActive(e,this);
			canvasGrid.setTool("brush");
		}
		$("#bucket").parentNode.onmousedown=function(e){
			changeActive(e,this);
			canvasGrid.setTool("bucket");
		}
		$("#eyedropper").parentNode.onmousedown=function(e){
			changeActive(e,this);
			canvasGrid.setTool("eyedropper");
		}
		$("#pan").parentNode.onmousedown=function(e){
			changeActive(e,this);
			canvasGrid.setTool("pan");
		}
		$("#zoom_in").parentNode.onmousedown=function(e){
			for(var i=0;i<zoomValues.length;i++){
				if(zoomValues[i]>canvasGrid.getZoom()){
					canvasGrid.setZoom(zoomValues[i]);
					$("#zoomLevel").innerHTML="Zoom: "+zoomValues[i]*100+"%";
					$("#zoomSlide").$("input")[0].value=zoomValues[i]*100;
					break;
				}
			}
			canvasGrid.initCanvas();
		}
		$("#zoom_out").parentNode.onmousedown=function(e){
			for(var i=zoomValues.length;i>0;i--){
				if(zoomValues[i]<canvasGrid.getZoom()){
					canvasGrid.setZoom(zoomValues[i]);
					$("#zoomLevel").innerHTML="Zoom: "+zoomValues[i]*100+"%";
					$("#zoomSlide").$("input")[0].value=zoomValues[i]*100;
					break;
				}
			}
			canvasGrid.initCanvas();
		}
		$("#zoomSlide").$("input")[0].onchange=function(e){
			canvasGrid.setZoom(this.value/100);
			$("#zoomLevel").innerHTML="Zoom: "+this.value+"%";
			canvasGrid.initCanvas();
		}
	}
	function debugInit(){
		// $("#play").parentNode.onmousedown=function(){
		// 	while($("step").parent.onmousedown.call()){}
		// }
		$("#step").parentNode.onmousedown=function(){
			return interpreter.step();
		}
		$("#stop").parentNode.onmousedown=function(){
			interpreter.stop();
		}
	}
	function tabsInit(){
		//reduce later using class active to remove active class
		$("#colorsTab").onmousedown=function(e){
			$("#colorsTabContent").classList.add("active");
			$("#fileTabContent").classList.remove("active");
			$("#debugTabContent").classList.remove("active");
			$("#colorsTab").classList.add("active");
			$("#fileTab").classList.remove("active");
			$("#debugTab").classList.remove("active");
		}
		$("#fileTab").onmousedown=function(e){
			$("#colorsTabContent").classList.remove("active");
			$("#fileTabContent").classList.add("active")
			$("#debugTabContent").classList.remove("active")
			$("#colorsTab").classList.remove("active");
			$("#fileTab").classList.add("active")
			$("#debugTab").classList.remove("active")
		}
		$("#debugTab").onmousedown=function(e){
			$("#colorsTabContent").classList.remove("active");
			$("#fileTabContent").classList.remove("active")
			$("#debugTabContent").classList.add("active")
			$("#colorsTab").classList.remove("active");
			$("#fileTab").classList.remove("active")
			$("#debugTab").classList.add("active")
		}
	}
	function setColorActive(color){
		$("#colorPalette").$(".active")[0].style.backgroundColor=color;
	};
	return {
		init:function(){
			init();
		},
		setColorActive:function(color){
			setColorActive(color);
		}
	}
})(window,document)