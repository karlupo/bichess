const crypto = require('crypto');
const { WebSocketServer } = require('ws');
const express = require('express');
var app = express();
const fs = require('fs');
const sha512 = require('js-sha512');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { cookieJwtAuth } = require("../biChess/cookieJwtAuth");
const request = require('request');
const geoip = require('geoip-lite');
const countryCodeToFlagEmoji = require('./countryCodeToFlagEmoji');
const bodyParser = require('body-parser');
const { encode } = require('punycode');
const { exec } = require('child_process');
const { allowedNodeEnvironmentFlags } = require('process');
const e = require('express');
const { type } = require('os');
const { log } = require('console');
const { setDefaultHighWaterMark } = require('stream');

//Config variables
const jwtSecret = 'HhB+YhYavI@Blr6';
const defaultRanking = 700;

let defaultTime = 600;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.listen(3000);

app.set('view engine', 'ejs')

app.use(express.static('public'));

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());

app.get("/", (req, res) => {

    const token = req.cookies.token;
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            res.render('index');
        } else {

            res.render('index', { username: decoded.username });
        }
    });

})


app.get("/localplay", (req, res) => {
    jwt.verify(req.cookies.token, jwtSecret, (err, decoded) => {
        if (err) {
            res.render('localPlay')
        } else {

            res.render('localPlay', { username: decoded.username });
        }
    });
})

app.get("/computerplay", (req, res) => {
    jwt.verify(req.cookies.token, jwtSecret, (err, decoded) => {
        if (err) {
            res.render('botPlay');
        } else {

            res.render('botPlay', { username: decoded.username });
        }
    });
});

app.get("/login", (req, res) => {
    jwt.verify(req.cookies.token, jwtSecret, (err, decoded) => {
        if (err) {
            res.render('login');
        } else {

            res.render('login', { username: decoded.username });
        }
    });

})



app.get("/myprofile", cookieJwtAuth, (req, res) => {


    const ip = req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const geo = geoip.lookup(ip);
    let fileData;
    fs.readdir("profilepics", (err, files) => {
        if (err) {
            console.log('Fehler beim Lesen des Verzeichnisses:', err);
            return;
        }

        let filename;
        files.forEach((file) => {

            if (file == req.user.id + '.jpg') {
                filename = file;

            }
        });
        if (filename == undefined) {
            filename = "pb.jpg";
        }
        fs.readFile("profilepics/" + filename, (err, data) => {
            if (err) {
                console.log('Fehler beim Lesen der Datei:', err);
                return;

            }

            fileData = "data:image/jpeg;base64," + data.toString('base64');
            if (geo != null) {
                const flagEmoji = countryCodeToFlagEmoji(geo?.country);
                res.render('myProfile', { username: req.user.username, email: req.user.email, datecreated: req.user.datecreated, flag: flagEmoji, ranking: req.user.ranking, profilepic: fileData });
            } else {
                const flagEmoji = countryCodeToFlagEmoji('geo?.country');
                res.render('myProfile', { username: req.user.username, email: req.user.email, datecreated: req.user.datecreated, flag: '🌍', ranking: req.user.ranking, profilepic: fileData });
            }

        });


    });



});

app.get("/register", (req, res) => {
    jwt.verify(req.cookies.token, jwtSecret, (err, decoded) => {
        if (err) {
            res.render('register');
        } else {

            res.render('register', { username: decoded.username });
        }
    });
})

app.get("/impressum", (req, res) => {
    jwt.verify(req.cookies.token, jwtSecret, (err, decoded) => {
        if (err) {
            res.render('impressum');
        } else {

            res.render('impressum', { username: decoded.username });
        }
    });
});


app.post("/loginrequest", (req, res) => {
    const loginname = req.body.loginname;
    const password = req.body.password;
    fs.readFile('users.json', (err, data) => {
        if (err) throw err;

        const jsonData = JSON.parse(data);


        let i;
        for (i = 0; i < jsonData.length; i++) {
            if (jsonData[i].username == loginname || jsonData[i].email == loginname) {
                break;
            }

        }

        if (jsonData[i] != undefined) {
            if (jsonData[i].password == sha512(jsonData[i].salt + password)) {
                delete jsonData[i].password;
                const token = jwt.sign(jsonData[i], jwtSecret, { expiresIn: '14d' });
                res.cookie("token", token);

                res.redirect('/');
            } else {
                res.render('register', { info: 'Benutzername/Email/Passwort falsch' });

            }
        } else {
            res.redirect('/login');
        }
    });


});






