// import node module libraries
import {Fragment} from "react";
import {Col, Row, Image} from "react-bootstrap";
import Link from "next/link";

// import blank layout, header and footer to override default layout
import NotFound from "layouts/NotFound";

const Error404 = () => {
    return (
        <Fragment>
            <Row>
                <Col sm={12}>
                    <div className="text-center">
                        <div className="mb-3">
                            <Image
                                src="/images/error/404-error-img.png"
                                alt=""
                                className="img-fluid"
                            />
                        </div>
                        <h1 className="display-4 fw-bold">Trang này không được tìm thấy :((</h1>
                        <p className="mb-4">
                            Hoặc trang này không tồn tại hoặc đã bị xóa.
                        </p>
                        <Link href="/" className="btn btn-primary">
                            Go Home
                        </Link>
                    </div>
                </Col>
            </Row>
        </Fragment>
    );
};

Error404.Layout = NotFound;

export default Error404;
