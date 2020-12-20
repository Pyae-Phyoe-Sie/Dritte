$(document).ready(function() {

    if($('.filter-suggest').length > 0) {
        if ($('.filter-suggest p').length == 0) {
            $('.filter-suggest').css('border', 'none');
        } else {
            $('.filter-suggest').css('border', '1px solid #c1c1c1');
        }
        let top = $('.filter-text-item').offset().top + $('.filter-text-item').height() + 6;
        let width = $('.filter-text-item').width() + 5;
        let left = $('.filter-text-item').offset().left;
        $('.filter-suggest').css('width', width+'px');
        $('.filter-suggest').css('top', top+'px');
        $('.filter-suggest').css('left', left+'px');
    }

    // check for not view
    // checkViewWhenScroll();

    $(window).on('scroll', function() {

        // check for infinite scroll
        checkforInfiniteScroll();

        // check for not view
        checkViewWhenScroll();
    });

    $('.filter-check-item').change(function() {
        let property = JSON.parse(localStorage.getItem($('.filter-key').val()));
        let multiFilter = JSON.parse(localStorage.getItem('multiFilter'));
        let checkValue = $(this).val();
        if (multiFilter == null) {
            multiFilter = [];
        }
        if($(this).is(":checked")) {
            multiFilter.push(checkValue);
        } else {
            multiFilter = $.grep(multiFilter, function(value) {
                return value != checkValue;
            });
        }

        localStorage.setItem('multiFilter', JSON.stringify(multiFilter));

        var filter = new Filter(property);
        filter.action();
    });

    $('.filter-radio-item').click(function() {
        let property = JSON.parse(localStorage.getItem($('.filter-key').val()));
        let checkValue = $(this).val();
        var filter = new Filter(property);
        filter.action(checkValue);
    });

    $(".filter-text-item").keypress(function(e){
        let property = JSON.parse(localStorage.getItem($('.filter-key').val()));
        let attr = property.child_attr;
        let value = $(this).val()+e.key;
        let suggest = [];

        $(property.parent+' '+property.child).each(function() {
            if($(this).attr(attr).includes(value)) {
                if (suggest.includes($(this).attr(attr))) {
                } else {
                    suggest.push($(this).attr(attr))
                }
            }
        });

        addsuggest(suggest);
        
        var filter = new Filter(property);
        filter.action(value);
        //this code executes when the keypress event occurs.
    });

    $(".filter-text-item").keydown(function(e){
        if (e.key == "Backspace") {
            let value = ($(this).val()).slice(0, -1);
            let property = JSON.parse(localStorage.getItem($('.filter-key').val()));
            let attr = property.child_attr;
            let suggest = [];

            if (value != '') {
                $(property.parent+' '+property.child).each(function() {
                    if($(this).attr(attr).includes(value)) {
                        if (suggest.includes($(this).attr(attr))) {
                        } else {
                            suggest.push($(this).attr(attr))
                        }
                    }
                });
            }
    
            addsuggest(suggest);

            var filter = new Filter(property);
            filter.action(value);
        }
    });

    window.onclick = function() {
        if ($('.filter-suggest p').length > 0) {
            $('.filter-suggest').hide();
        }
    }
});

function addsuggest(suggest) {
    $('.filter-suggest').show();
    $('.filter-suggest p').remove();
    if ($('.filter-suggest p').length == 0) {
        $('.filter-suggest').css('border', 'none');
    } else {
        $('.filter-suggest').css('border', '1px solid #c1c1c1');
    }
    suggest.forEach(element => 
        $('.filter-suggest').append("<p style='margin: 0px;padding: 3px 7px;' onclick='selectSuggest(`"+element+"`)'>"+element+"</p>")
    );
}

function selectSuggest(value) {
    $('.filter-suggest p').remove();
    $('.filter-check input').val(value);
    let property = JSON.parse(localStorage.getItem($('.filter-key').val()));
    var filter = new Filter(property);
    filter.action(value);
}

