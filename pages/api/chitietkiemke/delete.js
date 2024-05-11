import vbrequest from "vb-request";

export default async function POST(req, res) {
    try {
        if (!req.query.id) {
            return res.status(400).json({ message: "Missing id" });
        }

        let resp = await vbrequest.del('chitietkiemke', '/delete/' + req.query.id);
        resp.body.getReader().read().then(({ value, done }) => {
            let result = new TextDecoder().decode(value);
            console.log(result);
            result = JSON.parse(result);

            if (result["message"]) {
                return res.redirect('/tables/chitietkiemke?error=' + atob(result["message"]));
            }

            return res.redirect('/tables/chitietkiemke');
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}