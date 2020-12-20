$(document).ready(function() {

    // to show active sub menu item
    $('.sub-menu-item').click(function() {
        if ($(this).attr('class').includes("active")) {

        } else {
            let className = $(this).attr('class').replace('sub-menu-item ','');
            $('.sub-menu-item.active').removeClass('active');
            $('.'+className).addClass('active');
        }
    });

    // check for sticky and default
    $('input[type=checkbox]').click(function() {
        $('.'+$(this).attr('class')).prop("checked", $(this).is(":checked"));
    });

    // check which card is in view port
    $(".card-container.not-view").each(function() {
        if (isElementVisible($(this))) {
            $(this).addClass('in-view');
            $(this).removeClass('not-view');
        }
    });

    // check default was outside of window
    if (!isElementUpperWindow($('.filter-sub-menu'), 30)) {
        $('.sticky-panel').css('z-index', 9);
    } else {
        $('.sticky-panel').css('z-index', -1);
    }
    
    $(window).on('scroll', function() {
        if ($('.load-more').length > 0) {
            // for infinite scroll
            if (isElementVisible($('.load-more'))) {
                if ($('#scroll-check').val() == "scroll") {
                    $('#scroll-check').val('progress');
        
                    $('#loading').show();
                    setTimeout(function(){
                        $('#loading').text('Infinite Scroll Work');
                    }, 2000);
                }
            }
        }

        // check default was outside of window
        if (!isElementUpperWindow($('.filter-sub-menu'), 30)) {
            $('.sticky-panel').css('z-index', 9);
        } else {
            $('.sticky-panel').css('z-index', -1);
        }

        // check which card is in view port
        $(".card-container.not-view").each(function() {
            if (isElementVisible($(this))) {
                $(this).addClass('in-view');
                $(this).removeClass('not-view');
            }
        });

    });
});

// check element when that position is too high off window top
function isElementUpperWindow($el, custom = null) {
    var elementTop = $el.offset().top;

    if (custom != null) {
        var elementBottom = elementTop + custom;
    } else {
        var elementBottom = elementTop + $el.outerHeight();
    }
    

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop;
    // return elementBottom > viewportTop && elementTop < viewportBottom;
}

// check element is enter or not when scroll 
function isElementVisible($el) {
    var elementTop = $el.offset().top;
    var elementBottom = elementTop + $el.outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementTop < viewportBottom;
    // return elementBottom > viewportTop && elementTop < viewportBottom;
}

// to see card detail information
function cardExpend(card) {
    $('.card-'+card).addClass('active');
    $('.card-'+card).removeClass('hover-able');
    $('.card-'+card).css('position', 'relative');
    $('.card-'+card+' .foldable').show();
    console.log($('.card-'+card+' .foldable').height());
}

// hide card detail information
function cardCollapse(card) {
    $('.card-'+card).removeClass('active');
    $('.card-'+card).addClass('hover-able');
    $('.card-'+card+' .foldable').hide();
}

// show and hide more filter action bar
function showStickyFilter() {
    $('.sticky-filter').toggle();
}