function dritte(items) {
    localStorage.removeItem('showIndex');
    localStorage.removeItem('multiFilter');

    $.each(items, function (index, value) {
        switch (index) {
            // for paginate
            case 'paginate':
                var paginate = new Paginate(value);
                paginate.mainPaginate();
                break;
            case 'filter':
                var filter = new Filter(value);
                filter.mainFilter();
        }
    });
    return true;
}

function showClickPage(page, key) {
    let property = JSON.parse(localStorage.getItem(key));
    let paginate = new Paginate(property);
    if (page == 'prev') {
        page = parseInt($('#active-page').val()) - 1;
    } else if (page == 'next') {
        page = parseInt($('#active-page').val()) + 1;
    }

    if (page == 0) {
        page = parseInt($('#active-page').val()) + 1;

        $('#loading').show();
        $('#'+property.name).hide();
        setTimeout(function(){
            let result = paginate.showPage(page);
            if (result && parseInt($('#total-page').val()) > page) {
                $('#'+property.name).show();
            }
            $('#loading').hide();
        }, 500);
    } else {
        let start, end;
        if (page == 1) {
            start = 1;
            end = 1+2;
            if (end < parseInt($('#total-page').val())) {
                $('.next-more').show();
            }
            $('.prev').hide();
            $('.next').show();
        } else if (parseInt($('#total-page').val()) == page) {
            start = page - 2;
            end = page;
            if (start > 1) {
                $('.prev-more').show();
            }
            $('.prev').show();
            $('.next').hide();
        } else {
            start = page - 2;
            end = page + 2;
            if (start <= 1) {
                start = 1;
                $('.prev-more').hide();
            } else {
                $('.prev-more').show();
            }
            if (parseInt($('#total-page').val()) <= end) {
                end = parseInt($('#total-page').val());
                $('.next-more').hide();
            } else {
                $('.next-more').show();
            }
            $('.prev').show();
            $('.next').show();
        }

        $('ul.paginate-pages>li.page').hide();
        for (let i = start; i <= end; i++) {
            $('ul.paginate-pages>li.page-'+i).show();
        }

        $('ul.paginate-pages>li.active').removeClass('active');
        $('ul.paginate-pages>li.page-'+page).addClass('active');
        paginate.showPage(page);
    }

    $('#active-page').val(page);
}

function selectFilter(key) {
    let property = JSON.parse(localStorage.getItem(key));
    var filter = new Filter(property);
    filter.action($('#'+key).val());
}

function checkforInfiniteScroll() {
    if ($('.paginate-scroll').length > 0) {
        let property = JSON.parse(localStorage.getItem($('#scroll-property').val()));

        // for infinite scroll
        if (isElementTopInView($('.paginate-scroll'))) {
            if ($('#scroll-able').val() == "scroll") {
                $('#scroll-able').val('progress');
                page = parseInt($('#active-page').val()) + 1;
                $('#active-page').val(page);
                
                var paginate = new Paginate(property);
    
                $('#loading').show();
                setTimeout(function(){
                    let result = paginate.showPage(page);
                    if (result) {
                        $('#scroll-able').val('scroll');
                    }
                    $('#loading').hide();
                    if (parseInt($('#total-page').val()) == page) {
                        $('#scroll-able').val('end');
                        $('#'+property.name).remove();
                        // $('#loading').remove();
                    }
                }, 500);
            }
        }
    }
}

function checkViewWhenScroll() {
    let property = JSON.parse(localStorage.getItem($('.paginate-key').val()));

    if ($('.not-view').length > 0) {
        $(".not-view").each(function() {
            if ($(this).css('display') != 'none') {
                let result;
                if ($(this).parent('.dritte-animate-container').length == 0) {
                    result = isElementTopInView($(this), 0, (property.hasOwnProperty('scrollWorkOn')) ? (property.scrollWorkOn != 'window') ? property.parent : null : null);
                } else {
                    result = isElementTopInView($(this).parent('.dritte-animate-container'), 0, (property.hasOwnProperty('scrollWorkOn')) ? (property.scrollWorkOn != 'window') ? property.parent : null : null);
                }

                if (result) {
                    $(this).addClass('in-view');
                    $(this).removeClass('not-view');
                }
            }
        });
    }
}

