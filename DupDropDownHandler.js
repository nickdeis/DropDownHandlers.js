/** BSD Style 
Author: Nick Deis
Description: Maps a dropdown with duplicate descriptions (but different values)
**/


//General Utilities
//My CSSCopier function, I do this so often that I made it a function
//Only really copies style and class for now
//#TODO: DRY refactoring
function CSSCopier(FromElement,ToElement){
	ToElement.setAttribute("style",FromElement.getAttribute("style"));
	ToElement.setAttribute("class",FromElement.getAttribute("class"));
	ToElement.setAttribute("id",FromElement.getAttribute("class")+"Copy");
}




function DupDropDownStrategizer(sele) {
	  var opts = sele.querySelectorAll('option');
	  this.DupOptArr = [];
	  this.hasDups = null;
	  
	  //DupOption describes a each option in the possible
	  //options in the dropdown
	  function DupOption(textContent, value) {
	    this.textContent = textContent
	    this.value = [];
	    this.value.push(value);
	    this.count = 1;
	  }
	  //Begin construction
	
	  var firstRes = null;
	  for (var i = 0; i < opts.length; ++i) {
	    var tmpTxt = jQuery.trim(opts[i].textContent);
	      if (firstRes != tmpTxt) {
	        if (dupopt != null) this.DupOptArr.push(dupopt);
	        var dupopt = new DupOption(tmpTxt, opts[i].value);
	        firstRes = tmpTxt;
	      } else {
	        dupopt.value.push(opts[i].value);
	        dupopt.count = dupopt.count + 1;
	        if (this.hasDups === null) this.hasDups = true;
	      }
	  }
	  //final push
	  this.DupOptArr.push(dupopt);
	  //end construction  
}

//@param strategy -> Output from DupDropDownStrategizer
//@param sele -> Selected select element
//Note: Feel free to override CSSCopier

function DupDropDownMap(strategy,sele){ 
	//Create a new select element
	var newsele = document.createElement("select");
	CSSCopier(sele,newsele);
	//#HERE: Move options over, but not names or values
	for(var i=0;i < strategy.DupOptArr.length;++i){	
		var opt = document.createElement("option");
		opt.textContent = strategy.DupOptArr[i].textContent;
		newsele.appendChild(opt);
	}
	//old select becomes multiple selector, which we then hide, and shove our new selector
	sele.setAttribute("multiple","");
	jQuery(sele).hide();
	//append the new selector after the old one
	jQuery(sele).after(newsele);
	
	//Run the mapping on the currently selected item
	
	//#TODO: Refactor this DRY fix obviously
	function MapSwitcher(newsele,sele){
		var selectedOpt = jQuery("#"+newsele.id+" option:selected")[0].textContent;
		jQuery("#"+sele.id+" option:selected").removeAttr("selected");
		//for null options
		if(selectedOpt.length > 0){
		jQuery('#'+sele.id+' > option:contains("'+selectedOpt+'")').each(function(idx){
			jQuery(this).prop("selected",true);
			});
		}
	}
	
	MapSwitcher(newsele,sele);
	//Now to bind the new select element to an for switches in select
	jQuery(newsele).change(function(){MapSwitcher(newsele,sele);});


}

//Main handler
function DupDropDownHandler(selectElement){
	this.sele = selectElement;
	this.strategy = new DupDropDownStrategizer(this.sele);
	if(this.strategy.hasDups) new DupDropDownMap(this.strategy,this.sele);	
}




