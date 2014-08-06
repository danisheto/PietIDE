var pietUI=(function(window,document,undefined){
	var cursorOffset=[];
	var sidebarOffset=[0,0];
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
		//also includes file and zoomSlider
		$("#new").parentNode.onmousedown=function(){
			$("#save").parentNode.onmousedown.call($("#save").parentNode);
			canvasGrid.resetGrid();
			canvasGrid.initCanvas();
		}
		$("#save").parentNode.onmousedown=function(e){
			if(!this.classList.contains("done") || !this.classList.contains("running")){
				$("#save").classList.add("running");
				var date=new Date();
				date=("0000"+date.getFullYear()).slice(-4)+("0"+date.getMonth()).slice(-2)+("0"+date.getDate()).slice(-2)+("0"+date.getHours()).slice(-2)+("0"+date.getMinutes()).slice(-2)+("0"+date.getSeconds()).slice(-2)
				canvasGrid.save(date);
				if(localStorage["dates"]){
					var dates=JSON.parse(localStorage.getItem("dates"));
				}else{
					var dates=[];
				}
				dates.push(date)
				localStorage.setItem("dates",JSON.stringify(dates));
				$("#save").classList.remove("running");
				$("#save").classList.add("done")
			}
		}
		$("#load").parentNode.onmousedown=function(e){
			if($("#loadOptions").childNodes.length<1){
				$("#load").classList.add("active");
				dates=JSON.parse(localStorage.getItem("dates"));
				if(!!dates){
					for(var i=0;i<dates.length;i++){
						var el=document.createElement("a");
						el.href="javascript:void(0)";
						el.textContent=dates[i].slice(4,6)+"-"+dates[i].slice(6,8)+"-"+dates[i].slice(0,4)+" "+dates[i].slice(8,10)+":"+dates[i].slice(10,12)+":"+dates[i].slice(12,14);
						el.dataset.date=dates[i]
						$("#loadOptions").appendChild(el)
					}
				}else{
					$("#loadOptions").textContent="none"
				}
				$("#loadOptions").style.display="block";
				document.onmousedown=function(e){
					if(e.target.id!="loadOptions" && e.target.parentNode.id!="loadOptions" && e.target.childNodes!=$("#load").parentNode.childNodes && e.target.parentNode.childNodes!= $("#load").parentNode.childNodes){
						console.log($("#load").parentNode.onmousedown)
						$("#load").parentNode.onmousedown.call(this);
					}
				}
			}else{
				$("#load").classList.remove("active")
				$("#loadOptions").style.display="";
				while($("#loadOptions").lastChild){
					$("#loadOptions").removeChild($("#loadOptions").lastChild)
				}
				document.onmousedown=null;
			}
		}
		$("#loadOptions").onmousedown=function(e){
			console.log(e.target.tagName)
			if(e.target.tagName.toLowerCase()=="a"){
				grid=JSON.parse(localStorage.getItem(e.target.dataset.date)).grid;
				for(var i=0;i<grid.length;i++){
					for(var j=0;j<grid[i].length;j++){
						canvasGrid.setSquare(i,j,grid[i][j])
					}
				}
				$("#save").classList.add("done")
				document.onmousedown=null;
				$("#load").parentNode.onmousedown.call();
			}
		}
		var zoomValues=[0.1,0.25,0.5,0.75,1,1.25,1.5,1.75,2,2.5,3,4,5];
		function changeActive(e,el){
			if(!el.classList.contains("active")){
				$("#tools").$(".active")[0].classList.remove("active");
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
		$("#sidebar").onmousedown=function(e){
			if(canvasGrid.getTool()=="pan" && (e.target.parentNode.id=="sidebar" || e.target.parentNode.parentNode.id=="sidebar")){
				cursorOffset=[e.pageX,e.pageY];
				document.body.style.cursor="move"
			}
		}
		document.onmousemove=function(e){
			if(!!cursorOffset[0]){
				$("#sidebar").style.left=(e.pageX-cursorOffset[0]+sidebarOffset[0])+"px";
				$("#sidebar").style.top=(e.pageY-cursorOffset[1]+sidebarOffset[1])+"px";
				console.log(sidebarOffset)

			}
		}
		$("#sidebar").onmouseup=function(e){
			if(!!cursorOffset[0]){
				sidebarOffset=[parseInt(this.style.left.slice(0,-2)) || 0,parseInt(this.style.top.slice(0,-2)) || 0]
				cursorOffset=[]
				document.body.style.cursor="";
			}
		}
	}
	function setColorActive(color){
		$("#colorPalette").$(".active")[0].style.backgroundColor=color;
	}
	function updateStack(stack){
		$("#stack").innerHTML="";
		for(var i=stack.length-1;i>=0;i--){
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