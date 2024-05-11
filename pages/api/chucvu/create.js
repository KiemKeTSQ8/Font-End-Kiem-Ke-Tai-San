import vbrequest from "vb-request";

export default async function POST(req, res) {
    try {
        const { id, name, cost, info } = req.body;

        if (!id || !name || !cost || !info) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let resp = await vbrequest.post('chucvu', '/add/' + id + '/' + name + '/' + cost + '/' + info);
        resp.body.getReader().read().then(({ value, done }) => {
            let result = new TextDecoder().decode(value);
            result = JSON.parse(result);

            if (result["message"]) {
                return res.redirect('/tables/chucvu?error=' + result["message"]);
            }

            return res.redirect('/tables/chucvu');
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}