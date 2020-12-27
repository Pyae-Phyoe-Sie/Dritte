# Dritte
Filter + pagination third party jquery library

# Hello Guy
Dritte is third party library based on jQuery. This is my first product. I develop it to reduce your coding time.
I hope this will work in your application.



| Attempt | #1 | #2 |
| :---: | :---: | :---: |
| Seconds | 301 | 283 |

dritte({
    filter: {
        parent:         '.card-grid',
        child:          '.card-item',
        name:           'card-color',
        childFilter:    [
            {
                type:           'radio', // 'select' / 'check' / 'radio' / type
                // value:          ['red', 'green', 'brown'],
                child_attr:     'dritte-filter-color',
                name:           'attr1',
            },
            {
                type:           'select', // 'select' / 'check' / 'radio' / type
                // value:          ['red', 'green', 'brown'],
                child_attr:     'dritte-filter-data',
                name:           'attr2',
            }
        ],
        paginate:       'paginate-card',
    },
    paginate: {
        name:           'paginate-card',
        per_page:       7, // default 10
        parent:         '.card-grid',
        child:          '.card-item',
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