app.post('/registerrequest', function (req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    fs.readFile('users.json', (err, data) => {
        if (err) throw err;

        const jsonData = JSON.parse(data);

        for (let i = 0; i < jsonData.length; i++) {
            if (jsonData[i].username == username || jsonData[i].email == email) {
                jwt.verify(req.cookies.token, jwtSecret, (err, decoded) => {
                    if (err) {
                        res.render('register', { info: 'Benutzername/Email schon vorhanden' });
                    } else {

                        res.render('register', { info: 'Benutzername/Email schon vorhanden', username: decoded.username });
                    }
                    return;
                });
            }
        }


        let salt = generateSalt();

        let date = new Date();
        if ((date.getMonth() + 1) % 12 == 0) {
            jsonData.push({ id: jsonData.length, username: username, email: email, password: sha512(salt + password), datecreated: date.getFullYear() + '-' + 1 + '-' + date.getDate(), salt: salt, ranking: defaultRanking });
        }

        jsonData.push({ id: jsonData.length, username: username, email: email, password: sha512(salt + password), datecreated: date.getFullYear() + '-' + (date.getMonth() + 1) % 12 + '-' + date.getDate(), salt: salt, ranking: defaultRanking });
        (JSON.stringify(jsonData))
        fs.writeFile('users.json', JSON.stringify(jsonData), (err) => {
            if (err) throw err;
            delete jsonData[jsonData.length - 1].password;
            const token = jwt.sign(jsonData[jsonData.length - 1], jwtSecret, { expiresIn: '14d' });
            res.cookie("token", token);

            ('Daten erfolgreich in users.json geschrieben');
            res.redirect('/');
        });
    });


});


function generateSalt() {
    let length = 20;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


app.post("/updateprofile", cookieJwtAuth, (req, res) => {
    console.log(req.body);
    let newUsername = req.body.username;
    let newPassword = req.body.password;
    let newEmail = req.body.email;
    let img = req.body.imgUpload;
    fs.readFile('users.json', (err, data) => {
        if (err) throw err;
        const token = req.cookies.token;
        jwt.verify(token, jwtSecret, (err, decoded) => {

            if (err) {
                res.render('index');
            }
            const jsonData = JSON.parse(data);
            for (let i = 0; i < jsonData.length; i++) {
                if ((newUsername == jsonData[i].username && newUsername != decoded.username) && (newEmail == jsonData[i].email && newEmail != decoded.email)) {
                    res.json({ message: 'Benutzername und Email schon vorhanden' });
                    return;
                }
                if (newUsername == jsonData[i].username && newUsername != decoded.username) {
                    res.json({ message: 'Benutzername schon vorhanden' });
                    return;
                } else if (newEmail == jsonData[i].email && newEmail != decoded.email) {
                    res.json({ message: 'Email schon vorhanden' });
                    return;
                }

            }
            console.log("Hallo")
            if (img != "") {
                let base64Data = img.replace(/^data:image\/jpeg;base64,/, "");

                fs.writeFile("profilepics/" + decoded.id + ".jpg", base64Data, 'base64', function (err) {
                    if (err) console.log(err);
                });
            }
            console.log("Chello")
            updateDatabase(newPassword, newUsername, newEmail, decoded, jsonData, res);
        });

    });
});

async function updateDatabase(password, username, email, decoded, jsonData, res) {
    for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].username == decoded.username) {
            jsonData[i].username = username;
            if (password != '') {
                jsonData[i].password = sha512(jsonData[i].salt + password);
            }
            jsonData[i].email = email;
            await fs.writeFile('users.json', JSON.stringify(jsonData), (err) => {
                if (err) throw err;
            });
            delete jsonData[i].password;
            const token = jwt.sign(jsonData[i], jwtSecret, { expiresIn: '14d' });
            res.cookie("token", token);
            res.redirect('/myprofile');
        }
    }
}





const stockfishProcess = exec('/home/Stockfish/src/stockfish');

function sendCommand(command, callback) {
    let output = '';
    let puttedOut = false;

    const onData = (data) => {
        (data.toString());
        if (data.toString().includes("bestmove")) {
            stockfishProcess.stdout.removeListener('data', onData);
            callback(data.toString());
            return;
        }
    };

    if (puttedOut) {
        return;
    }

    stockfishProcess.stdout.on('data', onData);

    stockfishProcess.stdin.write(`${command}\n`);
}

