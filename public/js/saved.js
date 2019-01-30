
// function deletes a provider search when the user clicks the delete button
function deleteSearch (event) {
    event.stopPropagation();
    var id = $(this).data('id');
    $.ajax({
        method: 'DELETE',
        url: 'api/searches' + id
    }).then(getUserSavedSearch);
};