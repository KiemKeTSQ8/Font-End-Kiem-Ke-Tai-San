"use client"

import "datatables.net";
import React, {useEffect, useState} from "react";
import {TableCustom} from "../../sub-components";
import BaseTable from "../../data/table/BaseTable";
import { useSearchParams } from 'next/navigation';
import {Authentication} from 'components/auth/Authentication';
import {getTableRFC} from "../../components/Utils";

const $ = require('jquery');

export default function Table(context) {
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
                $('#idts').replaceWith(replaceInputToSelect(window.data2, 'idts', 'MaTaiSan', $(this).closest('tr').find('td:eq(1)').text()));
                $('#day').val($(this).closest('tr').find('td:eq(2)').text());
                $('#dialog-title').text('Sửa Lịch Sử Kiểm Kê');
                $('#form-modal').attr('action', '/api/lichsukiemke/update');
            });
            $(document).on('click', '.create-button', function () {
                $('#dialog').show();
                $('#id').val('');
                $('#idts').replaceWith(replaceInputToSelect(window.data2, 'idts', 'MaTaiSan', ''));
                $('#day').val('');
                $('#dialog-title').text('Thêm Lịch Sử Kiểm Kê');
                $('#form-modal').attr('action', '/api/lichsukiemke/create');
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
                            name: 'lichsukiemke.xlsx',
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
        "Mã lịch sử": (value, data, index) => `<td>${value}</td>`,
        "Mã tài sản": (value, data, index) => `<td>${value}</td>`,
        "Ngày kiểm kê": (value, data, index) => `<td>${value}</td>`,
        "": function(value, data, index) {
            let id = data[index][0];
            return `<td><form action="/api/lichsukiemke/delete?id=${id}" method="post"><button type="submit" class="btn btn-danger">Xóa</button></form> <button type="button" class="btn btn-primary edit-button">Sửa</button></td>`;
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
                            <label htmlFor="id">Mã lịch sử</label>
                            <input type="text" className="form-control" id="id" name="id" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Mã tài sản ▼</label>
                            <input type="text" className="form-control" id="idts" name="idts" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="cost">Ngày kiểm kê</label>
                            <input type="date" className="form-control" id="day" name="day" required/>
                        </div>
                        <button type="submit" className="btn btn-primary">Thêm</button>
                    </form>
                </div>
            </div>
            <div id="error"></div>
            <div id="success"></div>
            <div className="d-flex">
                <button type="button" className="btn btn-success mt-4 ml-10 create-button">Thêm Lịch Sử Kiểm Kê
                </button>
                <button type="button" className="btn btn-primary mt-4 ml-1 excel-button">Xuất Excel
                </button>
            </div>
            {
                BaseTable("example", [
                    'Mã lịch sử',
                    'Mã tài sản',
                    'Ngày kiểm kê',
                    ''
                ])
            }
        </>
    )
}

async function getDataTable(hostname) {
    const data = await fetch(`${hostname}/api/lichsukiemke/getList`).then((res) => res.json());
    const data2 = await fetch(`${hostname}/api/taisan/select?id=MaTaiSan`).then((res) => res.json());
    return {
        props: {
            data: data,
            data2: data2
        },
    };
}