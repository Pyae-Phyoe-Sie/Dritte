$(document).ready(function() {
    // to bind input suggest value
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
        let array = [];
        let checkValue = $(this).val();
        let checkOrNot = $(this).is(":checked");
        let keyAndValue = checkValue.split(",");
        let property = JSON.parse(localStorage.getItem(keyAndValue[2]));

        (property.childFilter).forEach(function(childFilter, index) {
            if (childFilter.name == keyAndValue[1]) {
                if (childFilter.hasOwnProperty('selectedFilterValue')) {
                    array = childFilter.selectedFilterValue;
                } else {
                    childFilter.selectedFilterValue = [];
                }

                if(checkOrNot) {
                    array.push(keyAndValue[0]);
                } else {
                    array = $.grep(array, function(value) {
                        return value != keyAndValue[0];
                    });
                }
                property.childFilter[index].selectedFilterValue = array;
            }
        });
        
        localStorage.setItem(property.name, JSON.stringify(property));

        var filter = new Filter(property);
        filter.action();
    });

    $('.filter-radio-item').click(function() {
        let checkValue = $(this).val();
        var keyAndValue = checkValue.split(",");
        let property = JSON.parse(localStorage.getItem(keyAndValue[2]));

        (property.childFilter).forEach(function(childFilter) {
            if (childFilter.name == keyAndValue[1]) {
                childFilter.selectedFilterValue = keyAndValue[0];
            }
        });

        localStorage.setItem(property.name, JSON.stringify(property));

        var filter = new Filter(property);
        filter.action();
    });

    //this code executes when the keypress event occurs.
    $(".filter-text-item").keypress(function(e){
        let filterName = $(this).attr('id');
        let propertyName = $('.'+filterName).val();
        let property = JSON.parse(localStorage.getItem(propertyName));
        let attr;
        let value = $(this).val()+e.key;
        (property.childFilter).forEach(function(childFilter) {
            filterName = filterName.replace(property.name+"-", "");
            if (childFilter.name == filterName) {
                childFilter.selectedFilterValue = value;
                attr = childFilter.child_attr;
            }
        });

        localStorage.setItem(property.name, JSON.stringify(property));
        
        let suggest = [];

        $(property.parent+' '+property.child).each(function() {
            if($(this).attr(attr).includes(value)) {
                if (suggest.includes($(this).attr(attr))) {
                } else {
                    suggest.push($(this).attr(attr))
                }
            }
        });

        addsuggest(suggest, filterName, property);
        
        var filter = new Filter(property);
        filter.action();
    });

    $(".filter-text-item").keydown(function(e){
        if (e.key == "Backspace") {
            e.preventDefault();
            // let filterName = $(this).attr('id');
            // let propertyName = $('.'+filterName).val();
            // let property = JSON.parse(localStorage.getItem(propertyName));
            // let attr;
            // let value = ($(this).val()).slice(0, -1);

            // (property.childFilter).forEach(function(childFilter) {
            //     if (childFilter.name == filterName) {
            //         childFilter.selectedFilterValue = value;
            //         attr = childFilter.child_attr;
            //     }
            // });

            // localStorage.setItem(property.name, JSON.stringify(property));
            
            // let suggest = [];

            // $(property.parent+' '+property.child).each(function() {
            //     if($(this).attr(attr).includes(value)) {
            //         if (suggest.includes($(this).attr(attr))) {
            //         } else {
            //             suggest.push($(this).attr(attr))
            //         }
            //     }
            // });

            // addsuggest(suggest, filterName, propertyName);

            // var filter = new Filter(property);
            // filter.action();
        }
    });

    window.onclick = function() {
        if ($('.filter-suggest p').length > 0) {
            $('.filter-suggest').hide();
        }
    }
});

