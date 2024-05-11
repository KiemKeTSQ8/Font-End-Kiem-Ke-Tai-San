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
                $('#day').val($(this).closest('tr').find('td:eq(1)').text());
                $('#idnv').replaceWith(replaceInputToSelect(window.data2, 'idnv', 'MaNhanVien', $(this).closest('tr').find('td:eq(2)').text()));
                $('#cost').val(parseInt($(this).closest('tr').find('td:eq(3)').text().replace(/[₫,.]/g, '')));
                $('#dialog-title').text('Sửa Kiểm Kê');
                $('#form-modal').attr('action', '/api/kiemke/update');
            });
            $(document).on('click', '.create-button', function () {
                $('#dialog').show();
                $('#id').val('');
                $('#day').val('');
                $('#idnv').replaceWith(replaceInputToSelect(window.data2, 'idnv', 'MaNhanVien', ''));
                $('#cost').val('');
                $('#dialog-title').text('Thêm Kiểm Kê');
                $('#form-modal').attr('action', '/api/kiemke/create');
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
                            name: 'kiemke.xlsx',
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

    TableCustom("example", data1, {
        "Mã kiểm kê": (value, data, index) => `<td>${value}</td>`,
        "Ngày kiểm kê": (value, data, index) => `<td>${value}</td>`,
        "Mã nhân viên": (value, data, index) => `<td>${value}</td>`,
        "Tiền": function(value, data, index) {
            let dataN = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
            return `<td>${dataN}</td>`;
        },
        "": function(value, data, index) {
            let id = data[index][0];
            return `<td><form action="/api/kiemke/delete?id=${id}" method="post"><button type="submit" class="btn btn-danger">Xóa</button></form> <button type="button" class="btn btn-primary edit-button">Sửa</button></td>`;
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
                            <label htmlFor="id">Mã kiểm kê</label>
                            <input type="text" className="form-control" id="id" name="id" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="id">Ngày kiểm kê</label>
                            <input type="date" className="form-control" id="day" name="day" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Mã nhân viên ▼</label>
                            <input type="text" className="form-control" id="idnv" name="idnv" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="cost">Tiền</label>
                            <input type="number" className="form-control" id="cost" name="cost" required/>
                        </div>
                        <button type="submit" className="btn btn-primary">Thêm</button>
                    </form>
                </div>
            </div>
            <div id="error"></div>
            <div id="success"></div>
            <div className="d-flex">
                <button type="button" className="btn btn-success mt-4 ml-10 create-button">Thêm Kiểm Kê
                </button>
                <button type="button" className="btn btn-primary mt-4 ml-1 excel-button">Xuất Excel
                </button>
            </div>
            {
                BaseTable("example", [
                    'Mã kiểm kê',
                    'Ngày kiểm kê',
                    'Mã nhân viên',
                    'Tiền',
                    ''
                ])
            }
        </>
    )
}

async function getDataTable(hostname) {
    const data = await fetch(`${hostname}/api/kiemke/getList`).then((res) => res.json());
    const data2 = await fetch(`${hostname}/api/nhanvien/select?id=MaNhanVien`).then((res) => res.json());
    return {
        props: {
            data: data,
            data2: data2
        },
    };
}