app.post("/getbestmove", (req, res) => {
    let fen = req.body.fen;
    let command = `position fen ${fen}`;
    let bestMoveSent = false;

    sendCommand(command, () => { }); // Leere Callback-Funktion, da die Antwort nicht verwendet wird
    sendCommand('go movetime 1000', (out) => {
        let splitted = out.split("\n");
        for (let i = 0; i < splitted.length; i++) {
            console.log(splitted[i]);
            if (splitted[i].includes("bestmove") && !bestMoveSent) {
                res.send(JSON.stringify(splitted[i].split(" ")[1]));
                bestMoveSent = true;
                return;
            }
        }
    });
});


// app.use((req, res, next) => {
//     (req.url);
//     next();
// }) 







//multiplayer
app.get("/playOnline", (req, res) => {
    res.redirect('/onlineplay')
});
app.get("/onlineplay", (req, res) => {
    let token = req.cookies.token;
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            res.redirect('/login');
        } else {

            fs.readFile("rooms.json", (err, data) => {
                if (err) res.redirect('/');
                else {
                    let found = false;
                    let rooms = JSON.parse(data);

                    for (let i = 0; i < rooms.length; i++) {
                        if (rooms[i].p1 == decoded.id) {

                            found = true;
                            if (rooms[i].p2 == -1) {

                                res.render('playOnline', { pe: "waiting for player", ps: decoded.username, psRanking: decoded.ranking, ownColor: rooms[i].colorp1, username: decoded.username });

                            }
                            else {
                                fs.readFile("users.json", (err, data) => {
                                    if (err) res.redirect('/');
                                    else {
                                        let users = JSON.parse(data);
                                        for (let j = 0; j < users.length; j++) {
                                            if (users[j].id == rooms[i].p2) {
                                                res.render('playOnline', { pe: users[j].username, ps: decoded.username, peRanking: users[j].ranking, psRanking: decoded.ranking, ownColor: rooms[i].colorp1, username: decoded.username });
                                            }
                                        }
                                    }
                                });
                            }
                        }
                        else if (rooms[i].p2 == decoded.id) {
                            found = true;
                            if (rooms[i].p1 == -1) {
                                res.render('playOnline', { pe: "waiting for player", ps: decoded.username, psRanking: decoded.ranking, ownColor: rooms[i].colorp1 == "White" ? "Black" : "White", username: decoded.username });

                            }
                            else {
                                fs.readFile("users.json", (err, data) => {
                                    if (err) res.redirect('/');
                                    else {
                                        let users = JSON.parse(data);
                                        for (let j = 0; j < users.length; j++) {
                                            if (users[j].id == rooms[i].p1) {
                                                (typeof rooms[i].colorp1)
                                                res.render('playOnline', { pe: users[j].username, ps: decoded.username, peRanking: users[j].ranking, psRanking: decoded.ranking, ownColor: rooms[i].colorp1 == "White" ? "Black" : "White", username: decoded.username });
                                            }
                                        }
                                    }
                                });
                            }
                        }

                    }
                    if (!found) {
                        res.render('onlinePlay', { username: decoded.username });
                    }
                }
            });
        }


    });

})




app.post("/queingrandom", (req, res) => {

    const token = req.cookies.token;


    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            ("err1")
            res.send(JSON.stringify("error"));
        } else {
            fs.readFile("rooms.json", (err, data) => {
                if (err) {
                    (err);
                } else {


                    let rooms = JSON.parse(data);
                    let id = "";
                    if (err) {
                        ("errr2");
                        res.send(JSON.stringify("error"));
                    };

                    let roomFound = false;


                    for (let i = 0; i < rooms.length; i++) {
                        if (rooms[i].p1 == -1 || rooms[i].p2 == -1) {
                            roomFound = true;
                            if (rooms[i].p1 == -1) {
                                rooms[i].p1 = decoded.id;
                            } else {
                                rooms[i].p2 = decoded.id;
                            }
                            id = rooms[i].id;
                            break;

                        }
                    }

                    if (!roomFound) {
                        id = generateSalt(10);
                        rooms.push({ id: id, p1: decoded.id, p2: -1, reserved: false, colorp1: Math.floor(Math.random() * 100) > 50 ? "White" : "Black", fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", clock1: defaultTime, clock2: defaultTime });
                    }


                    fs.writeFile("rooms.json", JSON.stringify(rooms), (err) => {
                        if (err) {
                            ("Error")
                            res.send(JSON.stringify("error"))
                        };
                    });
                    if (id != "") {
                        ("id")
                        res.send(JSON.stringify('ok'));
                    } else {
                        res.send(JSON.stringify("error"))
                    }
                }
            });

        }

    });

});