function isElementWholeInView($el) {
    var elementTop = $el.offset().top;
    var elementBottom = elementTop + $el.outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
}

function isElementTopInView($el, custom = null, parent = null) {
    var elementTop = $el.offset().top;
    // console.log(elementTop);
    if (custom != null) {
        elementTop = elementTop - custom;
    }

    var viewportTop, viewportBottom;
    if (parent != null) {
        viewportTop = $(parent).scrollTop();
        viewportBottom = viewportTop + $(parent).height();
    } else {
        viewportTop = $(window).scrollTop();
        viewportBottom = viewportTop + $(window).height();
    }

    return elementTop < viewportBottom;
}

class Paginate {

    constructor(property) {
        this.property = property;
        if(this.property.hasOwnProperty('per_page')){
        } else {
            this.property.per_page = 10;
        }

        localStorage.setItem(this.property.name, JSON.stringify(property));
    }

    mainPaginate() {
        let self = this;
        let property = this.property;

        // if (this.property.type.type != 'page') {
            if(property.type.hasOwnProperty('animate')){
                // $(property.child).removeClass('in-view '+property.type.animate);
                // $(property.child).addClass('not-view '+property.type.animate);
                if (property.type.animate == 'fade-in') {
                    $( "<style>.not-view.fade-in { opacity: 0; transition: opacity 1s ease; } .in-view.fade-in { opacity: 1;transition: opacity 1s ease; }</style>" ).appendTo( "head" );
                } else if (property.type.animate == 'slide-up') {
                    $(property.parent+' '+property.child).each(function() {
                        if ($(this).parent('.dritte-animate-container').length == 0) {
                            $(this).wrap( "<div class='dritte-animate-container'></div>" );
                        }
                    });
                    // $(property.parent+' .dritte-animate-container').hide();
                    let minHeight;
                    if(property.type.hasOwnProperty('animate')){
                        minHeight = property.type.childDefaultHeight;
                    } else {
                        minHeight = '100px';
                    }
                    $( "<style>.dritte-animate-container { min-height: "+minHeight+"; position: relative; } .not-view.slide-up { opacity: 0; top: 150px; position: absolute; transition: top 1s ease, opacity 1s ease, position 1s ease; } .in-view.slide-up { opacity: 1; top: 0px; position: relative; transition: top 1s ease, opacity 1s ease, position 1s ease; }</style>" ).appendTo( "head" );
                } else if (property.type.animate == 'y-flip') {
                    $( "<style>.not-view.y-flip { transform: rotateY(270deg);transition: transform 1s ease; } .in-view.y-flip { transform: rotateY(360deg);transition: transform 1s ease; }</style>" ).appendTo( "head" );
                } else if (property.type.animate == 'x-flip') {
                    $( "<style>.not-view.x-flip { transform: rotateX(270deg);transition: transform 1s ease; } .in-view.x-flip { transform: rotateX(360deg);transition: transform 1s ease; }</style>" ).appendTo( "head" );
                } else if (property.type.animate == 'slide-left') {
                    $(property.parent+' '+property.child).each(function() {
                        if ($(this).parent('.dritte-animate-container').length == 0) {
                            $(this).wrap( "<div class='dritte-animate-container'></div>" );
                        }
                    });
                    // $(property.parent+' .dritte-animate-container').hide();
                    let minHeight;
                    if(property.type.hasOwnProperty('animate')){
                        minHeight = property.type.childDefaultHeight;
                    } else {
                        minHeight = '100px';
                    }
                    $( "<style>.dritte-animate-container { min-height: "+minHeight+"; position: relative; } .not-view.slide-left { right: 100%; position: absolute; transition: right 1s ease, position 1s ease; } .in-view.slide-left { right: 0px; position: relative; transition: right 1s ease, position 1s ease; }</style>" ).appendTo( "head" );
                } else if (property.type.animate == 'slide-right') {
                    $(property.parent+' '+property.child).each(function() {
                        if ($(this).parent('.dritte-animate-container').length == 0) {
                            $(this).wrap( "<div class='dritte-animate-container'></div>" );
                        }
                    });
                    // $(property.parent+' .dritte-animate-container').hide();
                    let minHeight;
                    if(property.type.hasOwnProperty('animate')){
                        minHeight = property.type.childDefaultHeight;
                    } else {
                        minHeight = '100px';
                    }
                    $( "<style>.dritte-animate-container { min-height: "+minHeight+"; position: relative; } .not-view.slide-right { left: 100%; position: absolute; transition: left 1s ease, position 1s ease; } .in-view.slide-right { left: 0px; position: relative; transition: left 1s ease, position 1s ease; }</style>" ).appendTo( "head" );
                } else if ( 'bounce-in') {
                    $( "<style>.not-view.bounce-in { transform: scale(0); transition: transform 1s ease; } .in-view.bounce-in { transform: scale(1);transition: transform 1s ease; }</style>" ).appendTo( "head" );
                }
            }
        // }
        // let delay = 0;

        // if (property.type == 'page') {
        //     delay = 1000;
        // }

        // setTimeout(function() {
        //     $(property.parent+' '+property.child).hide();
        // }, delay);
        
        var paginateItems;

        if (JSON.parse(localStorage.getItem('showIndex')) === null) {
            let showIndex = [];
            let propertyType = property.type;

            $(this.property.parent+' '+this.property.child).each(function() {
                // $(this).show();
                if ($(this).parent('.dritte-animate-container').length > 0) {
                    showIndex.push($(this).parent('.dritte-animate-container').index());
                } else {
                    showIndex.push($(this).index());
                }

                // if (propertyType.type != 'page') {
                //     if(propertyType.hasOwnpropertyType('animate')){
                //         if (propertyType.animate == 'slide-up' || propertyType.animate == 'slide-left' || propertyType.animate == 'slide-right') {
                //             showIndex.push($(this).parent('.dritte-animate-container').index());
                //         } else {
                //             showIndex.push($(this).index());
                //         }
                //     } else {
                //         showIndex.push($(this).index());
                //     }
                // } else {
                //     showIndex.push($(this).index());
                // }
            });
            localStorage.setItem('showIndex', JSON.stringify(showIndex));
            paginateItems = showIndex.length;
        } else {
            let showList = JSON.parse(localStorage.getItem('showIndex'));
            paginateItems = showList.length;
        }
        var pages = Math.ceil(paginateItems/property.per_page);
        if ($('#total-page').length > 0) {
            $('#total-page').val(pages)
        }

        self.addItems(pages);

        self.showPage(1);
        return true;
    }

