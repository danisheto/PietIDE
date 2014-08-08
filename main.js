window.onload=function(){
	if(!!localStorage && !localStorage.getItem("userDefaults")){
		var userDefaults={
			"zoom":1,
			"tool":"brush",
			"primaryColor":"#000000",
			"secondaryColor":"#FFFFFF",
			"activeColor":"primary",
			"size":[20,20],
			"sidebarOffset":[0,0],
			"canvasOffset":[0,0]
		}
		localStorage.setItem("userDefaults",JSON.stringify(userDefaults))
	}
	canvasGrid.init();
	pietUI.init();
	interpreter.init();
}