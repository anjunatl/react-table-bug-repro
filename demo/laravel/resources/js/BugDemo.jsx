import React, { useState } from "react";
import assign from 'lodash/assign';
import isEqual from 'lodash/isEqual';
import { DemoGrid } from "./DemoGrid";
import { usePrevious } from './usePrevious';

const BugDemo = () => {
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

    const clearSelectedWidgets = () => {
        setSelectedWidgets([]);
    }

    const update = async () => {
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
        update();
    }, [tableOptions]);

    return (
        <div>
            <button onClick={clearSelectedWidgets}>Clear selected ({selectedWidgets.length})</button>
            <DemoGrid
                tableData={tableData}
                tableOptions={tableOptions}
                selectedWidgets={selectedWidgets}
                updateTableOptions={updateTableOptions}
                updateSelectedWidgets={updateSelectedWidgets} />
        </div>
    )
};


export default BugDemo;