import vbrequest from "vb-request";

export default async function POST(req, res) {
    try {
        const { id, idts, day} = req.body;

        if (!id || !idts || !day) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let resp = await vbrequest.post('lichsukiemke', '/edit/' + id + '/' + idts + '/' + day);
        resp.body.getReader().read().then(({ value, done }) => {
            let result = new TextDecoder().decode(value);
            result = JSON.parse(result);

            if (result["message"]) {
                return res.redirect('/tables/lichsukiemke?error=' + result["message"]);
            }

            return res.redirect('/tables/lichsukiemke');
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}