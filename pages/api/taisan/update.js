import vbrequest from "vb-request";

export default async function POST(req, res) {
    try {
        const { id, name, cost, day, idts, iddv } = req.body;

        if (!id || !name || !cost || !day || !idts || !iddv) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let resp = await vbrequest.post('taisan', '/edit/' + id + '/' + name + '/' + cost + '/' + day + '/' + idts + '/' + iddv);
        resp.body.getReader().read().then(({ value, done }) => {
            let result = new TextDecoder().decode(value);
            result = JSON.parse(result);

            if (result["message"]) {
                return res.redirect('/tables/taisan?error=' + result["message"]);
            }

            return res.redirect('/tables/taisan');
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}