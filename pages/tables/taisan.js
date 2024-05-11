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
    const [data3, setData3] = useState(null);

    useEffect(() => {
        getDataTable(origin).then((res) => {
            setData1(res.props.data);
            setData2(res.props.data2);
            setData3(res.props.data3);
        });
    }, [setData1, setData2,setData3, origin]);

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
            window.data3 = data3;
            $('#dialog').hide();
            $(document).on('click', '.edit-button', function () {
                $('#dialog').show();
                $('#id').val($(this).closest('tr').find('td:eq(0)').text());
                $('#name').val($(this).closest('tr').find('td:eq(1)').text());
                $('#cost').val(parseInt($(this).closest('tr').find('td:eq(2)').text().replace(/[₫,.]/g, '')));
                $('#day').val($(this).closest('tr').find('td:eq(3)').text());
                $('#idts').replaceWith(replaceInputToSelect(window.data2, 'idts', 'MaLoaiTaiSan', $(this).closest('tr').find('td:eq(4)').text()));
                $('#iddv').replaceWith(replaceInputToSelect(window.data3, 'iddv', 'MaDonVi', $(this).closest('tr').find('td:eq(5)').text()));
                $('#dialog-title').text('Sửa Tài Sản');
                $('#form-modal').attr('action', '/api/taisan/update');
            });
            $(document).on('click', '.create-button', function () {
                $('#dialog').show();
                $('#id').val('');
                $('#name').val('');
                $('#cost').val('');
                $('#day').val('');
                $('#idts').replaceWith(replaceInputToSelect(window.data2, 'idts', 'MaLoaiTaiSan', ''));
                $('#iddv').replaceWith(replaceInputToSelect(window.data3, 'iddv', 'MaDonVi', ''));
                $('#dialog-title').text('Thêm Tài Sản');
                $('#form-modal').attr('action', '/api/taisan/create');
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
                            name: 'taisan.xlsx',
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
        "Mã tài sản": (value, data, index) => `<td>${value}</td>`,
        "Tên tài sản": (value, data, index) => `<td>${value}</td>`,
        "Giá trị": function(value, data, index) {
            let dataN = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
            return `<td>${dataN}</td>`;
        },
        "Ngày kiểm kê": (value, data, index) => `<td>${value}</td>`,
        "Mã loại tài sản": (value, data, index) => `<td>${value}</td>`,
        "Mã đơn vị": (value, data, index) => `<td>${value}</td>`,
        "": function(value, data, index) {
            let id = data[index][0];
            return `<td><form action="/api/taisai/delete?id=${id}" method="post"><button type="submit" class="btn btn-danger">Xóa</button></form> <button type="button" class="btn btn-primary edit-button">Sửa</button></td>`;
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
                            <label htmlFor="id">Mã tài sản</label>
                            <input type="text" className="form-control" id="id" name="id" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Tên tài sản</label>
                            <input type="text" className="form-control" id="name" name="name" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="cost">Giá trị</label>
                            <input type="number" className="form-control" id="cost" name="cost" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="day">Ngày kiểm kê</label>
                            <input type="date" className="form-control" id="day" name="day" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="idts">Mã loại tài sản ▼</label>
                            <input type="text" className="form-control" id="idts" name="idts" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="iddv">Mã đơn vị ▼</label>
                            <input type="text" className="form-control" id="iddv" name="iddv" required/>
                        </div>
                        <button type="submit" className="btn btn-primary">Thêm</button>
                    </form>
                </div>
            </div>
            <div id="error"></div>
            <div id="success"></div>
            <div className="d-flex">
                <button type="button" className="btn btn-success mt-4 ml-10 create-button">Thêm Tài Sản
                </button>
                <button type="button" className="btn btn-primary mt-4 ml-1 excel-button">Xuất Excel
                </button>
            </div>
            {
                BaseTable("example", [
                    'Mã tài sản',
                    'Tên tài sản',
                    'Giá trị',
                    'Ngày kiểm kê',
                    'Mã loại tài sản',
                    'Mã đơn vị',
                    ''
                ])
            }
        </>
    )
}

async function getDataTable(hostname) {
    const data = await fetch(`${hostname}/api/taisan/getList`).then((res) => res.json());
    const data2 = await fetch(`${hostname}/api/loaitaisan/select?id=MaLoaiTaiSan`).then((res) => res.json());
    const data3 = await fetch(`${hostname}/api/donvisohuu/select?id=MaDonVi`).then((res) => res.json());
    return {
        props: {
            data: data,
            data2: data2,
            data3: data3,
        },
    };
}