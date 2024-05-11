import vbrequest from "vb-request";

export default async function POST(req, res) {
    try {
        const { id, name, andress, phone, pos, room, userid } = req.body;

        if (!id || !name || !andress || !phone || !pos || !room || !userid) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let resp = await vbrequest.post('nhanvien', '/edit/' + id + '/' + name + '/' + andress + '/' + phone + '/' + pos + '/' + room + '/' + userid);
        resp.body.getReader().read().then(({ value, done }) => {
            let result = new TextDecoder().decode(value);
            result = JSON.parse(result);

            if (result["message"]) {
                return res.redirect('/tables/nhanvien?error=' + result["message"]);
            }

            return res.redirect('/tables/nhanvien');
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}