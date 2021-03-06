$(document).ready(function() {
    $('.error').hide();
    $('#summary-spinner-container').hide();

    $(document).ajaxStart(function(){
        $('#summary-spinner-container').show();
    });
    $(document).ajaxStop(function(){
        $('#summary-spinner-container').hide();
    });

    $('#url_field').val('http://');

    // Handle highlighting of source
    var SCROLLTOP_OFFSET = 100;
    $('body').on('click', '.tag-name', function(event) {
        event.preventDefault();
        var sourceTag = $('.page-source');
        PageSummaryUtils.removeHighlighting(sourceTag);

        var tagName = $(this).html();
        PageSummaryUtils.applyHighlighting(sourceTag, tagName);
        $('html, body').animate({
        scrollTop: $(".highlight").offset().top - SCROLLTOP_OFFSET
    }, 200);

    });

    // Add summary of page and page source
    function buildSummary(response) {
        if (!response || !response.summary || !response.source) {
            console.log(response);
            $('.error').show();
            return;
        }
        $('.error').hide();
        $('.summary').remove();
        $('.source').remove();

        var summaryContainer = PageSummaryUtils.buildSummaryContainer(response.summary);
        $('body').append(summaryContainer);

        var sourceContainer = PageSummaryUtils.buildSourceContainer(response.source);
        $('body').append(sourceContainer);
        $('html, body').animate({
        scrollTop: $(".tag-summary").offset().top - SCROLLTOP_OFFSET
    }, 400);
    };

    // Handle form submission via AJAX
    $('.form').submit(function(event) {
        event.preventDefault();
        $.ajax({
            url: '/pagesummary',
            data: $('form').serialize(),
            type: 'GET',
            success: function(response) {
                buildSummary(response);
            },
            error: function(error) {
                console.log(error);
                $('.error').show();
            }
        });
    });

});
