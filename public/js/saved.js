$(document).ready(function() {
    // Save button to save CPT code record search
    $(".toDelete").on("click", function(event) {

        var dataID = $(this).attr('id');
        console.log(dataID);

        $.ajax({
            method: "DELETE",
            url: "/savedSearches/" + dataID
        }).then(function() {
             console.log("Save search deleted");
             location.reload();
        });
    });
});