// for text box filter
function addsuggest(suggest, filterName, property) {
    // console.log(property.parent);
    $(property.parent+' .filter-suggest.'+property.name+'-'+filterName).show();
    $(property.parent).find('.filter-suggest.'+property.name+'-'+filterName+' p').remove();
    if ($(property.parent).find('.filter-suggest.'+property.name+'-'+filterName+' p').length == 0) {
        $(property.parent).find('.filter-suggest.'+property.name+'-'+filterName+'').css('border', 'none');
    } else {
        $(property.parent).find('.filter-suggest.'+property.name+'-'+filterName+'').css('border', '1px solid #c1c1c1');
    }
    suggest.forEach(element => 
        $(property.parent).find('.filter-suggest.'+property.name+'-'+filterName+'').append("<p style='margin: 0px;padding: 3px 7px;' onclick='selectSuggest(`"+element+','+filterName+','+property.name+','+property.parent+"`)'>"+element+"</p>")
    );
}

// for text box filter
function selectSuggest(value) {
    var keyAndValue = value.split(",");
    // console.log(keyAndValue)
    $(keyAndValue[3]).find('.filter-suggest.'+keyAndValue[2]+'-'+keyAndValue[1]+' p').remove();
    $(keyAndValue[3]).find('.filter-check input#'+keyAndValue[2]+'-'+keyAndValue[1]).val(keyAndValue[0]);
    let property = JSON.parse(localStorage.getItem(keyAndValue[2]));

    (property.childFilter).forEach(function(childFilter) {
        if (childFilter.name == keyAndValue[1]) {
            childFilter.selectedFilterValue = keyAndValue[0];
        }
    });

    localStorage.setItem(property.name, JSON.stringify(property));

    var filter = new Filter(property);
    filter.action();
}

