import React, { useState } from "react";
import assign from 'lodash/assign';
import isEqual from 'lodash/isEqual';
import { DemoGrid } from "./DemoGrid";
import { usePrevious } from './usePrevious';

const BugDemo = () => {
    const [toggleMode, setToggleMode] = useState("all");
    const [selectedWidgets, setSelectedWidgets] = useState([]);
    const [tableOptions, setTableOptions] = useState({
        sortBy: [{
            id: "time",
            desc: true
        }],
        page: 0,
        pageSize: 5,
        expanded: {},
        resized: [],
        filters: []
    });

    const [tableData, setTableData] = useState({
        data: [],
        last_page: 0
    });

    const updateSelectedWidgets = (widgetIds) => {
        if (!isEqual(widgetIds.sort(), selectedWidgets.sort())) {
            const numericWidgetIds = widgetIds.map((stringId) => (parseInt(stringId)));
            setSelectedWidgets(numericWidgetIds);
            console.log("-----------------------------------");
            console.log("# selected widgets: ",  numericWidgetIds);
            console.log("-----------------------------------");
        }
    }

    const updateTableOptions = (param) => {
        console.log("-----------------------------------");
        console.log("Incoming table options:", param);
        console.log("Previous table options:", tableOptions);
        const newOptions = assign({}, tableOptions, param);
        console.log("New options:", newOptions);
        console.log("-----------------------------------");
        setTableOptions(newOptions);
    }

    const handleMultipleRows = (ids) => {
        console.log("Handling all these rows", ids);
        setSelectedWidgets([]); // clear the rows - triggers DemoGrid's useEffect watching `selectedWidgets`
    }

    const previousTableOptions = usePrevious(tableOptions);

    const update = async () => {
        console.log("Loading table data with parameters", tableOptions);
        const {response, error} = await axios
            .post('/data', tableOptions)
            .then(response => ({response}), error => ({error}));

        if (response) {
            // Laravel perPage -> react-table pageSize
            setTableData({
                ...response.data
            });
        } else {
            console.error(error);
        }
    }

    React.useEffect(() => {
        if (!isEqual(tableOptions, previousTableOptions)) {
            update();
        }
    }, [tableOptions]);

    const toggleModeText = toggleMode === "all" ? 'Mode: All - Click to change to row' : 'Mode: Row - Click to change to all';
    const toggleRowHandler = () => {
        if (toggleMode === "all") {
            setToggleMode("row");
        } else {
            setToggleMode("all");
        }
    }

    return (
        <div className="container pt-2">
            <div className="row">
                <div className="col">
                    <p><button className="btn btn-primary" onClick={toggleRowHandler}>{toggleModeText}</button></p>
                    <p><button className="btn btn-primary" onClick={handleMultipleRows}>Do something with and clear these rows ({selectedWidgets.length})</button></p>
                    <DemoGrid
                        tableData={tableData}
                        tableOptions={tableOptions}
                        updateTableOptions={updateTableOptions}
                        selectedWidgets={selectedWidgets}
                        updateSelectedWidgets={updateSelectedWidgets}
                        toggleMode={toggleMode} />
                </div>
            </div>
        </div>
    )
};


export default BugDemo;