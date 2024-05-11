"use client"

import "datatables.net";
import React, {useEffect, useState} from "react";
import {TableCustom} from "../../sub-components";
import BaseTable from "../../data/table/BaseTable";
import { useSearchParams } from 'next/navigation';
import {Authentication} from 'components/auth/Authentication';

const $ = require('jquery');

export default function Table() {
    const searchParams = useSearchParams();
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    const [data, setData] = useState(null);

    useEffect(() => {
        getDataTable(origin).then((res) => {
            setData(res.props.data);
        });
    }, [setData, origin]);

    if (typeof window === "object") {
        $(document).ready(function () {
            $('#dialog').hide();
            $(document).on('click', '.edit-button', function () {
                $('#dialog').show();
                $('#id').val($(this).closest('tr').find('td:eq(0)').text());
                $('#name').val($(this).closest('tr').find('td:eq(1)').text());
                $('#cost').val(parseInt($(this).closest('tr').find('td:eq(2)').text().replace(/[₫,.]/g, '')));
                $('#info').val($(this).closest('tr').find('td:eq(3)').text());
                $('#dialog-title').text('Sửa Chức Vụ');
                $('#form-modal').attr('action', '/api/chucvu/update');
            });
            $(document).on('click', '.create-button', function () {
                $('#dialog').show();
                $('#id').val('');
                $('#name').val('');
                $('#cost').val('');
                $('#info').val('-');
                $('#dialog-title').text('Thêm Chức Vụ');
                $('#form-modal').attr('action', '/api/chucvu/create');
            });
            $(document).on('click', '.close-alert', function () {
                $('#error').html('');
            });
            if (searchParams.has('error')) {
                $('#error').html(`<div class="alert alert-danger" role="alert"><button type="button" class="close-alert mr-10" aria-label="Close"><span class="fs-4" aria-hidden="true">&times;</span></button>${searchParams.get('error')}</div>`);
            }
        });
    }

    TableCustom("example", data, {
        "Mã chức vụ": (value, data, index) => `<td>${value}</td>`,
        "Tên chức vụ": (value, data, index) => `<td>${value}</td>`,
        "Lương": function(value, data, index) {
            let dataN = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
            return `<td>${dataN}</td>`;
        },
        "Mô tả": (value, data, index) => `<td>${value}</td>`,
        "": function(value, data, index) {
            let id = data[index][0];
            return `<td><form action="/api/chucvu/delete?id=${id}" method="post"><button type="submit" class="btn btn-danger">Xóa</button></form> <button type="button" class="btn btn-primary edit-button">Sửa</button></td>`;
        }
    });

    return (
        <>
            <div className="dialog-overlay" id="dialog">
                <div className="dialog">
                    <div className="dialog-header">
                        <h3 id="dialog-title"></h3>
                        <button className="btn btn-danger" onClick={() => $('#dialog').hide()}>&times;</button>
                    </div>
                    <form id="form-modal" method="post">
                        <div className="form-group">
                            <label htmlFor="id">Mã chức vụ</label>
                            <input type="text" className="form-control" id="id" name="id" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Tên chức vụ</label>
                            <input type="text" className="form-control" id="name" name="name" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="cost">Lương</label>
                            <input type="number" className="form-control" id="cost" name="cost" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="info">Mô tả</label>
                            <textarea id="info" name="info" form="form-modal" className="form-control"/>
                        </div>
                        <button type="submit" className="btn btn-primary">Thêm</button>
                    </form>
                </div>
            </div>
            <div id="error"></div>
            <button type="button" className="btn btn-success mt-4 ml-10 create-button">Thêm Chức Vụ</button>
            {
                BaseTable("example", [
                    'Mã chức vụ',
                    'Tên chức vụ',
                    'Lương',
                    'Mô tả',
                    ''
                ])
            }
        </>
    )
}

async function getDataTable(hostname) {
    const data = await fetch(`${hostname}/api/chucvu/getList`).then((res) => res.json());
    return {
        props: {
            data: data
        },
    };
}