    addItems(pages) {
        switch (this.property.type.type) {
            // for paginate
            case 'page':
                $( "<style>li.active, li:hover { background-color: #3299ff !important;color: #fff !important; } li.prev, li.next { color: #fff !important; }</style>" ).appendTo( "head" );
                let pageNumberLi = '<input type="hidden" id="active-page" value="1" />'+
                                    '<input type="hidden" class="paginate-key" value="'+this.property.name+'"/>'+
                                    '<input type="hidden" id="total-page" value="'+pages+'" />';
                pageNumberLi += '<ul class="paginate-pages">';
                if (pages > 1) {
                    pageNumberLi += '<li class="prev" onclick="showClickPage(`prev`, `'+this.property.name+'`)" style="display: none"><<</li>';
                    pageNumberLi += '<li class="prev-more" style="display: none">...</li>';
                }
                for (var i = 1; i <= pages; i++) {
                    pageNumberLi += '<li class="page page-'+i+'" onclick="showClickPage('+i+', `'+this.property.name+'`)">'+i+'</li>';
                }
                if (pages > 1) {
                    pageNumberLi += '<li class="next-more" style="display: none">...</li>';
                    pageNumberLi += '<li class="next" onclick="showClickPage(`next`, `'+this.property.name+'`)">>></li>';
                }
                pageNumberLi += '</ul>';
                if ($('.paginate-pages').length != 0) {
                    $('.paginate-pages').remove();
                    $('#active-page').remove();
                    $('#total-page').remove();
                }
                $(this.property.parent).append(pageNumberLi);
                $(".paginate-pages").css({
                    "display": "flex",
                    "list-style": "none",
                    "justify-content": "center",
                    "padding": "0px"
                });
                if(this.property.hasOwnProperty('listyle')){
                    $(".paginate-pages li").css(this.property.listyle);
                }
                break;
            case 'infinite-button':
                if ($('.paginate-button').length != 0) {
                    $('.paginate-button').remove();
                }
                let infiniteBtn = '<div class="paginate-button">'+
                    '<input type="hidden" class="paginate-key" value="'+this.property.name+'"/>'+
                    '<input type="hidden" id="active-page" value="1" />'+
                    '<input type="hidden" id="total-page" value="'+pages+'" />'+
                    '<img id="loading" src="'+this.property.type.image+'" style="display: none;width:30px;">'+
                    '<button type="button" id="'+this.property.name+'" onclick="showClickPage(0, `'+this.property.name+'`)">More</button></div>';
                $(this.property.parent).append(infiniteBtn);
                break;
            case 'infinite-scroll':
                if ($('.paginate-scroll').length != 0) {
                    $('.paginate-scroll').remove();
                }
                let infiniteScroll = '<div class="paginate-scroll">'+
                    '<input type="hidden" class="paginate-key" value="'+this.property.name+'"/>'+
                    '<input type="hidden" id="active-page" value="1" />'+
                    '<input type="hidden" id="total-page" value="'+pages+'" />'+
                    '<input type="hidden" id="scroll-property" value="'+this.property.name+'" />'+
                    '<input type="hidden" id="scroll-able" value="scroll" />'+
                    '<img id="loading" src="'+this.property.type.image+'" style="display: none;width:30px;">'+
                    '<button type="button" id="'+this.property.name+'" style="display: none;">More</button></div>';
                $(this.property.parent).append(infiniteScroll);
        }
    }

