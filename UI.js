var pietUI=(function(window,document,undefined){
	var cursorOffset=[];
	var sidebarOffset=[0,0];
	function init(){
		tabsInit();
		toolsInit();
		debugInit();
		colorPickerInit();
		if(window['localStorage']!=null){
			if(!!window.localStorage["dates"]){
				dates=JSON.parse(window.localStorage["dates"])
				lastDate=JSON.parse(localStorage.getItem(dates[dates.length-1]))
				sidebarOffset=lastDate.options.sidebarOffset;
				$("#primary").style.backgroundColor=lastDate.options.primary;
				$("#secondary").style.backgroundColor=lastDate.options.secondary;
				$("#"+lastDate.options.active).classList.add("active");
				$("#tools").$(".active")[0].classList.remove("active");
				$("#"+lastDate.options.tool).parentNode.classList.add('active');
				$("#zoomSlide").$("input")[0].value=lastDate.options.zoom*100;
				$("#zoomSlide").$("input")[0].onchange.call($("#zoomSlide").$("input")[0]);
				$("#save").classList.add("done")
				$("#sidebar").style.left=lastDate.options.sidebarOffset[0]+"px";
				$("#sidebar").style.top=lastDate.options.sidebarOffset[1]+"px";
			}else{
				userDefaults=JSON.parse(localStorage.getItem("userDefaults"));
				$("#primary").style.backgroundColor=userDefaults.primaryColor;
				$("#secondary").style.backgroundColor=userDefaults.secondaryColor;
				$("#colorPalette").$(".active")[0].classList.remove("active")
				$("#"+userDefaults.activeColor).classList.add("active");
				$("#tools").$(".active")[0].classList.remove("active");
				$("#"+userDefaults.tool).parentNode.classList.add('active');
				$("#zoomSlide").$("input")[0].value=userDefaults.zoom*100;
				$("#zoomSlide").$("input")[0].onchange.call($("#zoomSlide").$("input")[0]);
				$("#save").classList.add("done");
				sidebarOffset=[parseInt(userDefaults.sidebarOffset[0].slice(0,-2),10),parseInt(userDefaults.sidebarOffset[1].slice(0,-2),10)]
				$("#sidebar").style.left=userDefaults.sidebarOffset[0];
				$("#sidebar").style.top=userDefaults.sidebarOffset[1];
				$("#canvasHeight").value=userDefaults.size[0];
				$("#canvasWidth").value=userDefaults.size[1];
				//change display
				$("#userOptionDefaults").$("tr")[0].$("td")[1].innerHTML=userDefaults.zoom*100+"%";
				$("#userOptionDefaults").$("tr")[1].$("td")[1].innerHTML=userDefaults.tool;
				$("#userOptionDefaults").$("tr")[2].$("td")[1].innerHTML=userDefaults.primaryColor.toUpperCase();
				$("#userOptionDefaults").$("tr")[3].$("td")[1].innerHTML=userDefaults.secondaryColor.toUpperCase();
				$("#userOptionDefaults").$("tr")[4].$("td")[1].innerHTML=userDefaults.activeColor[0].toUpperCase()+userDefaults.activeColor.substring(1)
				$("#userOptionDefaults").$("tr")[5].$("td")[1].innerHTML=userDefaults.size[0]*userDefaults.size[1];
				$("#userOptionDefaults").$("tr")[6].$("td")[1].innerHTML=userDefaults.sidebarOffset.join(",");
				$("#userOptionDefaults").$("tr")[7].$("td")[1].innerHTML=userDefaults.canvasOffset.join(",");
			}
		}
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
			$("#colorPalette").$(".active")[0].classList.remove("active");+"px"
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
				canvasGrid.saveGrid(date,sidebarOffset);
				if(localStorage["dates"]){
					var dates=JSON.parse(localStorage.getItem("dates"));
				}else{
					var dates=[];
				}
				dates.push(date)
				if($("#loadOptions").childNodes.length>=1){
					var el=document.createElement("a");
					el.href="javascript:void(0)";
					el.textContent=date.slice(4,6)+"-"+date.slice(6,8)+"-"+date.slice(0,4)+" "+date.slice(8,10)+":"+date.slice(10,12)+":"+date.slice(12,14);
					el.dataset.date=date
					$("#loadOptions").appendChild(el)
				}
				localStorage.setItem("dates",JSON.stringify(dates));
				$("#save").classList.remove("running");
				$("#save").classList.add("done");
			}
		}
		$("#load").parentNode.onmousedown=function(e){
			if($("#loadOptions").childNodes.length<1){
				$("#settingOptions").style.display=""
				$("#load").classList.add("active");
				$("#load").parentNode.classList.add('active');
				$("#settings").parentNode.classList.remove("active");
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
				$(".arrow-up")[0].style.left="57.5%";
				$(".arrow-up")[0].style.visibility="inherit"
			}else{
				$("#load").classList.remove("active")
				$("#load").parentNode.classList.remove("active")
				$("#loadOptions").style.display="";
				while($("#loadOptions").lastChild){
					$("#loadOptions").removeChild($("#loadOptions").lastChild)
				}
				document.onmousedown=null;
				$(".arrow-up")[0].style.left="";
				$(".arrow-up")[0].style.visibility="";
			}
		}
		$("#loadOptions").onmousedown=function(e){
			if(e.target.tagName.toLowerCase()=="a"){
				var option=JSON.parse(localStorage.getItem(e.target.dataset.date));
				var grid=option.grid;
				for(var i=0;i<grid.length;i++){
					for(var j=0;j<grid[i].length;j++){
						canvasGrid.setSquare(i,j,grid[i][j])
					}
				}
				canvasGrid.setZoom(option.zoom);
				$("#primary").style.backgroundColor=option.options.primary;
				$("#secondary").style.backgroundColor=option.options.secondary;
				$("#"+option.options.active).classList.add("active");
				canvasGrid.setColor(window.getComputedStyle($("#"+option.options.active)).getPropertyValue("background-color"));
				canvasGrid.setTool(option.options.tool);
				$("#tools").$(".active")[0].classList.remove("active");
				$("#"+option.options.tool).parentNode.classList.add('active');
				console.log($("#zoomSlide").$("input"))
				canvasGrid.setZoom(option.options.zoom);
				$("#zoomSlide").$("input")[0].value=option.options.zoom*100;
				$("#zoomSlide").$("input")[0].onchange.call($("#zoomSlide").$("input")[0]);
				$("#save").classList.add("done")
				canvasGrid.move(option.options.canvasOffset[0],option.options.canvasOffset[1]);
				$("#sidebar").style.left=option.options.sidebarOffset[0]+"px";
				$("#sidebar").style.top=option.options.sidebarOffset[1]+"px";
				document.onmousedown=null;
				$("#load").parentNode.onmousedown.call();
			}
		}
		$("#settings").parentNode.onmousedown=function(e){
			if($("#settingOptions").style.display==""){
				$("#settingOptions").style.display="block";
				$("#loadOptions").style.display="";
				$("#load").classList.remove("active");
				$("#load").parentNode.classList.remove("active");
				$(".arrow-up")[0].style.left="80%";
				$(".arrow-up")[0].style.visibility="inherit";
				$("#settings").parentNode.classList.add("active");
				$("#load").classList.remove("active")
				$("#load").parentNode.classList.remove("active")
				$("#loadOptions").style.display="";
				while($("#loadOptions").lastChild){
					$("#loadOptions").removeChild($("#loadOptions").lastChild)
				}
				document.onmousedown=null;
				$(".arrow-up")[0].style.left="";
				$(".arrow-up")[0].style.visibility="";
			}else{
				$("#settingOptions").style.display="";
				$(".arrow-up")[0].style.left="";
				$(".arrow-up")[0].style.visibility="";
				$("#settings").parentNode.classList.remove("active");
			}
		}
		$("#restoreDefaults").onclick=function(e){
			canvasGrid.setZoom(1);
			$("#zoomLevel").innerHTML="Zoom: 100%";
			$("#zoomSlide").$("input")[0].value="100";
			canvasGrid.setTool("brush");
			$("#tools").$(".active")[0].classList.remove("active");
			$("#brush").parentNode.classList.add("active");
			canvasGrid.setColor("#000000");
			$("#primary").style.backgroundColor="";
			$("#secondary").style.backgroundColor="";
			$("#colorPalette").$(".active")[0].classList.remove("active");
			$("#sidebarTabs").$(".active")[0].classList.remove("active");
			Array.prototype.slice.call($("#sidebar").children).filter(function(value, index, array){return value.classList.contains("active")})[0].classList.remove("active")
			$("#primary").classList.add('active');
			$("#settingOptions").style.display="";
			$("#file").$(".active")[0].classList.remove('active');
		}
		$("#restoreUserDefaults").onclick=function(e){
			var userDefaults=JSON.parse(localStorage.getItem("userDefaults"))
			canvasGrid.setZoom(userDefaults.zoom);
			$("#zoomLevel").innerHTML="Zoom: "+userDefaults.zoom*100+"%";
			$("#zoomSlide").$("input")[0].value=userDefaults.zoom*100;
			canvasGrid.setTool(userDefaults.tool);
			$("#tools").$(".active")[0].classList.remove("active");
			$("#"+userDefaults.tool).parentNode.classList.add("active");
			$("#colorPalette").$(".active")[0].classList.remove("active");
			canvasGrid.setColor(userDefaults[userDefaults.activeColor+"Color"]);
			$("#"+userDefaults.activeColor).classList.add('active');
			console.log(userDefaults.secondaryColor)
			$("#primary").style.backgroundColor=userDefaults.primaryColor;
			$("#secondary").style.backgroundColor=userDefaults.secondaryColor;
			$("#sidebar").style.left=userDefaults.sidebarOffset[0];
			$("#sidebar").style.top=userDefaults.sidebarOffset[1];
			canvasGrid.changeSize(userDefaults.size)
			$("#canvasHeight").value=userDefaults.size[0];
			$("#canvasWidth").value=userDefaults.size[1];
		}
		$("#saveUserDefaults").onclick=function(e){
			var userDefaults={
				"zoom":canvasGrid.getZoom(),
				"tool":canvasGrid.getTool(),
				"primaryColor":new RGB(window.getComputedStyle($("#primary")).getPropertyValue("background-color")).toHex(),
				"secondaryColor":new RGB(window.getComputedStyle($("#secondary")).getPropertyValue("background-color")).toHex(),
				"activeColor":"primary",
				"size":canvasGrid.getSize(),
				"sidebarOffset":[$("#sidebar").style.left || 0, $("#sidebar").style.top || 0],
				"canvasOffset":[$("#canvas").style.left || 0, $("#canvas").style.top || 0]
			}
			if(canvasGrid.getCurrentColor()!=userDefaults.primaryColor){
				userDefaults.activeColor="secondary"
			}
			localStorage.setItem("userDefaults",JSON.stringify(userDefaults))
			//change display
			$("#userOptionDefaults").$("tr")[0].$("td")[1].innerHTML=userDefaults.zoom*100+"%";
			$("#userOptionDefaults").$("tr")[1].$("td")[1].innerHTML=userDefaults.tool;
			$("#userOptionDefaults").$("tr")[2].$("td")[1].innerHTML=userDefaults.primaryColor.toUpperCase();
			$("#userOptionDefaults").$("tr")[3].$("td")[1].innerHTML=userDefaults.secondaryColor.toUpperCase();
			$("#userOptionDefaults").$("tr")[4].$("td")[1].innerHTML=userDefaults.activeColor[0].toUpperCase()+userDefaults.activeColor.substring(1)
			$("#userOptionDefaults").$("tr")[5].$("td")[1].innerHTML=userDefaults.size[0]*userDefaults.size[1];
			$("#userOptionDefaults").$("tr")[6].$("td")[1].innerHTML=userDefaults.sidebarOffset[0].slice(0,-2)+","+userDefaults.sidebarOffset[1].slice(0,-2)
			$("#userOptionDefaults").$("tr")[7].$("td")[1].innerHTML=userDefaults.canvasOffset[0].slice(0,-2)+","+userDefaults.canvasOffset[1].slice(0,-2)
		}
		$("#changeSize").onclick=function(e){
			var newSize=[];
			newSize[0]=parseInt($("#canvasWidth").value,10);
			newSize[1]=parseInt($("#canvasHeight").value,10);
			canvasGrid.changeSize(newSize)
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
			if(canvasGrid.getTool()=="pan" && e.target.parentNode && (e.target.parentNode.id=="sidebar" || e.target.parentNode.parentNode.id=="sidebar")){
				cursorOffset=[e.pageX,e.pageY];
				document.body.style.cursor="move"
			}
		}
		document.onmousemove=function(e){
			if(!!cursorOffset[0]){
				$("#sidebar").style.left=(e.pageX-cursorOffset[0]+sidebarOffset[0])+"px";
				$("#sidebar").style.top=(e.pageY-cursorOffset[1]+sidebarOffset[1])+"px";
			}
		}
		$("#sidebar").onmouseup=function(e){
			if(!!cursorOffset[0]){
				sidebarOffset=[parseInt(this.style.left.slice(0,-2)) || 0,parseInt(this.style.top.slice(0,-2)) || 0]
				cursorOffset=[]
				document.body.style.cursor="";
			}
		}
		$("#optionsDefaultTab").onmousedown=function(){
			$("#settingsTabs").$(".active")[0].classList.remove("active");
			$("#settingOptions").$(".active")[0].classList.remove("active")
			this.classList.add("active");
			$("#optionDefaults").classList.add("active");
		}
		$("#optionUserDefaultTab").onmousedown=function(){
			$("#settingsTabs").$(".active")[0].classList.remove("active");
			$("#settingOptions").$(".active")[0].classList.remove("active")
			this.classList.add("active");
			$("#userOptionDefaults").classList.add("active");
		}
		$("#optionSizeTab").onmousedown=function(){
			$("#settingsTabs").$(".active")[0].classList.remove("active");
			$("#settingOptions").$(".active")[0].classList.remove("active")
			this.classList.add("active");
			$("#optionSize").classList.add("active");
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