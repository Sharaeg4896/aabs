
// function to get saved searches from mySQL
function getUserSavedSearch() {
    $.get("/api/savedsearches", function(data){
        let searches = data;
        createResultsTable();
        // but delete button gets created *missing functionality*
        createTableRow();
    })
};

function createResultsTable(data) {
    let $userSavedSearches = $('#userSavedSearches');
    let $tableHead = $('<thead></thead>');
    let $tableRow = $('<tr></tr>');
    let $userSavedCptTh = $('<th scope="col">CPT</th>')
    let $providerNameTh = $('<th scope="col">Provider Name</th>'); 
    let $providerAddressTh= $('<th scope="col">Provider Address</th>');
    let $providerChargedTh= $('<th scope="col">Provider Charged</th>');
    let $medicareAllowedTh= $('<th scope="col">Medicare Allowed Amount</th>');
    let $medicarePaidTh= $('<th scope="col">Medicare Paid</th>');
    let $nationalAverageTh= $('<th scope="col">Standardized Average</th>');
    let $saveCb = $('<th scope="col" id="delete"></th>');
    let $tableBody = $('<tbody></tbody>');

    $tableHead
        .append($tableRow)
        .append($userSavedCptTh)
        .append($providerNameTh)
        .append($providerAddressTh)
        .append($providerChargedTh)
        .append($medicareAllowedTh)
        .append($medicarePaidTh)
        .append($nationalAverageTh)
        .append($saveCb);
    

    $userSavedSearches
        .append($tableHead)
        .append($tableBody);
    
    data.forEach(function(dataItem){
        console.log('This is provider:' + dataItem.nppes_provider_first_name + ' ' + dataItem.nppes_provider_last_org_name);
        createTableRow(dataItem);
    });
    
};

function createTableRow(data){
    let $tableRow1= $('<tr></tr>');
    let $cpt = $('<td>' + data.hcpsCode + '</td>')
    let $name = $('<td>' + data.providerName + '</td>');
    let $address = $('<td>' + data.providerAddress + '</td>');
    let $charged = $('<td>' + data.providerCharged + '</td>');
    let $allowed = $('<td>' + data.allowedAmount + '</td>');
    let $paid = $('<td>' + data.insurancePaid + '</td>');
    let $average = $('<td>' + data.average + '</td>');
    let $deleteInfo = $('<button class="toDelete">Delete</button>');

    $tableRow1
        .append($cpt)
        .append($name)
        .append($address)
        .append($charged)
        .append($allowed)
        .append($paid)
        .append($average)
        .append($deleteInfo);
    
    $('.userSeachSearhes tbody').append($tableRow1);


};
// function deletes a provider search when the user clicks the delete button
function deleteSearch (event) {
    event.stopPropagation();
    var id = $(this).data('id');
    $.ajax({
        method: 'DELETE',
        url: 'api/searches' + id
    }).then(getUserSavedSearch);
};