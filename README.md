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
        parent:         '.dritte-grid',
        child:          '.dritte-item',
        name:           'filter-color',
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

| Attempt | #1 | #2 |
| :---: | :---: | :---: |
| Seconds | 301 | 283 |