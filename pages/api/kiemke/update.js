import vbrequest from "vb-request";

export default async function POST(req, res) {
    try {
        const { id, day, idnv, cost } = req.body;

        if (!id || !day || !idnv || !cost) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let resp = await vbrequest.post('kiemke', '/edit/' + id + '/' + day + '/' + idnv + '/' + cost);
        resp.body.getReader().read().then(({ value, done }) => {
            let result = new TextDecoder().decode(value);
            result = JSON.parse(result);

            if (result["message"]) {
                return res.redirect('/tables/kiemke?error=' + result["message"]);
            }

            var queryParam = encodeURIComponent('success') + '=' + encodeURIComponent('Cập nhật kiểm kê thành công');

            return res.redirect('/tables/kiemke?' + queryParam);
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}