// let int = setInterval(() => {
// (count);
// }, 1000);
const wss = new WebSocketServer({ port: 8080, clientTracking: true });

wss.on('connection', (ws) => {
    (wss.clients.size, "clients connected")

    ws.on('error', () => {
        ("Client disconnected");
    });

    ws.on('error', () => {
        ("Client disconnected");
    });

    ws.on('message', (message) => {
        let data;
        try {
            data = JSON.parse(message);
            if (data.type == "cookie") {
                handleCookie(data, ws);
            } else if (data.type == "move") {
                handleMove(data, ws);
            }
        } catch (e) {
            ("Player with id: " + ws.id + " tried to crash the server");
        }


    });






});


function handleCookie(data, ws) {
    jwt.verify(data.data, jwtSecret, (err, decoded) => {
        if (err) (err);

        ws.id = decoded.id;

        fs.readFile("rooms.json", (err, data) => {
            let rooms = JSON.parse(data);
            let clockE, decodedFEN, clockS;
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].p1 == decoded.id) {
                    wss.clients.forEach((client) => {
                        if (client.id == rooms[i].p2 && client != ws) {
                            client.send(JSON.stringify({ type: "startGame", pe: decoded.username, ranking: decoded.ranking }));
                        }
                    });
                    clockE = rooms[i].clock2;
                    clockS = rooms[i].clock1;
                    decodedFEN = decodeFEN(rooms[i].fen);
                } else if (rooms[i].p2 == decoded.id) {
                    wss.clients.forEach((client) => {
                        if (client.id == rooms[i].p1 && client != ws) {
                            client.send(JSON.stringify({ type: "startGame", pe: decoded.username, ranking: decoded.ranking }));
                        }
                    });
                    decodedFEN = decodeFEN(rooms[i].fen);
                    clockE = rooms[i].clock1;
                    clockS = rooms[i].clock2;
                }
            }
            
            ws.send(JSON.stringify({ type: "move", pieces: decodedFEN[0], moveColor: decodedFEN[1], clockE: clockE, clockS: clockS }));

        });
    });
}

function handleMove(wsdata, ws) {
    console.log(wsdata)
    fs.readFile("rooms.json", (err, data) => {
        if (err) (err);
        let rooms = JSON.parse(data);
        for (let i = 0; i < rooms.length; i++) {
            let decodedFEN = decodeFEN(rooms[i].fen);

            if (rooms[i].p1 == ws.id) {
                if (decodedFEN[1] == rooms[i].colorp1 && wsdata.moveColor == decodedFEN[1]) {
                    switch (checkClock(wsdata, rooms, ws, i, "p1")) {
                        case 0:
                            checkMove(wsdata, decodedFEN, ws, rooms, i);
                            break;
                        case 1: wsdata.clock2 = rooms[i].clock2;
                            checkMove(wsdata, decodedFEN, ws, rooms, i);
                            break;
                    }

                } else {
                    updateSecurityLogs("Player with id: " + ws.id + " tried to move when it was not his turn", "Game Manipulation")
                }
            } else if (rooms[i].p2 == ws.id) {
                if (decodedFEN[1] == (rooms[i].colorp1 == "White" ? "Black" : "White") && wsdata.moveColor == decodedFEN[1]) {
                    switch (checkClock(wsdata, rooms, ws, i, "p2")) {
                        case 0: checkMove(wsdata, decodedFEN, ws, rooms, i);
                            break;
                        case 1: wsdata.clock2 = rooms[i].clock2;
                            checkMove(wsdata, decodedFEN, ws, rooms, i);
                            break;
                    }
                } else {
                    updateSecurityLogs("Player with id: " + ws.id + " tried to move when it was not his turn", "Game Manipulation")
                }
            }
        }
    });
}

function checkClock(wsdata, rooms, ws, i, player) {
    if (player == "p1") {

        if (wsdata.clockS > rooms[i].clock1) {
            updateSecurityLogs("Player with id: " + ws.id + " tried to manipulate his clock", "Game Manipulation");
            return false;
        }

        if (rooms[i].clock2 != wsdata.clockE) {
            updateSecurityLogs("Player with id: " + ws.id + " tried to manipulate the enemys clock", "Game Manipulation");
            return 1;
        }
        

    } else {
        
        if (wsdata.clockS > rooms[i].clock2) {
            updateSecurityLogs("Player with id: " + ws.id + " tried to manipulate his clock", "Game Manipulation");
            return false;
        }
        if (rooms[i].clock1 != wsdata.clockE) {
            updateSecurityLogs("Player with id: " + ws.id + " tried to manipulate the enemys clock", "Game Manipulation");
            return 1;
        }
    }
    return 0;
}

