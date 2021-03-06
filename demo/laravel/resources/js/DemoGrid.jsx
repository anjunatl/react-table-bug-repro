import React from "react";
import each from 'lodash/each';
import isEqual from "lodash/isEqual";
import { IndeterminateCheckbox } from './IndeterminateCheckbox';
import { columnSchema } from './ColumnSchema';
import { usePrevious } from './usePrevious';

import {
  useTable,
  useSortBy,
  useRowSelect,
  usePagination,
  useFlexLayout
} from "react-table";

export const DemoGrid = props => {
  const selectedWidgets = React.useMemo(() => props.selectedWidgets, [props.selectedWidgets]);
  const toggleMode = React.useMemo(() => props.toggleMode, [props.toggleMode]);
  const data = React.useMemo(() => props.tableData.data, [props.tableData.data]);
  const columns = React.useMemo(columnSchema(props), [props]);
  const [newPage, setNewPage] = React.useState(0);

  const skipPageReset = true;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    rows,
    selectedFlatRows,
    toggleRowSelected,
    toggleAllRowsSelected,
    state: { pageIndex, pageSize, sortBy, selectedRowIds }
  } = useTable(
    {
      columns,
      data,
      initialState: props.tableOptions,
      manualPagination: true, // note: enabling server-side pagination
      getRowId: React.useCallback(row => row.widgetId, []), // note: using the row's widgetId as its rowId
      manualSortBy: true, // note: handling sort on server
      pageCount: props.tableData.last_page,
      autoResetPage: !skipPageReset,
      autoResetExpanded: !skipPageReset,
      autoResetGroupBy: !skipPageReset,
      autoResetSelectedRows: !skipPageReset,
      autoResetSortBy: !skipPageReset,
      autoResetFilters: !skipPageReset,
      autoResetRowState: !skipPageReset
    },
    useFlexLayout,
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          maxWidth: '60px',
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
    }
  );

  const previouslySelectedWidgets = usePrevious(props.selectedWidgets);


  // note: this updates the selectedWidgets state in BugDemo
  React.useEffect(() => {
    const rowIds = Object.keys(selectedRowIds);
    props.updateSelectedWidgets(rowIds);
  }, [selectedRowIds]);

  // note: this is intended to clear the internal table's selection state after the parent component is finished with them
  // it checks to see if the new copy of props.selectedWidgets is empty, and if so it runs the chosen useRowSelect hook function to change row selection state
  React.useEffect(() => {
    if (previouslySelectedWidgets && previouslySelectedWidgets.length > 0 && props.selectedWidgets.length === 0) {
      console.log("-----------------------------------");
      console.log("selectedFlatRows only contains visible rows:", selectedFlatRows);
      console.log("rows === page because of the server-side pagination configuration");
      console.log("rows:", rows);
      console.log("page:", page);

      if (toggleMode === "all") {
        console.log("Running toggleAllRowsSelected(false) to change the rows");
        // This only sets selected=false for the current visible page of rows, not all selected rows
        // because it toggles through the available rows instead of the set of selected rows (selectedFlatRows?)
        toggleAllRowsSelected(false);
      } else if (toggleMode === "row") {
        console.log("Running toggleRowSelected(X, false) for each selectedRowId as X -- this will crash when it gets to a row that isn't visible on the page");
        const selectedIds = Object.keys(selectedRowIds);
        console.log("Selected row IDs:", selectedIds);
        console.log("-----------------------------------");
        each(selectedIds, (rowId) => {
          const numericId = Number.parseInt(rowId);
          // React table seems to have some problem with calling toggleRowSelected on a row that isn't visible either  ----- react-dom.development.js?61bb:11102 Uncaught TypeError: Cannot read property 'isSelected' of undefined
          toggleRowSelected(numericId, false); 
          console.log("Toggling row selected -> false %i", numericId);
        });
      }
      
      
    }
  }, [toggleMode, selectedWidgets]);


  React.useEffect(() => {
    setNewPage(pageIndex);
    props.updateTableOptions({ page: pageIndex, pageSize, sortBy });
  }, [pageIndex, pageSize, sortBy]);

  return <React.Fragment>
    <table className="table table-striped table--fixed" {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                <span className="table__header-title">{column.render("Header")}</span>
                {column.isSorted
                  ? column.isSortedDesc
                    ? <i className="table__header-icon icon ion-md-arrow-down"></i>
                    : <i className="table__header-icon icon ion-md-arrow-up"></i>
                  : ""}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>
                <div>{column.canFilter ? column.render("Filter") : null}</div>
              </th>
            ))}
          </tr>
        ))}
        {page.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
    <hr />
    <div className="table-pagination">
      <div className="table-pagination__elements">
        <div className="table-pagination__page-rows">
          <span>
            Rows per page
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </span>
        </div>

        <div className="table-pagination__page-nav">
          <div className="table-pagination__page-index">
            <span>
              Page{" "}
              <input
                className="table-pagination__page-index-input"
                type="number"
                value={newPage + 1}
                onChange={e => {
                  setNewPage(e.target.value ? Number(e.target.value) - 1 : 0);
                }}
                onKeyPress={e =>
                  e.key === "Enter" ? gotoPage(newPage) : null
                }
              />{" "}
              of {pageCount}
            </span>
          </div>

          <div className="table-pagination__page-arrows">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </button>{" "}
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              {"<"}
            </button>{" "}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {">"}
            </button>{" "}
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </button>{" "}
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>;
}