    showPage(page) {
        let property = this.property;
        $('li.page-'+page).addClass('active');

        let start = (page - 1)*(property.per_page) + 1;
        let end = (page)*(property.per_page);

        let showList = JSON.parse(localStorage.getItem('showIndex'));
        let delay = 0;

        if ( (property.type.type == 'infinite-button' && page > 1) ||
            (property.type.type == 'infinite-scroll' && page > 1) ) {
        } else {
            if (property.type.hasOwnProperty('animate')) {
                delay = 1000;
            }
                
            $(property.child).removeClass('in-view '+property.type.animate);
            $(property.child).addClass('not-view '+property.type.animate);
            
            setTimeout(function(){
                if ($(property.parent+' '+property.child).parent('.dritte-animate-container').length > 0) {
                    $(property.parent+' '+property.child).parent('.dritte-animate-container').hide();
                    // if (property.type != 'page') {
                        $(property.parent+' '+property.child).hide();
                    // }
                } else {
                    $(property.parent+' '+property.child).hide();
                }
                // $(property.parent+' '+property.child).hide();
            }, delay);
        }

        setTimeout(function(){
            for (var i = start - 1; i < end; i++) {
                if (i in showList) {
                    // if (property.type.type != 'page') {
                        if(property.type.hasOwnProperty('animate')){
                            if ($(property.parent+' '+property.child).parent('.dritte-animate-container').length > 0) {
                                $(property.parent+' .dritte-animate-container:nth-child('+(showList[i]+1)+')').show();
                                $(property.parent+' .dritte-animate-container:nth-child('+(showList[i]+1)+') '+property.child).show();
                            } else {
                                $(property.parent+' '+property.child+':nth-child('+(showList[i]+1)+')').show();
                            }
                            // if (property.type.animate == 'slide-up' || property.type.animate == 'slide-left' || property.type.animate == 'slide-right') {
                            //     $(property.parent+' .dritte-animate-container:nth-child('+(showList[i]+1)+')').show();
                            //     $(property.parent+' .dritte-animate-container:nth-child('+(showList[i]+1)+') '+property.child).show();
                            // } else {
                            //     $(property.parent+' '+property.child+':nth-child('+(showList[i]+1)+')').show();
                            // }
                        } else {
                            $(property.parent+' '+property.child+':nth-child('+(showList[i]+1)+')').show();
                        }
                    // } else {
                    //     $(property.parent+' '+property.child+':nth-child('+(showList[i]+1)+')').show();
                    // }
                }
            }

            // check for not view
            checkViewWhenScroll();
        }, delay);

        return true;
    }
}

