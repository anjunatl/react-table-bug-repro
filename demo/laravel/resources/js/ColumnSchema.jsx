import React from "react";

export const columnSchema = props => () => [
    {
      Header: "Time",
      accessor: "time",
      id: "time",
      maxWidth: 200,
      Cell: ({cell}) => (<div>
        {(new Date(cell.row.original.time)).toLocaleTimeString('en-US')}
      </div>)
    },
    {
      Header: "ID",
      accessor: row => row.widgetId,
      id: "widgetId",
      maxWidth: 150,
    },
  ];
  