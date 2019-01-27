$(document).ready(function() {
    // function to save search to db
    $('#toSave').on('click', () => {
        let userSaved = $(this).parent("td").parent("tr").data("author");
    });

    function saveSearch(providerData) {
        $.post('api/savedSearches', providerData)
        .then( 
            // disable save button
        )
    }
});


