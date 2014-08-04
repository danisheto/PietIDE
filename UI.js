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
			if(canvasGrid.getCurrentColor()!="#000000" && canvasGrid.getCurrentColor().toLowerCase()!="#FFFFFF"){
				command=e.target.id.slice(-2).split("");
				colorValue=canvasGrid.getColorDetails(canvasGrid.getCurrentColor());
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
	}
	function updateStack(stack){
		$("#stack").innerHTML="";
		for(var i=stack.length;i>0;i--){
			$("#stack").innerHTML+="<div>"+stack[i]+"</div>";
		}
	}
	return {
		init:function(){
			init();
		},
		setColorActive:function(color){
			setColorActive(color);
		},
		updateStack:function(stack){
			updateStack(stack);
		}
	}
})(window,document)