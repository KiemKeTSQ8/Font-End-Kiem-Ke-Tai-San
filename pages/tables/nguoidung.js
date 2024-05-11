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
    const [data1, setData1] = useState(null);
    const [data2, setData2] = useState(null);

    useEffect(() => {
        getDataTable(origin).then((res) => {
            setData1(res.props.data);
            setData2(res.props.data2);
        });
    }, [setData1, setData2, origin]);

    const replaceInputToSelect = (dataI, id, value, dataSelected) => {
        let select = document.createElement('select');
        select.id = id;
        select.name = id;
        select.className = 'form-control bg-light';
        dataI.forEach((item, index) => {
            let option = document.createElement('option');
            option.value = item[value];
            option.text = item[value];
            if (dataSelected === item[value]) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        return select;
    };

    if (typeof window === "object") {
        $(document).ready(function () {
            window.data2 = data2;
            $('#dialog').hide();
            $(document).on('click', '.edit-button', function () {
                $('#dialog').show();
                $('#id').val($(this).closest('tr').find('td:eq(0)').text());
                $('#name').val($(this).closest('tr').find('td:eq(1)').text());
                $('#pass').val($(this).closest('tr').find('td:eq(2)').text());
                $('#idcv').replaceWith(replaceInputToSelect(window.data2, 'idcv', 'MaChucVu', $(this).closest('tr').find('td:eq(3)').text()));
                $('#dialog-title').text('Sửa Người Dùng');
                $('#form-modal').attr('action', '/api/nguoidung/update');
            });
            $(document).on('click', '.create-button', function () {
                $('#dialog').show();
                $('#id').val('');
                $('#name').val('');
                $('#pass').val('');
                $('#idcv').replaceWith(replaceInputToSelect(window.data2, 'idcv', 'MaChucVu', ''));
                $('#dialog-title').text('Thêm Người Dùng');
                $('#form-modal').attr('action', '/api/nguoidung/create');
            });
            $(document).on('click', '.close-alert', function () {
                $('#error').html('');
            });
            if (searchParams.has('error')) {
                $('#error').html(`<div class="alert alert-danger" role="alert"><button type="button" class="close-alert mr-10" aria-label="Close"><span class="fs-4" aria-hidden="true">&times;</span></button>${searchParams.get('error')}</div>`);
            }
        });
    }

    TableCustom("example", data1, {
        "Mã người dùng": (value, data, index) => `<td>${value}</td>`,
        "Tên người dùng": (value, data, index) => `<td>${value}</td>`,
        "Mật khẩu": (value, data, index) => `<td>${value}</td>`,
        "Mã chức vụ": (value, data, index) => `<td>${value}</td>`,
        "": function(value, data, index) {
            let id = data[index][0];
            return `<td><form action="/api/nguoidung/delete?id=${id}" method="post"><button type="submit" class="btn btn-danger">Xóa</button></form> <button type="button" class="btn btn-primary edit-button">Sửa</button></td>`;
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
                            <label htmlFor="id">Mã người dùng</label>
                            <input type="text" className="form-control" id="id" name="id" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Tên người dùng</label>
                            <input type="text" className="form-control" id="name" name="name" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="pass">Mật khẩu</label>
                            <input type="text" className="form-control" id="pass" name="pass" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="idcv">Mã chức vụ</label>
                            <input type="text" className="form-control" id="idcv" name="idcv" required/>
                        </div>
                        <button type="submit" className="btn btn-primary">Thêm</button>
                    </form>
                </div>
            </div>
            <div id="error"></div>
            <button type="button" className="btn btn-success mt-4 ml-10 create-button">Thêm Người Dùng</button>
            {
                BaseTable("example", [
                    'Mã người dùng',
                    'Tên người dùng',
                    'Mật khẩu',
                    'Mã chức vụ',
                    ''
                ])
            }
        </>
    )
}

async function getDataTable(hostname) {
    const data = await fetch(`${hostname}/api/nguoidung/getList`).then((res) => res.json());
    const data2 = await fetch(`${hostname}/api/chucvu/select?id=MaChucVu`).then((res) => res.json());
    return {
        props: {
            data: data,
            data2: data2
        },
    };
}