function sendNewBoardIfLegalMove(piece, wsdata, decodedFEN, ws, rooms, i) {
    if (isLegalMove(piece, wsdata.move, decodedFEN[0], decodedFEN[6])) {

        if (getMovePos(piece, wsdata.move) != false) {
            for (let k = 0; k < decodedFEN[0].length; k++) {
                if (decodedFEN[0][k].pos == wsdata.oldPiece.pos && decodedFEN[0][k].name == wsdata.oldPiece.name && decodedFEN[0][k].color == wsdata.oldPiece.color) {
                    decodedFEN[0][k].pos = getMovePos(piece, wsdata.move);
                    for (let l = 0; l < decodedFEN[0].length; l++) {

                        if (decodedFEN[0][l].pos == getMovePos(wsdata.oldPiece, wsdata.move) && decodedFEN[0][l].color != decodedFEN[0][k].color) {
                            decodedFEN[0].splice(l, 1);
                            break;
                        }
                    }
                    break;
                }
            }

            let enPassentChance = "-";
            let originalPosY = parseInt(wsdata.oldPiece.pos.charAt(1));

            if (parseInt(getMovePos(wsdata.oldPiece, wsdata.move).charAt(1)) - originalPosY == 2 || parseInt(getMovePos(wsdata.oldPiece, wsdata.move).charAt(1)) - originalPosY == -2) {
                enPassentChance = getMovePos(wsdata.oldPiece, wsdata.move).charAt(0) + (originalPosY + (parseInt(getMovePos(wsdata.oldPiece, wsdata.move).charAt(1)) - originalPosY) / 2);
            }



            rooms[i].fen = generateFEN(decodedFEN[0], decodedFEN[1] == "White" ? "Black" : "White", enPassentChance);
            if(ws.id == rooms[i].p1){
                rooms[i].clock1=wsdata.clockS;
                rooms[i].clock2=wsdata.clockE;
            }else if(ws.id == rooms[i].p2){
                rooms[i].clock1=wsdata.clockE;
                rooms[i].clock2=wsdata.clockS;
            }
            fs.writeFile("rooms.json", JSON.stringify(rooms), (err) => {
                if (err) {
                    console.log("Error")
                };
            });
            if (rooms[i].p1 != -1) {
                wss.clients.forEach((client) => {
                    if (client.id == rooms[i].p1) {
                        client.send(JSON.stringify({ type: "move", pieces: decodedFEN[0], moveColor: decodedFEN[1] == "White" ? "Black" : "White", clockE: wsdata.clock2, clockS: wsdata.clock1 }));
                    }
                });
            }

            if (rooms[i].p2 != -1) {
                wss.clients.forEach((client) => {
                    if (client.id == rooms[i].p2) {
                        client.send(JSON.stringify({ type: "move", pieces: decodedFEN[0], moveColor: decodedFEN[1] == "White" ? "Black" : "White", clockE: wsdata.clock1, clockS: wsdata.clock2 }));
                    }
                });
            }
        }

    } else {
        updateSecurityLogs("Player with id: " + ws.id + " tried to make a illegal move", "Game Manipulation")
    }
}

function checkMove(wsdata, decodedFEN, ws, rooms, i) {
    let piece = null;
    for (let j = 0; j < decodedFEN[0].length; j++) {
        if (decodedFEN[0][j].pos == wsdata.oldPiece.pos && decodedFEN[0][j].name == wsdata.oldPiece.name && decodedFEN[0][j].color == wsdata.oldPiece.color) {
            piece = decodedFEN[0][j];
            break;
        }
    }
    if (piece != null) {
        if (decodedFEN[1] == "Black") console.log(piece.moves, wsdata.move, piece.color);

        let canContinue = false;
        for (let j = 0; j < piece.moves.length; j++) {
            for (let k = 0; k < 8; k++) {
                if (piece.moves[j].replaceAll("I", k) == wsdata.move) {
                    canContinue = true;
                    break;
                }

            }
        }

        if (piece.moves.includes(wsdata.move) || canContinue) {
            sendNewBoardIfLegalMove(piece, wsdata, decodedFEN, ws, rooms, i);
        } else {
            updateSecurityLogs("Player with id: " + ws.id + " tried to make a move that doesn't exist", "Game Manipulation")
        }
    } else {
        updateSecurityLogs("Player with id: " + ws.id + " tried to move a piece that does not exist", "Game Manipulation")
    }
}

