$( document ).ready(function() {
    var typingTimer; 

    $( "#pickupLocation" ).keyup(function() {

        var inputObj = this;
        
        clearTimeout(typingTimer);

        typingTimer = setTimeout(function () {

            submitSearch(inputObj);
            
        }, 500);
 
    });

});

function submitSearch(input) {
    searchValue = $(input).val();

    if (searchValue.length > 1) {
        searchUpdate(searchValue);
    } else if ($('.liveResults').html().length > 0) {
        $('.liveResults').html("");
        $('.liveResults').hide();
    }
}

function searchUpdate(searchValue) {
    var searchResults = {};
    var liveSearchHTML = "";

    $('.pickUpSearch__location').addClass('pickUpSearch__location--preloader');

    $.get("https://cors.io/?https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&solrRows=6&solrTerm=" + searchValue, function(data, status){
        if (data.length) {
            searchResults = JSON.parse(data);

            liveSearchHTML = buildSearchHTML(searchResults);
            
            noResultsFound(liveSearchHTML)
        } else {
            noResultsFound();
        }
          
    });

}

function buildSearchHTML(searchResults) {
    var returnHTML = "";

    $(searchResults.results.docs).each(function(){

        placeType = this.placeType;
        name = this.name;
        iata = this.iata;
        region = this.region;

        
        if (this.placeType == "C") {
            returnHTML += '<div class="liveResults__Block"><div class="liveResults__placeTypeContainer"><span class="liveResults__placeType liveResults__placeType--city">City</span></div><div class="liveResults__locationInfo"><p class="liveResults__locationInfoTitle">' + name + '(' + iata + ')</p><p class="liveResults__locationInfoSubtitle">' + region + '</p></div></div>'
        } else if (this.placeType == "T") {
            returnHTML += '<div class="liveResults__Block"><div class="liveResults__placeTypeContainer"><span class="liveResults__placeType liveResults__placeType--station">Station</span></div><div class="liveResults__locationInfo"><p class="liveResults__locationInfoTitle">' + name + '</p><p class="liveResults__locationInfoSubtitle">' + region + '</p></div></div>'
        } else if (this.placeType == "A") {
            returnHTML += '<div class="liveResults__Block"><div class="liveResults__placeTypeContainer"><span class="liveResults__placeType liveResults__placeType--airport">Airport</span></div><div class="liveResults__locationInfo"><p class="liveResults__locationInfoTitle">' + name + '</p><p class="liveResults__locationInfoSubtitle">' + region + '</p></div></div>'
        }
    });

    return returnHTML;
}

function resultsFound(liveSearchHTML) {
    $('.pickUpSearch__location').removeClass('pickUpSearch__location--preloader');
    $('.liveResults').html("");
    $('.liveResults').show();
    $('.liveResults').html(liveSearchHTML);    
}

function noResultsFound() {
    $('.pickUpSearch__location').removeClass('pickUpSearch__location--preloader');
    $('.liveResults').html("");
    $('.liveResults').show();
    $('.liveResults').html("<div class='liveResults__Block'>No results found</div>");
}