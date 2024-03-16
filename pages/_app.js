// import node module libraries
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import SSRProvider from 'react-bootstrap/SSRProvider';
import { Analytics } from '@vercel/analytics/react';

// import theme style scss file
import 'styles/theme.scss';

// import default layouts
import DefaultDashboardLayout from 'layouts/DefaultDashboardLayout';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pageURL = process.env.baseURL + router.pathname;
  const title = "Kiểm Kê - Viện Kiểm Soát Quận 8 - HCM - Vietnam";
  const description = "Phần mềm dùng để kiểm kê tài sản, thiết bị, vật tư, hàng hóa, ... của Viện Kiểm Soát Quận 8 - HCM - Vietnam."
  const keywords = "Kiểm Kê, Viện Kiểm Soát Quận 8, HCM, Vietnam, Kiểm Kê Tài Sản, Kiểm Kê Thiết Bị, Kiểm Kê Vật Tư, Kiểm Kê Hàng Hóa, Kiểm Kê Công Cụ, Kiểm Kê Phương Tiện, Kiểm Kê Đất Đai, Kiểm Kê Nhà Xưởng, Kiểm Kê Kho Bãi, Kiểm Kê Công Trình, Kiểm Kê Công Nợ, Kiểm Kê Công Việc, Kiểm Kê Nhân Sự, Kiểm Kê Tài Chính, Kiểm Kê Kế Toán, Kiểm Kê Quản Trị, Kiểm Kê Hệ Thống, Kiểm Kê Dữ Liệu, Kiểm Kê Bảo Mật, Kiểm Kê An Toàn, Kiểm Kê Môi Trường, Kiểm Kê Sức Khỏe, Kiểm Kê Vệ Sinh, Kiểm Kê An Ninh, Kiểm Kê Trật Tự, Kiểm Kê Hòa Bình, Kiểm Kê Pháp Luật, Kiểm Kê Đạo Đức, Kiểm Kê Tâm Linh, Kiểm Kê Văn Hóa, Kiểm Kê Xã Hội, Kiểm Kê Kinh Tế, Kiểm Kê Chính Trị, Kiểm Kê Quốc Phòng, Kiểm Kê An Ninh, Kiểm Kê Trật Tự, Kiểm Kê Hòa Bình, Kiểm Kê Pháp Luật, Kiểm Kê Đạo Đức, Kiểm Kê Tâm Linh, Kiểm Kê Văn Hóa, Kiểm Kê Xã Hội, Kiểm Kê Kinh Tế, Kiểm Kê Chính Trị, Kiểm Kê Quốc Phòng, Kiểm Kê An Ninh, Kiểm Kê Trật Tự, Kiểm Kê Hòa Bình, Kiểm Kê Pháp Luật, Kiểm Kê Đạo Đức, Kiểm Kê Tâm Linh"

  // Identify the layout, which will be applied conditionally
  const Layout = Component.Layout || (router.pathname.includes('dashboard') ? 
  (router.pathname.includes('instructor') || router.pathname.includes('student') ? 
  DefaultDashboardLayout : DefaultDashboardLayout) : DefaultDashboardLayout)
  
  return (
    <SSRProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content={keywords} />
        <link rel="shortcut icon" href="/icon.png" type="image/png" />
      </Head>
      <NextSeo
        title={title}
        description={description}
        canonical={pageURL}
        openGraph={{
          url: pageURL,
          title: title,
          description: description,
          site_name: process.env.siteName
        }}
      />
        <Layout>
          <Component {...pageProps} />
          <Analytics />
        </Layout>
    </SSRProvider>
  )
}

export default MyApp
