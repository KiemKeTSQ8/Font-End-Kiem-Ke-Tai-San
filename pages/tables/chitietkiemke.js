"use client"

import "datatables.net";
import React, {useEffect, useState} from "react";
import {TableCustom} from "../../sub-components";
import BaseTable from "../../data/table/BaseTable";
import { useSearchParams } from 'next/navigation';
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
    }, [setData1, setData2, setData3, origin]);

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
                $('#idct').val($(this).closest('tr').find('td:eq(0)').text());
                // $('#idkt').val($(this).closest('tr').find('td:eq(1)').text());
                // $('#idts').val($(this).closest('tr').find('td:eq(2)').text());
                $('#idkt').replaceWith(replaceInputToSelect(window.data2, 'idkt', 'MaKiemKe', $(this).closest('tr').find('td:eq(1)').text()));
                $('#idts').replaceWith(replaceInputToSelect(window.data3, 'idts', 'MaTaiSan', $(this).closest('tr').find('td:eq(2)').text()));
                $('#value').val(parseInt($(this).closest('tr').find('td:eq(3)').text()));
                $('#cost').val(parseInt($(this).closest('tr').find('td:eq(4)').text().replace(/[₫,.]/g, '')));
                $('#dialog-title').text('Sửa Chi Tiết Kiểm Kê');
                $('#form-modal').attr('action', '/api/chitietkiemke/update');
            });
            $(document).on('click', '.create-button', function () {
                $('#dialog').show();
                $('#idct').val('');
                // $('#idkt').val('');
                // $('#idts').val('');
                $('#idkt').replaceWith(replaceInputToSelect(window.data2, 'idkt', 'MaKiemKe', ''));
                $('#idts').replaceWith(replaceInputToSelect(window.data3, 'idts', 'MaTaiSan', ''));
                $('#value').val('');
                $('#cost').val('');
                $('#dialog-title').text('Thêm Chi Tiết Kiểm Kê');
                $('#form-modal').attr('action', '/api/chitietkiemke/create');
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
                            name: 'chitietkiemke.xlsx',
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
        "Mã chi tiết": (value, data, index) => `<td>${value}</td>`,
        "Mã kiểm kê": (value, data, index) => `<td>${value}</td>`,
        "Mã tài sản": (value, data, index) => `<td>${value}</td>`,
        "Số lượng": (value, data, index) => `<td>${value}</td>`,
        "Đơn giá": function(value, data, index) {
            let dataN = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
            return `<td>${dataN}</td>`;
        },
        "": function(value, data, index) {
            let id = data[index][0];
            return `<td><form action="/api/chitietkiemke/delete?id=${id}" method="post"><button type="submit" class="btn btn-danger">Xóa</button></form> <button type="button" class="btn btn-primary edit-button">Sửa</button></td>`;
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
                            <label htmlFor="id">Mã chi tiết</label>
                            <input type="text" className="form-control" id="idct" name="idct" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="id">Mã kiểm kê ▼</label>
                            <input type="text" className="form-control" id="idkt" name="idkt" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="id">Mã tài sản ▼</label>
                            <input type="text" className="form-control" id="idts" name="idts" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="value">Số lượng</label>
                            <input type="number" className="form-control" id="value" name="value" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="cost">Đơn giá</label>
                            <input type="number" className="form-control" id="cost" name="cost" required/>
                        </div>
                        <button type="submit" className="btn btn-primary">Thêm</button>
                    </form>
                </div>
            </div>
            <div id="error"></div>
            <div id="success"></div>
            <div className="d-flex">
                <button type="button" className="btn btn-success mt-4 ml-10 create-button">Thêm Chi Tiết Kiểm Kê
                </button>
                <button type="button" className="btn btn-primary mt-4 ml-1 excel-button">Xuất Excel
                </button>
            </div>
            {
                BaseTable("example", [
                    'Mã chi tiết',
                    'Mã kiểm kê',
                    'Mã tài sản',
                    'Số lượng',
                    'Đơn giá',
                    ''
                ])
            }
        </>
    )
}

async function getDataTable(hostname) {
    const data = await fetch(`${hostname}/api/chitietkiemke/getList`).then((res) => res.json());
    const data2 = await fetch(`${hostname}/api/kiemke/select?id=MaKiemKe`).then((res) => res.json());
    const data3 = await fetch(`${hostname}/api/taisan/select?id=MaTaiSan`).then((res) => res.json());
    return {
        props: {
            data: data,
            data2: data2,
            data3: data3,
        },
    };
}