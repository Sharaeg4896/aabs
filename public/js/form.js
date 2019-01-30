/********************* Functions for form.html page *******************************/

/************ functions to make form reactive steps 1-3 ************/
//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$(".next").click(function(){
	
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	next_fs = $(this).parent().next();
	
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 500, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeOutQuint'
	});
});

$(".previous").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	//show the previous fieldset
	previous_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 500, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeOutQuint'
	});
});

/***************************** MRI or CT click Events for step 3 of the form *********************/
// Fires CT/MRI button is clicked  NEEDS FUNCTIONALITY
$('#mri').on('click', function() {
    console.log("MRI button clicked")
    getScan();
});

$('#ct').on('click', function() {
    console.log("CT button clicked")
    getScan();
})


function createScanRow(scanData) {
    console.log(scanData);
    let option = 0
    let scanFormCheck = $("<div class ='form-check'></div>");
    scanFormCheck
        .append("<input class='form-check-input' type='radio' name='exampleRadios' id='exampleRadios1' value=" + (option++) + "checked>")
        .append('<label class="form-check-label" for="exampleRadios1">' + 'CPT: ' + scanData.cpt + ' Description: ' + scanData.Description + '</label>');

    scanFormCheck.find('fs-subtitle'); 
    return scanFormCheck;
  };

function getScan() {
    $.get("/api/scans", function(data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createScanRow(data[i]));
      }
      renderScanList(rowsToAdd);

    });
  };


/************ functions to query CMS DB ************/

// grabs input values from steps 1 and 2 or 3 for query URL
let $city = $('#inputCity');
let $cpt = $('#inputCpt');

// fires off API request to CMS.gov
$('#requestCmsData').on('click', function (e){

    window.location.href = "/results?cpt=" + $cpt.val() + "&city=" + $city.val().trim().toUpperCase();
    
    
})

