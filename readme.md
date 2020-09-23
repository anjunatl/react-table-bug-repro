Bug reproduction for react-table
===

A project I'm working on uses Laravel with react-table to draw table that works with a large amount of data. To avoid the expensive process of sending all of the table data to the browser, we're using [Laravel's pagination system](https://laravel.com/docs/7.x/pagination#converting-results-to-json)

We've configured react-table to use row selection & to be aware of server-side sorting, filtering, and pagination.

Reproduction steps
---

TODO: Record screenshot gif of the demo doing the thing and put that here

1. Run `docker-compose up` to start up the reproduction environment
2. Click the "Select All" checkbox in the top-left of the table