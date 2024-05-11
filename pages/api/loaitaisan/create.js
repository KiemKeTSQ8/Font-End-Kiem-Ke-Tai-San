import vbrequest from "vb-request";

export default async function POST(req, res) {
    try {
        const { id, name, info, guide } = req.body;

        if (!id || !name || !info || !guide) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let resp = await vbrequest.post('loaitaisan', '/add/' + id + '/' + name + '/' + info + '/' + guide);
        resp.body.getReader().read().then(({ value, done }) => {
            let result = new TextDecoder().decode(value);
            result = JSON.parse(result);

            if (result["message"]) {
                return res.redirect('/tables/loaitaisan?error=' + result["message"]);
            }

            return res.redirect('/tables/loaitaisan');
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}