import vbrequest from "vb-request";

export default async function POST(req, res) {
    try {
        const { id, name, owner, address, phone, info } = req.body;

        if (!id || !name || !owner || !address || !phone || !info) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let resp = await vbrequest.post('donvisohuu', '/edit/' + id + '/' + name + '/' + owner + '/' + btoa(address) + '/' + phone + '/' + info);
        resp.body.getReader().read().then(({ value, done }) => {
            let result = new TextDecoder().decode(value);
            result = JSON.parse(result);

            if (result["message"]) {
                return res.redirect('/tables/donvisohuu?error=' + result["message"]);
            }

            var queryParam = encodeURIComponent('success') + '=' + encodeURIComponent('Cập nhật đơn vị sở hữu thành công');

            return res.redirect('/tables/donvisohuu?' + queryParam);
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}