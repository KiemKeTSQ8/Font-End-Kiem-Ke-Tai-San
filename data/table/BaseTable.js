"use client";

import $ from "jquery";

const BaseTable = function(id, headers) {
    let table = ``;
    table += `<div class="container mt-5 mb-5">`;
    table += `<table id="${id}" class="table table-striped table-bordered" style="width:100%">`;
    table += `<thead>`;
    table += `<tr>`;
    headers.forEach((header) => {
        table += `<th>${header}</th>`;
    });
    table += `</tr>`;
    table += `</thead>`;
    table += `<tbody>`;
    table += `<tr>`;
    headers.forEach(() => {
        table += `<td>loading...</td>`;
    });
    table += `</tr>`;
    table += `</tbody>`;
    table += `</table>`;
    table += `</div>`;
    return (
        <div dangerouslySetInnerHTML={{__html: table}} />
    );
}

export default BaseTable;