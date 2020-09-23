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
      Header: "Toggle",
      accessor: row => row.toggled,
      id: "toggled",
      Cell: ({cell}) => {
      return <div>{cell.row.original.toggled ? "True" : "False"}</div>;
      },
      maxWidth: 150,
    },
  ];
  