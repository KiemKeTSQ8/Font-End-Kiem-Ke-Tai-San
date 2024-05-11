import vbrequest from "vb-request";

export default async function GET(req, res) {
    try {
        if (!req.query.id) {
            return res.status(400).json({ message: "Missing id" });
        }

        let dk = "1=1";
        if (req.query.value) dk = req.query.value;

        console.log(req.query.value);

        let response = await vbrequest.get('taisan', '/select/' + req.query.id + '/' + dk);
        response.body.getReader().read().then(({ value, done }) => {
            let result = new TextDecoder().decode(value);
            return res.status(200).json(JSON.parse(result));
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}