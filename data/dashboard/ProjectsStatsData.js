import {
    Briefcase,
    ListTask,
    People,
    Bullseye
} from 'react-bootstrap-icons';

import React, { useState, useEffect } from 'react';
import {Col} from "react-bootstrap";
import {StatRightTopIcon} from "../../widgets";

const ProjectsStats = () => {
    const [totalTaiSan, setTotalTaiSan] = useState(0);
    const [totalDonViSoHuu, setDonViSoHuu] = useState(0);
    const [totalGiaTriTS, setGiaTriTS] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/taisan/select?id=COUNT(*) as total');
                const data = await response.json();
                setTotalTaiSan(data[0].total);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData().then(r => r);

        const fetchData2 = async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/donvisohuu/select?id=COUNT(*) as total');
                const data = await response.json();
                setDonViSoHuu(data[0].total);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        fetchData2().then(r => r);

        const fetchData3 = async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/taisan/select?id=SUM(GiaTri) as total');
                const data = await response.json();
                setGiaTriTS(data[0].total);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        fetchData3().then(r => r);

    }, [setTotalTaiSan, setDonViSoHuu, setGiaTriTS]);

    const stats = [
        {
            id: 1,
            title: "Tài sản",
            value: totalTaiSan !== null ? totalTaiSan : 0, // Kiểm tra nếu totalTaiSan đã được cập nhật
            icon: <Briefcase size={18}/>,
            statInfo: '<span className="text-dark me-2">Số lượng</span>'
        },
        {
            id: 2,
            title: "Đơn vị sở hữu",
            value: totalDonViSoHuu !== null ? totalDonViSoHuu : 0, // Kiểm tra nếu totalDonViSoHuu đã được cập nhật
            icon: <People size={18}/>,
            statInfo: '<span className="text-dark me-2">Đơn vị</span>'
        },
        {
            id: 3,
            title: "Giá trị tất cả tài sản",
            value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalGiaTriTS),
            icon: <Bullseye size={18}/>,
            statInfo: '<span className="text-dark me-2">Tổng tất cả tài sản</span>'
        }
    ];

    return (
        <>
            {stats.map((item, index) => {
                return (
                    <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
                        <StatRightTopIcon info={item}/>
                    </Col>
                )
            })}
        </>
    );
};

export default ProjectsStats;
