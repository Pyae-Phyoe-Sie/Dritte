# Dritte
Filter + pagination third party jquery library

# Introduction
Dritte is third party library based on jQuery. This is my first product. I develop it to reduce your coding time.
I hope this will work in your application.
If you develop static webpage or hundred data records, you want to show with pagiantion or with filter, deadline is too close. Let me say Dritte is suitable third party for you.

# Step 1
First you need to integrate jQuery in your website.

# Step 2
Download dritte-min.js and css file (can editable).

# Step 3
Link in your HTML file.

# Step 4
Call dritte library like below

```
dritte({
    filter: {
        name:           'filter-color',
        parent:         '.dritte-grid',
        child:          '.dritte-item',
        childFilter:    [
            {
                type:           'radio', // 'select' | 'check' | 'radio' | 'type'
                // value:          ['red', 'green', 'brown'],
                child_attr:     'dritte-filter-color',
                name:           'attr1',
            },
            {
                type:           'select', // 'select' | 'check' | 'radio' | 'type'
                // value:          ['red', 'green', 'brown'],
                child_attr:     'dritte-filter-data',
                name:           'attr2',
            }
        ],
        paginate:       'paginate-color',
    },
    paginate: {
        name:           'paginate-color',
        per_page:       7, // default 10
        parent:         '.dritte-grid',
        child:          '.dritte-item',
        total:          true,
        type:           {
            type:               'page', // 'page' | 'infinite-button' | 'infinite-scroll'
            animate:            'x-flip', // 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'bounce-in' | 'y-flip' | 'x-flip'
            childDefaultHeight: '100px', // if 'slide-up' | 'slide-left' need child height
            scrollWorkOn:       'parent', // default window
            image:              'https://www.bluechipexterminating.com/wp-content/uploads/2020/02/loading-gif-png-5.gif',
        }
    }
});
```

Here is description for function

| object |  |  |
| :---: | :---: | :---: |
| paginate | need parameter | can call single |
| filter | need parameter | can call single |

You can use both on one element

Paginate

| key | suitable value | required |
| :---: | :---: | :---: |
| name | free name | required (must not duplicate) |
| parent | your parent element class | required (calution on this) |
| child | your record class | required (work on this) |
| type | object | required |

Paginate Type

| key | suitable value | required |
| :---: | :---: | :---: |
| type | 'page', 'infinite-button', 'infinite-scroll' | required |
| animate | 'fade-in', 'slide-up', 'slide-left', 'slide-right', 'bounce-in', 'y-flip', 'x-flip' | not mandatory |
| childDefaultHeight | css value (eg '100px') | if you want animate slide-left/slide-right/slide-up |
| scrollWorkOn | 'parent', 'window' | not mandatory (default is window) |
| image | image url | not manadatory |

If you choose scrollWorkOn -> 'parent', you need to call this
at there .dritte-grid is your parent element name
```
$(document).ready(function() {
    $('.dritte-grid').on('scroll', function() {

        // check for infinite scroll
        checkforInfiniteScroll($(this));

        // check for not view
        checkViewWhenScroll();
    });
});
```

filter

| key | suitable value | required |
| :---: | :---: | :---: |
| name | free name | required (must not duplicate) |
| per_page | integer | not mandatory (default is 10) |
| parent | your parent element class | required (calution on this) |
| child | your record class | required (work on this) |
| total | boolean | not mandatory (default is false) |
| childFilter | objects (if you want multifilter add two objects like upper) | required |
| paginate | call paginate name (want to work together) | not mandatory |

filter Type

| key | suitable value | required |
| :---: | :---: | :---: |
| type | 'select', 'check', 'radio', 'type' | required |
| value | array | not mandatory (will fetch data in html tag) |
| child_attr | you child attribute name | required |
| name | free naming | required (must not duplicate) |
