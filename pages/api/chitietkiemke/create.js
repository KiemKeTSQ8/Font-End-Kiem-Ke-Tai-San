import vbrequest from "vb-request";

export default async function POST(req, res) {
    try {
        const { idct, idkt, idts, value, cost } = req.body;

        if (!idct || !idkt || !idts || !value || !cost) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let resp = await vbrequest.post('chitietkiemke', '/add/' + idct + '/' + idkt + '/' + idts + '/' + value + '/' + cost);
        resp.body.getReader().read().then(({ value, done }) => {
            let result = new TextDecoder().decode(value);
            result = JSON.parse(result);

            if (result["message"]) {
                return res.redirect('/tables/chitietkiemke?error=' + result["thông báo"]);
            }

            return res.redirect('/tables/chitietkiemke');
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}