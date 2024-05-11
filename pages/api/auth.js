import vbrequest from "vb-request";

export default async function POST(req, res) {
    try {
        const { username, password } = await req.body;

        const resp = await vbrequest.get('nguoidung', '/search/Username/' + username);
        resp.body.getReader().read().then(({ value, done }) => {
            let result = new TextDecoder().decode(value);
            result = JSON.parse(result);
            if (result["result"]) {
                if (result["message"]) return res.status(400).json({ message: "Invalid credentials" });
                if (result["result"][0]["Password"] === password) {
                    console.log("Login successful")
                    return res.status(200).json({ message: "Login successful" });
                } else {
                    return res.status(401).json({ message: "Invalid credentials" });
                }
            } else {
                return res.status(401).json({ message: "Invalid credentials" });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}