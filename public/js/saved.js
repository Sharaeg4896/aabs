$(document).ready(function() {
    // Save button to save CPT code record search
    $(".toDelete").on("click", function(event) {

        var dataID = $(this).attr('id');
        console.log(dataID);

        $.ajax({
            method: "DELETE",
            url: "/savedSearches/" + dataID
        })
            .then(function() {
             console.log("Save search deleted");
             location.reload();
            });


    //  var providerName = dataRow[0].cells[0].innerText;
    //  var providerAddress = dataRow[0].cells[1].innerText;
    //  var providerCharged = dataRow[0].cells[2].innerText;
    //  var medicareAllowed = dataRow[0].cells[3].innerText;
    //  var medicarePaid = dataRow[0].cells[4].innerText;
    //  var nationalAverage = dataRow[0].cells[5].innerText;
 
    //  var newSavedSearch = {
    //      providerName: providerName,
    //      providerAddress: providerAddress,
    //      providerCharged: providerCharged,
    //      medicareAllowed: medicareAllowed,
    //      medicarePaid: medicarePaid,
    //      nationalAverage: nationalAverage
    //  };

    //  // Delete in production
    //  console.log(newSavedSearch);
   
    //  // Send the POST request
    //  $.ajax("/savedSearches", {
    //      type: "POST",
    //      data: newSavedSearch
    //    }).then(
    //      function() {
    //        console.log("Search result saved");
    //        // Reload the page to get the updated list
    //         location.reload();
    //      }
    //    );
     });
});











// // function deletes a provider search when the user clicks the delete button
// function deleteSearch (event) {
//     event.stopPropagation();
//     var id = $(this).data('id');
//     $.ajax("/savedSearches", {
//         type: "POST",
//         data: newSavedSearch
//       }).then(
//         function() {
//           console.log("Search result saved");
//           // Reload the page to get the updated list
//            location.reload();
//         }
//       );
//     });
// };
