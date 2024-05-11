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
                $('#andress').val($(this).closest('tr').find('td:eq(2)').text());
                $('#phone').val($(this).closest('tr').find('td:eq(3)').text());
                $('#pos').val($(this).closest('tr').find('td:eq(4)').text());
                $('#room').val($(this).closest('tr').find('td:eq(5)').text());
                $('#userid').val($(this).closest('tr').find('td:eq(6)').text());
                $('#dialog-title').text('Sửa Nhân Viên');
                $('#form-modal').attr('action', '/api/nhanvien/update');
            });
            $(document).on('click', '.create-button', function () {
                $('#dialog').show();
                $('#id').val('');
                $('#name').val('');
                $('#andress').val('');
                $('#phone').val('');
                $('#pos').val('');
                $('#room').val('');
                $('#userid').val('');
                $('#dialog-title').text('Thêm Nhân Viên');
                $('#form-modal').attr('action', '/api/nhanvien/create');
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
        "Mã nhân viên": (value, data, index) => `<td>${value}</td>`,
        "Tên nhân viên": (value, data, index) => `<td>${value}</td>`,
        "Địa chỉ": (value, data, index) => `<td>${value}</td>`,
        "Số điện thoại": (value, data, index) => `<td>${value}</td>`,
        "Chức vụ": (value, data, index) => `<td>${value}</td>`,
        "Phòng ban": (value, data, index) => `<td>${value}</td>`,
        "Mã người dùng": (value, data, index) => `<td>${value}</td>`,
        "": function(value, data, index) {
            let id = data[index][0];
            return `<td><form action="/api/nhanvien/delete?id=${id}" method="post"><button type="submit" class="btn btn-danger">Xóa</button></form> <button type="button" class="btn btn-primary edit-button">Sửa</button></td>`;
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
                            <label htmlFor="id">Mã nhân viên</label>
                            <input type="text" className="form-control" id="id" name="id" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Tên nhân viên</label>
                            <input type="text" className="form-control" id="name" name="name" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="andress">Địa chỉ</label>
                            <input type="text" className="form-control" id="andress" name="andress" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Số điện thoại</label>
                            <input type="number" className="form-control" id="phone" name="phone" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="pos">Chức vụ</label>
                            <input type="text" className="form-control" id="pos" name="pos" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="room">Phòng ban</label>
                            <input type="text" className="form-control" id="room" name="room" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="userid">Mã người dùng</label>
                            <input type="text" className="form-control" id="userid" name="userid" required/>
                        </div>
                        <button type="submit" className="btn btn-primary">Thêm</button>
                    </form>
                </div>
            </div>
            <div id="error"></div>
            <button type="button" className="btn btn-success mt-4 ml-10 create-button">Thêm Nhân Viên</button>
            {
                BaseTable("example", [
                    'Mã nhân viên',
                    'Tên nhân viên',
                    'Địa chỉ',
                    'Số điện thoại',
                    'Chức vụ',
                    'Phòng ban',
                    'Mã người dùng',
                    ''
                ])
            }
        </>
    )
}

async function getDataTable(hostname) {
    const data = await fetch(`${hostname}/api/nhanvien/getList`).then((res) => res.json());
    const data1 = await fetch(`${hostname}/api/chucvu/select/`).then((res) => res.json());
    const data2 = await fetch(`${hostname}/api/phongban/getList`).then((res) => res.json());
    const data3 = await fetch(`${hostname}/api/nguoidung/getList`).then((res) => res.json());
    return {
        props: {
            data: data
        },
    };
}