"use client"

import "datatables.net";
import React, {useEffect, useState} from "react";
import {TableCustom} from "../../sub-components";
import BaseTable from "../../data/table/BaseTable";
import { useSearchParams } from 'next/navigation';
import {Authentication} from 'components/auth/Authentication';
import {getTableRFC} from "../../components/Utils";

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
                $('#owner').val($(this).closest('tr').find('td:eq(2)').text());
                $('#address').val($(this).closest('tr').find('td:eq(3)').text());
                $('#phone').val($(this).closest('tr').find('td:eq(4)').text());
                $('#info').val($(this).closest('tr').find('td:eq(5)').text());
                $('#dialog-title').text('Sửa Đơn Vị Sở Hữu');
                $('#form-modal').attr('action', '/api/donvisohuu/update');
            });
            $(document).on('click', '.create-button', function () {
                $('#dialog').show();
                $('#id').val('');
                $('#name').val('');
                $('#owner').val('');
                $('#address').val('');
                $('#phone').val('');
                $('#info').val('-');
                $('#dialog-title').text('Thêm Đơn Vị Sở Hữu');
                $('#form-modal').attr('action', '/api/donvisohuu/create');
            });
            $(document).on('click', '.close-alert', function () {
                $('#error').html('');
                $('#success').html('');
            });
            $(document).on('click', '.excel-button', function () {
                if (typeof window === "object") {
                    import('@linways/table-to-excel').then((myPackage) => {
                        const myPackageInstance = myPackage.default;
                        myPackageInstance.convert(getTableRFC('example'), {
                            name: 'donvisohuu.xlsx',
                            sheet: {
                                name: 'Sheet 1'
                            }
                        });
                    }).catch((error) => {
                        console.error('Import failed:', error);
                    });
                }
            });
            if (searchParams.has('error')) {
                $('#error').html(`<div class="alert alert-danger" role="alert"><button type="button" class="close-alert mr-10" aria-label="Close"><span class="fs-4" aria-hidden="true">&times;</span></button>${searchParams.get('error')}</div>`);
            }
            if (searchParams.has('success')) {
                $('#success').html(`<div class="alert alert-success" role="alert"><button type="button" class="close-alert mr-10" aria-label="Close"><span class="fs-4" aria-hidden="true">&times;</span></button>${searchParams.get('success')}</div>`);
            }
        });
    }

    TableCustom("example", data, {
        "Mã đơn vị": (value, data, index) => `<td>${value}</td>`,
        "Tên đơn vị": (value, data, index) => `<td>${value}</td>`,
        "Chủ sở hữu": (value, data, index) => `<td>${value}</td>`,
        "Địa chỉ": (value, data, index) => `<td>${value}</td>`,
        "Điện thoại": (value, data, index) => `<td>${value}</td>`,
        "Mô tả": (value, data, index) => `<td>${value}</td>`,
        "": function(value, data, index) {
            let id = data[index][0];
            return `<td><form action="/api/donvisohuu/delete?id=${id}" method="post"><button type="submit" class="btn btn-danger">Xóa</button></form> <button type="button" class="btn btn-primary edit-button">Sửa</button></td>`;
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
                            <label htmlFor="id">Mã đơn vị</label>
                            <input type="text" className="form-control" id="id" name="id" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Tên đơn vị</label>
                            <input type="text" className="form-control" id="name" name="name" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="owner">Chủ sở hữu</label>
                            <input type="text" className="form-control" id="owner" name="owner" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Địa chỉ</label>
                            <input type="text" className="form-control" id="address" name="address" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Điện thoại</label>
                            <input type="number" className="form-control" id="phone" name="phone" required/>
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
            <div id="success"></div>
            <div className="d-flex">
                <button type="button" className="btn btn-success mt-4 ml-10 create-button">Thêm Đơn Vị Sở Hữu
                </button>
                <button type="button" className="btn btn-primary mt-4 ml-1 excel-button">Xuất Excel
                </button>
            </div>
            {
                BaseTable("example", [
                    'Mã đơn vị',
                    'Tên đơn vị',
                    'Chủ sở hữu',
                    'Địa chỉ',
                    'Điện thoại',
                    'Mô tả',
                    ''
                ])
            }
        </>
    )
}

async function getDataTable(hostname) {
    const data = await fetch(`${hostname}/api/donvisohuu/getList`).then((res) => res.json());
    return {
        props: {
            data: data
        },
    };
}