function dritte(items) {
    $.each(items, function (index, value) {
        localStorage.removeItem(value.name+'-showIndex');
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
        page = parseInt($(property.parent).find('#active-page').val()) - 1;
    } else if (page == 'next') {
        page = parseInt($(property.parent).find('#active-page').val()) + 1;
    }

    if (page == 0) {
        page = parseInt($(property.parent).find('#active-page').val()) + 1;

        $(property.parent).find('#loading').show();
        $('#'+property.name).hide();
        setTimeout(function(){
            let result = paginate.showPage(page);
            if (result && parseInt($(property.parent).find('#total-page').val()) > page) {
                $('#'+property.name).show();
            }
            $(property.parent).find('#loading').hide();
        }, 500);
    } else {
        // let start, end;
        // if (page == 1) {
        //     start = 1;
        //     end = 1+2;
        //     if (end < parseInt($(property.parent).find('#total-page').val())) {
        //         $(property.parent).find('.next-more').show();
        //     }
        //     $(property.parent).find('.prev').hide();
        //     $(property.parent).find('.next').show();
        // } else if (parseInt($(property.parent).find('#total-page').val()) == page) {
        //     start = page - 2;
        //     end = page;
        //     if (start > 1) {
        //         $(property.parent).find('.prev-more').show();
        //     }
        //     $(property.parent).find('.prev').show();
        //     $(property.parent).find('.next').hide();
        // } else {
        //     start = page - 2;
        //     end = page + 2;
        //     if (start <= 1) {
        //         start = 1;
        //         $(property.parent).find('.prev-more').hide();
        //     } else {
        //         $(property.parent).find('.prev-more').show();
        //     }
        //     if (parseInt($(property.parent).find('#total-page').val()) <= end) {
        //         end = parseInt($(property.parent).find('#total-page').val());
        //         $(property.parent).find('.next-more').hide();
        //     } else {
        //         $(property.parent).find('.next-more').show();
        //     }
        //     $(property.parent).find('.prev').show();
        //     $(property.parent).find('.next').show();
        // }

        // $(property.parent).find('ul.paginate-pages>li.page').hide();
        // for (let i = start; i <= end; i++) {
        //     $(property.parent).find('ul.paginate-pages>li.page-'+i).show();
        // }

        // $(property.parent).find('ul.paginate-pages>li.active').removeClass('active');
        // $(property.parent).find('ul.paginate-pages>li.page-'+page).addClass('active');
        paginate.showPage(page);
    }

    $(property.parent).find('#active-page').val(page);
}

function selectFilter(key) {
    let id = key.replace(",", "-");
    let checkValue = $('#'+id).val();
    let keyAndValue = key.split(",");
    let property = JSON.parse(localStorage.getItem(keyAndValue[1]));
    
    (property.childFilter).forEach(function(childFilter) {
        if (childFilter.name == keyAndValue[0]) {
            childFilter.selectedFilterValue = checkValue;
        }
    });

    localStorage.setItem(property.name, JSON.stringify(property));
    // console.log(property);
    
    var filter = new Filter(property);
    filter.action();
}

function checkforInfiniteScroll(parentEl) {
    // console.log(parentEl.find('#scroll-property').val());
    let property = JSON.parse(localStorage.getItem(parentEl.find('#scroll-property').val()));
    if ($('.paginate-scroll').length > 0) {
        if (parseInt($(property.parent).find('#active-page').val()) <= parseInt($(property.parent).find('#total-page').val())) {
            // for infinite scroll
            if (isElementTopInView($(property.parent).find('.paginate-scroll'))) {
                if ($(property.parent).find('#scroll-able').val() == "scroll") {
                    $(property.parent).find('#scroll-able').val('progress');
                    page = parseInt($(property.parent).find('#active-page').val()) + 1;
                    $(property.parent).find('#active-page').val(page);
                    
                    var paginate = new Paginate(property);
        
                    $(property.parent).find('#loading').show();
                    setTimeout(function(){
                        let result = paginate.showPage(page);
                        if (result) {
                            $(property.parent).find('#scroll-able').val('scroll');
                        }
                        $(property.parent).find('#loading').hide();
                        if (parseInt($(property.parent).find('#total-page').val()) == page) {
                            $(property.parent).find('#scroll-able').val('end');
                            $('#'+property.name).remove();
                            // $('#loading').remove();
                        }
                    }, 500);
                }
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

function deleteText(el) {
    $('#'+el).val('');
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

        if(property.type.hasOwnProperty('animate')){
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
        
        let paginateItems;
        let showList;

        if (property.hasOwnProperty('showIndex')) {
            showList = JSON.parse(localStorage.getItem(property.showIndex));
        } else {
            showList = JSON.parse(localStorage.getItem(this.property.name+'-showIndex'));
        }

        if (showList === null) {
            let showIndex = [];
            let propertyType = property.type;

            $(this.property.parent+' '+this.property.child).each(function() {
                if ($(this).parent('.dritte-animate-container').length > 0) {
                    showIndex.push($(this).parent('.dritte-animate-container').index());
                } else {
                    showIndex.push($(this).index());
                }
            });
            localStorage.setItem(this.property.name+'-showIndex', JSON.stringify(showIndex));
            paginateItems = showIndex.length;
        } else {
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
                let pageNumberLi = '<div class="paginate-pages-container"><input type="hidden" id="active-page" value="1" />'+
                                    '<input type="hidden" class="paginate-key" value="'+this.property.name+'"/>'+
                                    '<input type="hidden" id="total-page" value="'+pages+'" />';
                pageNumberLi += '<ul class="paginate-pages">';
                if (pages > 1) {
                    pageNumberLi += '<li class="prev" onclick="showClickPage(`prev`, `'+this.property.name+'`)" style="display: none"><<</li>';
                    pageNumberLi += '<p class="prev-more" style="display: none">...</p>';
                }
                for (var i = 1; i <= pages; i++) {
                    pageNumberLi += '<li class="page page-'+i+'" onclick="showClickPage('+i+', `'+this.property.name+'`)">'+i+'</li>';
                }
                if (pages > 1) {
                    pageNumberLi += '<p class="next-more" style="display: none">...</p>';
                    pageNumberLi += '<li class="next" onclick="showClickPage(`next`, `'+this.property.name+'`)">>></li>';
                }
                pageNumberLi += '</ul></div>';
                if ($(this.property.parent+' .paginate-pages-container').length != 0) {
                    $(this.property.parent+' .paginate-pages-container').remove();
                    $('#active-page').remove();
                    $('#total-page').remove();
                }
                $(this.property.parent).append(pageNumberLi);
                $(this.property.parent+" .paginate-pages").css({
                    "display": "flex",
                    "list-style": "none",
                    "justify-content": "center",
                    "padding": "0px"
                });
                break;
            case 'infinite-button':
                if ($(this.property.parent+' .paginate-button').length != 0) {
                    $(this.property.parent+' .paginate-button').remove();
                }
                let infiniteBtn = '<div class="paginate-button" style="text-align: center;">'+
                    '<input type="hidden" class="paginate-key" value="'+this.property.name+'"/>'+
                    '<input type="hidden" id="active-page" value="1" />'+
                    '<input type="hidden" id="total-page" value="'+pages+'" />'+
                    '<img id="loading" src="'+this.property.type.image+'" style="display: none;width:30px;">'+
                    '<button type="button" id="'+this.property.name+'" onclick="showClickPage(0, `'+this.property.name+'`)">More</button></div>';
                $(this.property.parent).append(infiniteBtn);
                break;
            case 'infinite-scroll':
                if ($(this.property.parent+' .paginate-scroll').length != 0) {
                    $(this.property.parent+' .paginate-scroll').remove();
                }
                let infiniteScroll = '<div class="paginate-scroll" style="text-align: center;">'+
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
        $(property.parent).find('li.page-'+page).addClass('active');

        // to show paginate page nav
        let paginateStart, paginateEnd;
        if (page == 1) {
            paginateStart = 1;
            paginateEnd = 1+2;
            if (paginateEnd < parseInt($(property.parent).find('#total-page').val())) {
                $(property.parent).find('.next-more').show();
            }
            $(property.parent).find('.prev').hide();
            $(property.parent).find('.next').show();
        } else if (parseInt($(property.parent).find('#total-page').val()) == page) {
            paginateStart = page - 2;
            paginateEnd = page;
            if (paginateStart > 1) {
                $(property.parent).find('.prev-more').show();
            }
            $(property.parent).find('.prev').show();
            $(property.parent).find('.next').hide();
        } else {
            paginateStart = page - 2;
            paginateEnd = page + 2;
            if (paginateStart <= 1) {
                paginateStart = 1;
                $(property.parent).find('.prev-more').hide();
            } else {
                $(property.parent).find('.prev-more').show();
            }
            if (parseInt($(property.parent).find('#total-page').val()) <= paginateEnd) {
                paginateEnd = parseInt($(property.parent).find('#total-page').val());
                $(property.parent).find('.next-more').hide();
            } else {
                $(property.parent).find('.next-more').show();
            }
            $(property.parent).find('.prev').show();
            $(property.parent).find('.next').show();
        }

        $(property.parent).find('ul.paginate-pages>li.page').hide();
        for (let i = paginateStart; i <= paginateEnd; i++) {
            $(property.parent).find('ul.paginate-pages>li.page-'+i).show();
        }

        $(property.parent).find('ul.paginate-pages>li.active').removeClass('active');
        $(property.parent).find('ul.paginate-pages>li.page-'+page).addClass('active');
        // end show paginate page nav

        // start to show child index
        let start = (page - 1)*(property.per_page) + 1;
        let end = (page)*(property.per_page);
        let showList;

        if (property.hasOwnProperty('showIndex')) {
            showList = JSON.parse(localStorage.getItem(property.showIndex));
        } else {
            showList = JSON.parse(localStorage.getItem(property.name+'-showIndex'));
        }
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
                    $(property.parent+' '+property.child).parent('.dritte-animate-container').addClass('dritte-hide');
                    // if (property.type != 'page') {
                        $(property.parent+' '+property.child).addClass('dritte-hide');
                    // }
                } else {
                    $(property.parent+' '+property.child).addClass('dritte-hide');
                }
                // $(property.parent+' '+property.child).hide();
            }, delay);
        }

        setTimeout(function(){
            for (var i = start - 1; i < end; i++) {
                if (i in showList) {
                    if(property.type.hasOwnProperty('animate')){
                        if ($(property.parent+' '+property.child).parent('.dritte-animate-container').length > 0) {
                            $(property.parent+' .dritte-animate-container:nth-child('+(showList[i]+1)+')').removeClass('dritte-hide');
                            $(property.parent+' .dritte-animate-container:nth-child('+(showList[i]+1)+') '+property.child).removeClass('dritte-hide');
                        } else {
                            $(property.parent+' '+property.child+':nth-child('+(showList[i]+1)+')').removeClass('dritte-hide');
                        }
                    } else {
                        $(property.parent+' '+property.child+':nth-child('+(showList[i]+1)+')').removeClass('dritte-hide');
                    }
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
        localStorage.setItem(this.property.name, JSON.stringify(this.property));
    }

    mainFilter() {
        localStorage.removeItem(this.property.name+'-showIndex');
        let self = this;
        self.checkFilterType();
    }

    checkFilterType() {
        let self = this;
        if(this.property.hasOwnProperty('childFilter')){
            // console.log(this.property.multifilter)
            (this.property.childFilter).forEach(function(value) {
                self.addFilter(value);
            });
        } else {
            self.addFilter(this.property);
            // console.log(this.property)
        }
    }

    addFilter(obj) {
        let property = this.property;
        var child = '';
        if(obj.hasOwnProperty('value')){
            
        } else {
            let attr = obj.child_attr;
            let array = [];
            $(this.property.parent+' '+this.property.child).each(function() {
                if(array.includes($(this).attr(attr))){
                } else {
                array.push($(this).attr(attr));
                }
            });
            obj.value = array;
        }

        if ($(this.property.parent+' .dritte-filter-container').length == 0) {
            $(this.property.parent).prepend("<div class='dritte-filter-container'></div>");
        }

        switch(obj.type) {
            case 'select':
                child += '<option value="">default</option>';
                obj.value.forEach(element => {
                    child += '<option value='+element+'>'+element+'</option>';
                });
                $(this.property.parent+' .dritte-filter-container').append('<select id="'+obj.name+'-'+this.property.name+'" onchange="selectFilter(`'+obj.name+','+this.property.name+'`)">'+child+'</select>');
                break;
            case 'check':
                // child += '<input type="hidden" class="filter-key" value="'+this.property.name+'"/>';
                child += '<ul class="filter-check">';
                obj.value.forEach(element => {
                    child += '<li><input type="checkbox" id="'+this.property.name+'-'+obj.name+'-'+element+'" class="filter-check-item" value="'+element+','+obj.name+','+property.name+'"/><label for="'+this.property.name+'-'+obj.name+'-'+element+'">'+element+'</label></li>';
                    // child += '<input type="checkbox" class="filter-check-item" value="'+element+'"/><span>'+element+'</span>';
                });
                child += '</ul>';
                $(this.property.parent+' .dritte-filter-container').append(child);
                break;
            case 'radio':
                // child += '<input type="hidden" class="filter-key" value="'+this.property.name+'"/>';
                child += '<ul class="filter-check">';
                obj.value.forEach(element => {
                    child += '<li><input type="radio" id="'+this.property.name+'-'+obj.name+'-'+element+'" class="filter-radio-item" name="'+this.property.name+'" value="'+element+','+obj.name+','+property.name+'"/><label for="'+this.property.name+'-'+obj.name+'-'+element+'">'+element+'</label></li>';
                    // child += '<input type="radio" class="filter-radio-item" name="'+this.property.name+'" value="'+element+'"/> '+element;
                });
                child += '</ul>';
                $(this.property.parent+' .dritte-filter-container').append(child);
                break;
            case 'type':
                child += '<div class="filter-check" style="position: relative;"><div><input type="text" class="filter-text-item" id="'+this.property.name+'-'+obj.name+'" required />';
                child += '<span style="margin-left: -20px;cursor: pointer;" class="remove-text" onClick="deleteText(`'+this.property.name+'-'+obj.name+'`)">&#10005;</span></div>';
                child += '<input type="hidden" class="'+this.property.name+'-'+obj.name+'" value="'+property.name+'"/>';
                child += '<div class="filter-suggest '+this.property.name+'-'+obj.name+'" style="position: absolute;z-index: 1;background-color: #fff; border: 1px solid #c1c1c1;border-radius: 5px;"></div>';
                child += '</div>';
                $(this.property.parent+' .dritte-filter-container').append(child);
        }
    }

    action() {
        let filterProperty = this.property;
        let showElement = [];
        
        (filterProperty.childFilter).forEach(function(filter) {
            if (filter.hasOwnProperty('selectedFilterValue')) {
                let filterValue = filter.selectedFilterValue;
                if (filterValue.length == 0 || filterValue == "") {
                    if (showElement.length == 0) {
                        $(filterProperty.parent+' '+filterProperty.child).each(function() {
                            showElement.push($(this));
                        });
                    } else {

                    }
                } else {
                    if (showElement.length == 0) {
                        $(filterProperty.parent+' '+filterProperty.child).each(function() {
                            if (filter.type == 'type' || filter.type == 'select') {
                                if (filterValue != '') {
                                    if($(this).attr(filter.child_attr).includes(filterValue)) {
                                        showElement.push($(this));
                                    }
                                } else {
                                    showElement.push($(this));
                                }
                            } else if (filter.type == 'radio') {
                                if(filterValue.includes($(this).attr(filter.child_attr))) {
                                    showElement.push($(this));
                                }
                            } else if (filter.type == 'check') {
                                if(filterValue.includes($(this).attr(filter.child_attr))) {
                                    showElement.push($(this));
                                }
                            }
                        });
                    } else {
                        showElement = jQuery.grep(showElement, function(value) {
                            // return value != removeItem;
                            if (filter.type == 'type' || filter.type == 'select') {
                                if (filterValue != '') {
                                    if(value.attr(filter.child_attr).includes(filterValue)) {
                                        return value;
                                    }
                                } else {
                                    return value;
                                }
                            } else if (filter.type == 'radio') {
                                if(filterValue.includes(value.attr(filter.child_attr))) {
                                    return value;
                                }
                            } else if (filter.type == 'check') {
                                if(filterValue.includes(value.attr(filter.child_attr))) {
                                    return value;
                                }
                            }
                        });
                    }
                }
            }
        });

        let showIndex = [];
        showElement.forEach(function(el) {
            showIndex.push(el.index());
            // console.log(el.index() + ' - ' + el.attr('dritte-filter-color') + ' - ' + el.attr('dritte-filter-data'));
        });

        if (showIndex.length == 0) {
            if ($('.no-data').length == 0) {
                $(this.property.parent).append('<p class="no-data">No Record Found!</p>');
            }
        } else {
            $(this.property.parent+' .no-data').remove();
        }

        localStorage.setItem(this.property.name+'-showIndex', JSON.stringify(showIndex));

        if(this.property.hasOwnProperty('paginate')){
            let paginateProperty = JSON.parse(localStorage.getItem(this.property.paginate));
            paginateProperty.parent = this.property.parent;
            paginateProperty.child = this.property.child;
            paginateProperty.showIndex = this.property.name+'-showIndex';
            var paginate = new Paginate(paginateProperty);
            paginate.mainPaginate();
        }
        // console.log(this.property);
    }
}