
/**
@Author Nick Deis
**/

/** Make long dropdowns into data lists
@requires Jquery
@param Number:tolerance  How long should a drop down be before it's turned into a datalist?
**/
function LongSelects2DataLists(tolerance){
  var nl = document.querySelectorAll('select');
  for(var i=0; i < nl.length;++i){
    var onl = nl[i].querySelectorAll('option');
    if(tolerance <=  onl.length){
      var dl = document.createElement('datalist');
      var optionList = jQuery(onl).clone();
      //Text content to value, since we want it to display in the datalist
      optionList.each(function(index){
          this.value = this.textContent;
      });
        jQuery(dl).append(optionList);
      //transfer attributes
      jQuery(dl).attr(
        {
          id : jQuery(nl[i]).attr('id') + "copy",
        tabIndex : jQuery(nl[i]).attr('tabIndex'),
        class : jQuery(nl[i]).attr('class'),
        name : jQuery(nl[i]).attr('name') + "copy"       
       }     
      );
      jQuery(nl[i]).after(dl);
      var inp = document.createElement('input');
      jQuery(inp).attr({
        name : jQuery(nl[i]).attr('name') + "copy",
        list : jQuery(nl[i]).attr('id') + "copy",
        class : jQuery(nl[i]).attr('class'),
        //gets the width from the old list for a more natural look and responsiveness
        style : "width:"+jQuery(nl[i]).width() + "px"
      });
      jQuery(dl).before(inp);
      var selVal = nl[i].value;
      jQuery(nl[i]).hide();
      //Set the default value for the mapped list
      jQuery(inp).val(jQuery("#"+nl[i].id+' > option[value="'+jQuery(nl[i]).val()+'"]').text());
      //create listener on datalist on change, this will change the original on change to the first
      jQuery(inp).change(function(){
        var oldListID = jQuery(this).attr("list").replace("copy","");
        var oldList$ = jQuery("#"+oldListID);
        var mappedOption = jQuery("#"+oldListID+' > option:contains("'+jQuery(this).val()+'")');
        oldList$.val(mappedOption.attr("value"));
      });
    }
  }
}
\