//Output: pieces Array, curColor(b, w), casteling White King Side, casteling White Queen Side, casteling Black King Side, casteling Black Queen Side, en passant field, half move clock, full move number
function decodeFEN(input) {
    let decodedFEN = [];
    let pieces = [];
    let row = 1;
    let column = 1;
    let splitted = input.split(" ");
    let fenString = splitted[0];
    for (let i = 0; i < fenString.length; i++) {
        if (fenString.charAt(i) == '/') {
            column++;
            row = 1;
        } else if (!isNaN((Number)(fenString.charAt(i)))) {
            row += (Number)(fenString.charAt(i));
        } else {
            let color;
            if (fenString.charAt(i).toUpperCase() == fenString.charAt(i)) {
                color = "White";
            } else {
                color = "Black";
            }

            if (fenString.charAt(i).toUpperCase() == 'R') {
                pieces.push(new Rook(((String)(row) + (String)(column)), color));
            } else if (fenString.charAt(i).toUpperCase() == 'N') {
                pieces.push(new Knight(((String)(row) + (String)(column)), color));
            } else if (fenString.charAt(i).toUpperCase() == 'B') {
                pieces.push(new Bishop(((String)(row) + (String)(column)), color));
            } else if (fenString.charAt(i).toUpperCase() == 'Q') {
                pieces.push(new Queen(((String)(row) + (String)(column)), color));
            } else if (fenString.charAt(i).toUpperCase() == 'K') {
                pieces.push(new King(((String)(row) + (String)(column)), color));
            } else if (fenString.charAt(i).toUpperCase() == 'P') {
                pieces.push(new Pawn(((String)(row) + (String)(column)), color));
            }
            row++;
        }
    }
    decodedFEN.push(pieces);
    decodedFEN.push(splitted[1] == "w" ? "White" : "Black");
    if (splitted[2].includes("K")) {
        decodedFEN.push(true);
    } else {
        decodedFEN.push(false);
    }

    if (splitted[2].includes("Q")) {
        decodedFEN.push(true);
    } else {
        decodedFEN.push(false);
    }

    if (splitted[2].includes("k")) {
        decodedFEN.push(true);
    } else {
        decodedFEN.push(false);
    }

    if (splitted[2].includes("q")) {
        decodedFEN.push(true);
    } else {
        decodedFEN.push(false);
    }

    decodedFEN.push(splitted[3]);

    decodedFEN.push(splitted[4]);

    decodedFEN.push(splitted[5]);


    return decodedFEN;
}

function updateSecurityLogs(log, type) {
    fs.readFile("securityLogs.txt", (err, data) => {
        if (err) { return; }
        let logs = data.toString().split("\n");
        let date = new Date();
        if (logs[0] == "") {
            logs[0] = "//Security Logs//"
        }

        logs.push(date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ": " + log + "\t\t Type: " + type);
        fs.writeFile("securityLogs.txt", logs.join("\n"), (err) => {
            if (err) { return; }
        });
    });
}

//Pieces Classes Serverside
class Piece {

    //Pos: AnchorPoint: Links Oben; Erste Zahl: Column, Zweite Zahl: Row;
    pos;

    //Black or White
    color;

    //z.B. [1Up, 1Left, 1Right/2Left, IRightDown] --> Kann entweder eins Hoch, eins Left oder 1Hoch und 2Left gehen oder Unendlich nach Rechts Unten
    moves;

    //z.B. Pawn, Rook, Queen
    name;

    constructor(pos, color, moves, name) {
        this.pos = pos;
        this.color = color;
        this.moves = moves;
        this.name = name;
    }
}

class Bishop extends Piece {
    constructor(pos, color) {
        super(pos, color, ["IL/IU", "IL/ID", "IR/IU", "IR/ID"], "Bishop");
    }
}

class King extends Piece {
    constructor(pos, color) {
        super(pos, color, ["1U", "1D", "1L", "1R", "1L/1U", "1R/1U", "1L/1D", "1R/1D"], "King")
    }
}

class Knight extends Piece {
    constructor(pos, color) {
        super(
            pos,
            color,
            [
                "2R/1U",
                "1R/2U",
                "1L/2U",
                "2L/1U",
                "2R/1D",
                "1R/2D",
                "1L/2D",
                "2L/1D",
            ],
            "Knight"
        );
    }
}

