import vbrequest from "vb-request";

export default async function POST(req, res) {
    try {
        const { id, idtrp, namepb, slnv, info } = req.body;

        if (!id || !idtrp || !namepb || !slnv || !info) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let resp = await vbrequest.post('phongban', '/add/' + id + '/' + idtrp + '/' + namepb + '/' + slnv + '/' + info);
        resp.body.getReader().read().then(({ value, done }) => {
            let result = new TextDecoder().decode(value);
            result = JSON.parse(result);

            if (result["message"]) {
                return res.redirect('/tables/phongban?error=' + result["message"]);
            }

            return res.redirect('/tables/phongban');
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}