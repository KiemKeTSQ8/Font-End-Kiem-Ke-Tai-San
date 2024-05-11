import vbrequest from "vb-request";

export default async function POST(req, res) {
    try {
        const { id, name, pass, idcv } = req.body;

        if (!id || !name || !pass || !idcv) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let resp = await vbrequest.post('nguoidung', '/add/' + id + '/' + name + '/' + pass + '/' + idcv);
        resp.body.getReader().read().then(({ value, done }) => {
            let result = new TextDecoder().decode(value);
            result = JSON.parse(result);

            if (result["message"]) {
                return res.redirect('/tables/nguoidung?error=' + result["message"]);
            }

            return res.redirect('/tables/nguoidung');
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}