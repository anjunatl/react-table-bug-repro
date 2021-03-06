Row deselection bug in react-table
===
Summary
---

react-table (seen in both v7.5.1 & v7.6.3) with `manualPagination` & `useRowSelect` crashes when deselecting rows that are not on the currently visible page. Data for this example is provided by Laravel's [server-side pagination](https://laravel.com/docs/7.x/pagination#converting-results-to-json) 


- [Row deselection bug in react-table](#row-deselection-bug-in-react-table)
  - [Summary](#summary)
  - [Reproduction steps](#reproduction-steps)
    - [toggleAllRowSelected - not all rows get cleared](#toggleallrowselected---not-all-rows-get-cleared)
      - [Expected behavior](#expected-behavior)
      - [Actual behavior](#actual-behavior)
    - [toggleRowSelected - crashes](#togglerowselected---crashes)
      - [Expected behavior](#expected-behavior-1)
      - [Actual behavior](#actual-behavior-1)
  - [Bug details](#bug-details)
  - [Potential fix](#potential-fix)
  - [Example source highlights](#example-source-highlights)
  - [Related GitHub issues / PRs](#related-github-issues--prs)

Reproduction steps
---

### toggleAllRowSelected - not all rows get cleared

1. Run `docker-compose up` to start the example
2. Choose one to many rows on the first page
3. Change to another page
4. Choose another one to many rows
5. Click the "Do something" button

#### Expected behavior

The selected row counter should reset to 0.

#### Actual behavior

The selected row counter is not 0 & is the sum of selected rows on non-visible pages

### toggleRowSelected - crashes

1. Run `docker-compose up` to start the example
2. Click the "Mode" button to change it from "All" to "Row" to enable use of `toggleRowSelected`
3. Choose one to many rows on the first page
4. Change to another page
5. Choose another one to many rows
6. Click the "Do something" button

#### Expected behavior

The selected row counter should reset to 0.

#### Actual behavior

The page crashes

Bug details
---

This started when trying to use `toggleAllRowsSelected(false)` to clear all the selected rows, but that resulted in only the current visible rows being deselected - you could go to the other pages with previously selected rows and still see them selected.

To work around this, I tried tracking the selected row IDs externally & using `toggleRowSelected(rowId, false)` to iterate over the selected IDs to set selected=false but then the page crashed when it tried to toggle a row that was not visible.

Using `toggleRowSelected`, the following lines in `useRowSelect.js` break when a not-visible row is being deselected:

```js
const row = rowsById[id]    // off-page row = undefined
if (!row.isGrouped) { ...   // errors here
```

- By design when server-side pagination is enabled, only the displayed rows are returned from the API - IE `page[] = rows[]`
- `useRowSelect` seems to expects `rows[]` to have all possible, not just the currently visible ones

Potential fix
---

- [Not sure if this is a proper fix but it fixed the crash at least](https://github.com/anjunatl/react-table/compare/master...repro-potential-fix#diff-7a09cd6bfcfb63be61d3418dbdc5029afe73bc638cb84ce0d86e4e81387b6581)
- `cd demo/laravel/react-table && git checkout repro-potential-fix`
- `cd ../../.. && docker-compose build && docker-compose up` 

Example source highlights
---

* [react-table instance](./demo/laravel/resources/js/DemoGrid.jsx)
* [demo page that loads data from api](./demo/laravel/resources/js/BugDemo.jsx)
* [api endpoint that returns paginated data from the controller](./demo/laravel/routes/web.php)
* [controller that returns test data](./demo/laravel/app/Http/Controllers/DemoController.php)
* [test data](demo/laravel/storage/app/test.json)

Related GitHub issues / PRs
---

- https://github.com/tannerlinsley/react-table/pull/2651/files - unrelated to this issue but happens to partially fix the crash
  - `const isSelected = row.isSelected` -> `const isSelected = id in state.selectedRowIds`
  - Fixes [#2171](https://github.com/tannerlinsley/react-table/issues/2171)
- https://github.com/tannerlinsley/react-table/pull/2666/files - 
  - `const isSelected = row.isSelected` -> `const isSelected = state.selectedRowIds[id]`
  - Fixes [#2659](https://github.com/tannerlinsley/react-table/issues/2659) & 2171
- https://github.com/tannerlinsley/react-table/issues/2833
  - Another "Cannot read property 'isGrouped' of undefined" error, not sure if they're using manualPagination or if it's the same root cause