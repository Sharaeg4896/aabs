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
    
    // $city.val().trim().toUpperCase();
    // $cpt.val();
    // $.ajax({
    //     url: "sharae?cpt=" + $cpt.val() + "&city=" + $city.val().trim().toUpperCase() ,
    //     type: "GET"
    // })
    
    
})

function dataResponse() {

    $.ajax({
        url: "https://data.cms.gov/resource/4hzz-sw77.json?nppes_provider_city=" + $city.val().trim().toUpperCase() + "&hcpcs_code=" + $cpt.val() + "&$order=average_medicare_allowed_amt",
        type: "post",
        data: {
            "$limit" : 20,
            "$$app_token" : 'FySBuoMt6fWdfjNhCEnX93Lq3'
        }
    }).done(function(data) {
		
      
      if (data.length == 0) {
        alert("No charges currently available for this CPT in that area");
        
      } else {
        alert("Retrieved " + data.length + " records from the dataset!");
      }
      console.log(data);
      createResultsTable(data);
      createTableRow(data);
      
      
    });
    
};

function createResultsTable(data) {
    let $providerSearchResults = $('.providerSeachResults');
    let $h2 = $('<h2>CPT:</h2>');
    let $tableHead = $('<thead></thead>');
    let $tableRow = $('<tr></tr>');
    let $providerNameTh = $('<th scope="col">Provider Name</th>'); 
    let $providerAddressTh= $('<th scope="col">Provider Address</th>');
    let $providerChargedTh= $('<th scope="col">Provider Charged</th>');
    let $medicareAllowedTh= $('<th scope="col">Medicare Allowed Amount</th>');
    let $medicarePaidTh= $('<th scope="col">Medicare Paid</th>');
    let $nationalAverageTh= $('<th scope="col">Standardized Average</th>');
    let $saveCb = $('<th scope="col" id="toSave">Save</th>');
    let $tableBody = $('<tbody></tbody>');

    $tableHead
        .append($tableRow)
        .append($providerNameTh)
        .append($providerAddressTh)
        .append($providerChargedTh)
        .append($medicareAllowedTh)
        .append($medicarePaidTh)
        .append($nationalAverageTh)
        .append($saveCb);
    

    $providerSearchResults
        .append($h2)
        .append($tableHead)
        .append($tableBody);
    
    data.forEach(function(dataItem){
        console.log('This is provider:' + dataItem.nppes_provider_first_name + ' ' + dataItem.nppes_provider_last_org_name);
        createTableRow(dataItem);
    });
    
};

function createTableRow(data){
    let $tableRow1= $('<tr></tr>');
    let $name = $('<td>' + data.nppes_provider_first_name + ' ' + data.nppes_provider_last_org_name + '</td>');
    let $address = $('<td>' + data.nppes_provider_street1 + ' ' + data.nppes_provider_state + ' ' + data.nppes_provider_city + '</td>');
    let $charged = $('<td>' + data.average_submitted_chrg_amt + '</td>');
    let $allowed = $('<td>' + data.average_medicare_allowed_amt + '</td>');
    let $paid = $('<td>' + data.average_medicare_payment_amt + '</td>');
    let $average = $('<td>' + data.average_medicare_standard_amt + '</td>');
    let $saveInfo = $('<button class="toSave">Save</button>');

    $tableRow1
        .append($name)
        .append($address)
        .append($charged)
        .append($allowed)
        .append($paid)
        .append($average)
        .append($saveInfo);
    
    $('body').append($tableRow1);


};


// REFACTORING- creating object for rendering results on the saved pages.
// .then(function(data) {
//     let resultsObj {
//         data.nppes_provider_first_name + data.nppes_provider_last_org_name,
//         data.nppes_provider_street1 + data.nppes_provider_state  + data.nppes_provider_zip,
//         data.average_submitted_chrg_amt,
//         data.average_medicare_payment_amt,
//         data.average_medicare_standard_amt,
//     }
        
//     data.forEach(function(resultsObj){
//         console.log('This is provider:' + dataItem.nppes_provider_first_name + ' ' + dataItem.nppes_provider_last_org_name);
//         createTableRow(dataItem);
      
//     if (data.length == 0) {
//       alert("No charges currently available for this CPT in that area");
      
//     } else {
//       alert("Retrieved " + data.length + " records from the dataset!");
//     }
//     console.log(data);
//     createResultsTable(data);
//     createTableRow(data);
    
    
//   });
  
// };