class Pawn extends Piece {
    firstMove = false;
    constructor(pos, color) {
        if (color == "Black") {
            super(pos, color, ["1D", "2D", "1D/1L", "1D/1R"], "Pawn");
        } else {
            super(pos, color, ["1U", "2U", "1U/1L", "1U/1R"], "Pawn");
        }
    }
}

class Queen extends Piece {
    constructor(pos, color) {
        super(pos, color, ["IU", "IL", "IR", "ID", "IL/ID", "IL/IU", "IR/IU", "IR/ID"], "Queen");
    }
}

class Rook extends Piece {
    constructor(pos, color) {
        super(pos, color, ["IU", "ID", "IL", "IR"], "Rook");
    }
}


function isLegalMove(piece, move, piecesArr, enPassentChance) {
    let pieces = piecesArr;
    let movePos = getMovePos(piece, move);
    if (piece.name == "Pawn" && move.includes("2")) {
        if (piece.color == "White" && piece.pos.charAt(1) != "7") {
            console.log(piece.pos.charAt(1));
            return false;
        } else if (piece.color == "Black" && piece.pos.charAt(1) != "2") {
            console.log(piece.pos.charAt(1));
            return false;
        }
    }

    if (piece.name == "Pawn" && move.includes("/")) {
        let canContinue = false;
        for (let j = 0; j < pieces.length; j++) {
            if (pieces[j].pos == getMovePos(piece, move) || (enPassentChance == getMovePos(piece, move))) {
                canContinue = true;
            }
        }
        if (!canContinue) {
            return false;
        }
    } else if (piece.name == "Pawn" && !move.includes("/")) {
        let canContinue = true;
        for (let j = 0; j < pieces.length; j++) {
            if (pieces[j].pos == getMovePos(piece, move)) {
                canContinue = false;
            }
        }
        if (!canContinue) {
            return false;
        }
    }
    if (piece.name == "Pawn" && move.includes("2")) {
        for (let j = 0; j < pieces.length; j++) {
            if (pieces[j].pos == getMovePos(piece, move)) {
                return false;
            }
        }
    }

    if (piece.name == "Pawn" && checkMoveState(movePos, piece, pieces) == "take" && (move == "1D" || move == "1U")) {
        return false;
    }

    if (!movePos || !leadsToCheck(piece, move, pieces)) {
        return false;
    }

    if (!checkMoveState(movePos, piece, pieces)) {
        return false;
    }
    return true;
}

function getMovePos(piece, move) {
    newPos = (String)(piece.pos);
    move = (String)(move);
    if (move.includes("U")) {
        if (parseInt(newPos.charAt(1)) - parseInt(move.charAt((move.indexOf("U") - 1))) <= 0) {
            return false;
        }

        newPos = newPos.charAt(0) + (parseInt(newPos.charAt(1)) - parseInt(move.charAt((move.indexOf("U") - 1))));
    }
    if (move.includes("D")) {

        if (parseInt(newPos.charAt(1)) + parseInt(move.charAt((move.indexOf("D") - 1))) >= 9) {
            return false;
        }

        newPos = newPos.charAt(0) + (parseInt(newPos.charAt(1)) + parseInt(move.charAt((move.indexOf("D") - 1))));
    }
    if (move.includes("L")) {

        if ((parseInt(newPos.charAt(0)) - parseInt(move.charAt((move.indexOf("L") - 1)))) <= 0) {
            return false;
        }

        newPos = (parseInt(newPos.charAt(0)) - parseInt(move.charAt((move.indexOf("L") - 1)))) + newPos.charAt(1);
    }
    if (move.includes("R")) {

        if ((parseInt(newPos.charAt(0)) + parseInt(move.charAt((move.indexOf("R") - 1)))) >= 9) {
            return false;
        }

        newPos = (parseInt(newPos.charAt(0)) + parseInt(move.charAt((move.indexOf("R") - 1)))) + newPos.charAt(1);
    }
    return newPos;
}

function checkMoveState(movePos, piece, pieces) {
    // if (movePos == enPassentChance && piece.name == "Pawn") {
    //     return "take";
    // }
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].pos == movePos) {
            if (pieces[i].color == piece.color) {
                return false;
            } else {
                return "take";
            }
        }
    }
    return "move";
}

