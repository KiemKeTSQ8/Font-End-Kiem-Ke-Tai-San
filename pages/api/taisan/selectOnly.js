import vbrequest from "vb-request";

export default async function GET(req, res) {
    try {
        if (!req.query.id || !req.query.value) {
            return res.status(400).json({ message: "Missing id or value" });
        }

        let response = await vbrequest.get('taisan', '/selectOnly/' + req.query.id + '/' + req.query.value);
        response.body.getReader().read().then(({ value, done }) => {
            let result = new TextDecoder().decode(value);
            return res.status(200).json(JSON.parse(result));
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}