class Filter {

    constructor(property){
        this.property = property;
        localStorage.setItem(this.property.name, JSON.stringify(property));
    }

    mainFilter() {
        let self = this;
        self.addFilter();
    }

    addFilter() {
        var child = '';
        if(this.property.hasOwnProperty('value')){
            
        } else {
            let attr = this.property.child_attr;
            let array = [];
            $(this.property.parent+' '+this.property.child).each(function() {
                if(array.includes($(this).attr(attr))){
                } else {
                array.push($(this).attr(attr));
                }
            });
            this.property.value = array;
        }

        switch(this.property.type) {
            case 'select':
                child += '<option value="">default</option>';
                this.property.value.forEach(element => {
                    child += '<option value='+element+'>'+element+'</option>';
                });
                $(this.property.parent).prepend('<select id="'+this.property.name+'" onchange="selectFilter(`'+this.property.name+'`)">'+child+'</select>');
                break;
            case 'check':
                child += '<input type="hidden" class="filter-key" value="'+this.property.name+'"/>';
                child += '<ul class="filter-check">';
                this.property.value.forEach(element => {
                    child += '<li><input type="checkbox" id="'+element+'" class="filter-check-item" value="'+element+'"/><label for="'+element+'">'+element+'</label></li>';
                    // child += '<input type="checkbox" class="filter-check-item" value="'+element+'"/><span>'+element+'</span>';
                });
                child += '</ul>';
                $(this.property.parent).prepend(child);
                break;
            case 'radio':
                child += '<input type="hidden" class="filter-key" value="'+this.property.name+'"/>';
                child += '<ul class="filter-check">';
                this.property.value.forEach(element => {
                    child += '<li><input type="radio" id="'+element+'" class="filter-radio-item" name="'+this.property.name+'" value="'+element+'"/><label for="'+element+'">'+element+'</label></li>';
                    // child += '<input type="radio" class="filter-radio-item" name="'+this.property.name+'" value="'+element+'"/> '+element;
                });
                child += '</ul>';
                $(this.property.parent).prepend(child);
                break;
            case 'type':
                child += '<input type="hidden" class="filter-key" value="'+this.property.name+'"/>';
                child += '<div class="filter-check"><input type="text" class="filter-text-item" />';
                child += '<div class="filter-suggest" style="position: absolute;z-index: 1;background-color: #fff; border: 1px solid #c1c1c1;border-radius: 5px;"></div>';
                child += '</div>';
                $(this.property.parent).prepend(child);
        }
    }