function leadsToCheck(piece, move, pieces) {
    movePos = getMovePos(piece, move);
    if (piece.name == "Pawn" && !move.includes("/")) {
        for (let i = 0; i < pieces.length; i++) {
            if (movePos == piece.pos) return false;
        }
    }
    piecesTemp = JSON.parse(JSON.stringify(pieces))
    if (isFreesquare(movePos, pieces)) {
        for (let i = 0; i < piecesTemp.length; i++) {
            if (piecesTemp[i].pos == piece.pos) {
                piecesTemp[i].pos = movePos;
            }
        }
    } else {
        let wasPlaced = false;
        for (let i = 0; i < piecesTemp.length; i++) {
            if (piecesTemp[i].pos == movePos) {
                piecesTemp[i] = JSON.parse(JSON.stringify(piece));
                piecesTemp[i].pos = movePos;
                wasPlaced = true;
            }
        }
        if (wasPlaced) {
            for (let i = 0; i < piecesTemp.length; i++) {
                if (piecesTemp[i].pos == piece.pos) {
                    piecesTemp.splice(i, 1);
                }
            }
        }
    }
    tempColor = piece.color;
    for (let i = 0; i < piecesTemp.length; i++) {
        if (piecesTemp[i].name == "King" && piecesTemp[i].color == tempColor) {
            king = piecesTemp[i];
        }
    }
    for (let i = 0; i < piecesTemp.length; i++) {
        if (piecesTemp[i].color != tempColor) {
            let moves = piecesTemp[i].moves;
            for (let j = 0; j < moves.length; j++) {
                if (!moves[j].includes("I")) {
                    if (piecesTemp[i].name == "Pawn" && !moves[j].includes("/")) continue;
                    let movePos = getMovePos(piecesTemp[i], moves[j]);
                    if (movePos == king.pos) {
                        return false;
                    }
                } else {
                    for (let k = 1; k <= 8; k++) {
                        let moveTemp = moves[j].replaceAll("I", k)
                        let movePos = getMovePos(piecesTemp[i], moveTemp);
                        if (movePos == king.pos) {
                            if (!isBlocked(moves[j], piecesTemp[i], king.pos, piecesTemp)) return false;
                        }
                    }
                }
            }
        }
    }
    return true;
}

function isFreesquare(pos, pieces) {
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].pos == pos) return false;
    }
    return true;
}


function isBlocked(move, posPiece, endPiecepos, piecesTemp) {
    if (!posPiece.moves[0].includes("I")) {
        return posPiece.color == curColor;
    }
    move = (String)(move);
    for (let k = 1; k <= 8; k++) {
        let moveTemp = move.replaceAll("I", k)
        let movePos = getMovePos(posPiece, moveTemp);
        if (movePos == endPiecepos) {
            return false;
        }
        for (let i = 0; i < piecesTemp.length; i++) {
            if (piecesTemp[i].pos == movePos) {
                return true;
            }
        }
    }
    return false;
}

function generateFEN(pieces, newColor, enPassentChance) {
    const fenNameMap = PiecesFenMap();
    let fen = "";
    let empty = 0;
    let set = false;
    for (let row = 1; row <= 8; row++) {
        fen += empty;
        if (!set) fen += "/";
        empty = 0;
        for (let col = 1; col <= 8; col++) {
            set = false;
            for (let i = 0; i < pieces.length; i++) {
                if (pieces[i].pos == col + "" + row) {
                    if (empty > 0) {
                        fen += empty;
                        empty = 0;
                    }
                    fen += fenNameMap.get(pieces[i].name + pieces[i].color);
                    set = true;
                }
            }
            if (!set) empty++;
        }
    }
    if (newColor == "White") {
        return fen.replaceAll("0", "/").substring(2) + " w - " + enPassentChance + " " + 4 + " " + 3;
    }
    return fen.replaceAll("0", "/").substring(2) + " b - " + enPassentChance + " " + 4 + " " + 3;
}

function PiecesFenMap() {
    let fenNameMap = new Map();
    fenNameMap.set("RookBlack", "r");
    fenNameMap.set("KnightBlack", "n");
    fenNameMap.set("BishopBlack", "b");
    fenNameMap.set("QueenBlack", "q");
    fenNameMap.set("KingBlack", "k");
    fenNameMap.set("PawnBlack", "p");
    fenNameMap.set("RookWhite", "R");
    fenNameMap.set("KnightWhite", "N");
    fenNameMap.set("BishopWhite", "B");
    fenNameMap.set("QueenWhite", "Q");
    fenNameMap.set("KingWhite", "K");
    fenNameMap.set("PawnWhite", "P");
    return fenNameMap;
}