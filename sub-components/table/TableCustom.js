"use client";

import $ from "jquery";

/**
 * @param tableId
 * @param data
 * @constructor
 *
 * @example
 * const data = [
 *      ['Airi Satou', 'Accountant', 'Tokyo', '33']
 * ];
 *
 * const replaceColumns = {
 *     nameColumnA: function(value) {
 *          return `<th>${value}</th>`;
 *     },
 *     nameColumnB: function(value) {
 *          return `<th>${value}</th>`;
 *     },
 *     ...
 */
const TableCustom = (tableId, data, replaceColumns) => {
    tableId = `#${tableId}`;
    try {
        // json to array
        data = data.map((item) => {
            return Object.values(item);
        });

        // custom columns

        let totalIndex = Object.keys(replaceColumns).length;
        for (let i = 0; i < data.length; i++) {
            if (data[i].length < totalIndex) {
                for (let j = data[i].length; j < totalIndex; j++) {
                    data[i].push("null");
                }
            }
        }

        if (replaceColumns) {
            data = data.map((item, indexOr) => {
                return item.map((value, index) => {
                    if (replaceColumns[Object.keys(replaceColumns)[index]]) {
                        return replaceColumns[Object.keys(replaceColumns)[index]](value, data, indexOr);
                    }
                    return value;
                });
            });
        }

        if (typeof window === "object") {
            $(document).ready(function() {
                if ($.fn.dataTable.isDataTable(tableId)) {
                    $(tableId).DataTable().clear();
                    $(tableId).DataTable().rows.add(data);
                } else {
                    $(tableId).DataTable({
                        language: {
                            url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Vietnamese.json"
                        }
                    });
                }
            });
        }
    } catch (error) {
        console.error(error);
    }
}

export default TableCustom;