    action(value = null) {
        // let self = this;
        let attr = this.property.child_attr;
        let filterProperty = this.property;
        let showIndex = [];

        if (value == null) {
            value = JSON.parse(localStorage.getItem('multiFilter'));
            if (value.length == 0) {
                // self.createShowIndex('normal', value);
                $(this.property.parent+' '+this.property.child).each(function() {
                    // $(this).show();
                    if (filterProperty.hasOwnProperty('paginate')) {
                        // let paginateProperty = JSON.parse(localStorage.getItem(filterProperty.paginate));

                        if ($(this).parent('.dritte-animate-container').length > 0) {
                            showIndex.push($(this).parent('.dritte-animate-container').index());
                        } else {
                            showIndex.push($(this).index());
                        }
                        // if (paginateProperty.type.type != 'page') {
                        //     if(paginateProperty.type.hasOwnProperty('animate')){
                        //         if (paginateProperty.type.animate == 'slide-up' || paginateProperty.type.animate == 'slide-left' || paginateProperty.type.animate == 'slide-right') {
                        //             showIndex.push($(this).parent('.dritte-animate-container').index());
                        //         } else {
                        //             showIndex.push($(this).index());
                        //         }
                        //     } else {
                        //         showIndex.push($(this).index());
                        //     }
                        // } else {
                        //     showIndex.push($(this).index());
                        // }
                    } else {
                        showIndex.push($(this).index());
                    }
                });
            } else {
                // self.createShowIndex('attr', value);
                $(this.property.parent+' '+this.property.child).each(function() {
                    if(value.includes($(this).attr(attr))) {
                        // $(this).show();
                        if (filterProperty.hasOwnProperty('paginate')) {
                            if ($(this).parent('.dritte-animate-container').length > 0) {
                                showIndex.push($(this).parent('.dritte-animate-container').index());
                            } else {
                                showIndex.push($(this).index());
                            }
                            // let paginateProperty = JSON.parse(localStorage.getItem(filterProperty.paginate));
                            // if (paginateProperty.type.type != 'page') {
                            //     if(paginateProperty.type.hasOwnProperty('animate')){
                            //         if (paginateProperty.type.animate == 'slide-up' || paginateProperty.type.animate == 'slide-left'|| paginateProperty.type.animate == 'slide-right') {
                            //             console.log('here');
                            //             showIndex.push($(this).parent('.dritte-animate-container').index());
                            //         } else {
                            //             showIndex.push($(this).index());
                            //         }
                            //     } else {
                            //         showIndex.push($(this).index());
                            //     }
                            // } else {
                            //     showIndex.push($(this).index());
                            // }
                        } else {
                            showIndex.push($(this).index());
                        }
                    }
                });
            }
        } else
        if (value == "") {
            // self.createShowIndex('normal', value);
            $(this.property.parent+' '+this.property.child).each(function() {
                // $(this).show();
                if (filterProperty.hasOwnProperty('paginate')) {
                    if ($(this).parent('.dritte-animate-container').length > 0) {
                        showIndex.push($(this).parent('.dritte-animate-container').index());
                    } else {
                        showIndex.push($(this).index());
                    }
                        // let paginateProperty = JSON.parse(localStorage.getItem(filterProperty.paginate));
                        // if (paginateProperty.type.type != 'page') {
                        //     if(paginateProperty.type.hasOwnProperty('animate')){
                        //         if (paginateProperty.type.animate == 'slide-up' || paginateProperty.type.animate == 'slide-left' || paginateProperty.type.animate == 'slide-right') {
                        //             // console.log('here');
                        //             showIndex.push($(this).parent('.dritte-animate-container').index());
                        //         } else {
                        //             showIndex.push($(this).index());
                        //         }
                        //     } else {
                        //         showIndex.push($(this).index());
                        //     }
                        // } else {
                        //     showIndex.push($(this).index());
                        // }
                } else {
                    showIndex.push($(this).index());
                }
            });
        } else {
            // $(this.property.parent+' '+this.property.child).hide();
            $(this.property.parent+' '+this.property.child).each(function() {
                // if($(this).attr(attr) == value) {
                if ($(this).attr(attr).includes(value)) {
                    // $(this).show();
                    if (filterProperty.hasOwnProperty('paginate')) {
                        if ($(this).parent('.dritte-animate-container').length > 0) {
                            showIndex.push($(this).parent('.dritte-animate-container').index());
                        } else {
                            showIndex.push($(this).index());
                        }
                        // let paginateProperty = JSON.parse(localStorage.getItem(filterProperty.paginate));
                        // if (paginateProperty.type.type != 'page') {
                        //     if(paginateProperty.type.hasOwnProperty('animate')){
                        //         if (paginateProperty.type.animate == 'slide-up' || paginateProperty.type.animate == 'slide-left' || paginateProperty.type.animate == 'slide-right') {
                        //             console.log('here');
                        //             showIndex.push($(this).parent('.dritte-animate-container').index());
                        //         } else {
                        //             showIndex.push($(this).index());
                        //         }
                        //     } else {
                        //         showIndex.push($(this).index());
                        //     }
                        // } else {
                        //     showIndex.push($(this).index());
                        // }
                    } else {
                        showIndex.push($(this).index());
                    }
                }
            });
        }

        localStorage.setItem('showIndex', JSON.stringify(showIndex));

        if(this.property.hasOwnProperty('paginate')){
            let paginateProperty = JSON.parse(localStorage.getItem(this.property.paginate));
            var paginate = new Paginate(paginateProperty);
            paginate.mainPaginate();
        }
        // console.log(this.property);
    }
}