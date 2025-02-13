const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const sql = require("./db/db");

const sessions = {};

function parseCookies (request) {
    const list = {};
    const cookieHeader = request.headers?.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function(cookie) {
        let [ name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });

    return list;
}

const server = http.createServer((req, res) => {
    console.log(req.url);

    if (req.method === "POST" && req.url === "/register") {
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const formData = querystring.parse(body);
            const { email, fname, lname, password } = formData;

            const sqlQuery = "INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)";
            sql.query(sqlQuery, [email, fname, lname, password], (err, result) => {
                if (err) {
                    console.error(err);
                    let message = "Error registering user";

                    if(err.errno === 1062){
                        message = "An account with this email already exists.";
                    }

                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: message }));
                    return;
                }
                console.log("User registered:", email);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Registration successful" }));
            });
        });
    }
    else if(req.method === "POST" && req.url === "/login"){
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const formData = querystring.parse(body);
            const { email, password } = formData;
            const sqlQuery = "SELECT * FROM users WHERE email = ?";

            sql.query(sqlQuery, [email], (err, result)=>{
                if (err) {
                    console.error(err);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Error logging in user" }));
                    return;
                }

                const user = result[0];
                const passwordInDatabase = user.password;

                if(passwordInDatabase === password){

                    const sessionId = Math.floor(Math.random() * 100000);
                    sessions[sessionId] = { id: user.id, email: user.email, name: user.first_name, lastName: user.last_name };
                    // console.log("Session ID: " + sessionId);

                    res.writeHead(200, {
                        "Content-Type": "application/json",
                        "Set-Cookie": `sessionId=${sessionId}; HttpOnly`
                    });

                    res.end(JSON.stringify({ message: "Login successful" }));
                }
                else{
                    res.writeHead(401, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Invalid email or password!" }));
                }

            })
        });
    }

    else if(req.method === "POST" && req.url === "/logout"){
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Set-Cookie": `sessionId=; HttpOnly`
        });

        res.end(JSON.stringify({ message: "Logout successful" }));
    }

    else if(req.method === "POST" && req.url === "/change-name"){
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const formData = querystring.parse(body);
            const { firstName, lastName } = formData;
            const sessionId = parseCookies(req).sessionId;
            const user = sessions[sessionId];
            sessions[sessionId].name = firstName;
            sessions[sessionId].lastName = lastName;
            const sqlQuery = "UPDATE users SET first_name =?, last_name = ? WHERE id = ?";

            sql.query(sqlQuery, [firstName, lastName, user.id], (err, result)=>{
                if (err) {
                    console.error(err);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Error changing names" }));
                    return;
                }
            });
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Names changed successfully" }));
        });
    }

    else if(req.method == "POST" && req.url === "/change-password"){
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const formData = querystring.parse(body);
            const {password} = formData;
            const sessionId = parseCookies(req).sessionId;
            const user = sessions[sessionId];
            sessions[sessionId].password = password;
            const sqlQuery = "UPDATE users SET password = ? WHERE id = ?";

            sql.query(sqlQuery, [password, user.id], (err, result)=>{
                if (err) {
                    console.error(err);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Error changing password" }));
                    return;
                }
            });
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Password changed successfully" }));
        });
    }

    else if (req.method === "GET" && req.url === "/profile-fetch-data") {
        const cookies = parseCookies(req);
    
        if (!cookies.sessionId || !sessions[cookies.sessionId]) {
            res.writeHead(401, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Unauthorized" }));
        }
    
        const user = sessions[cookies.sessionId];
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ user }));
    }
    else {
        if (req.url === "/") {
            req.url = "/login";
        }
        
        let filePath = path.join(__dirname, "views", req.url);

        if (path.extname(req.url) === "") {
            filePath += ".html";
        }

        let contentType = "text/html";
        if (path.extname(req.url) === ".js") {
            contentType = "text/javascript";
        }
        else if(path.extname(req.url) === ".css"){
            contentType = "text/css";
        }

        fs.readFile(filePath, (error, data) => {
            if (error) {
                console.log(error);
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>Error 404 - Not Found</h1>");
            } else {
                res.writeHead(200, { "Content-Type": contentType });
                res.end(data);
            }
        });
    }
});

server.listen(3000, "localhost", () => {
    console.log("Listening on port 3000...");
});
