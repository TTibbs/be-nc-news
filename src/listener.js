const app = require("./app.js");

app.listen(9090, (err) => {
    if (err) console.log("Server didn't load", err);
    else console.log("Listening on port 9090");
})
