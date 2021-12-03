let fs = require("fs");
let r =require("rethinkdb");
let users = { ...(
    JSON.parse(
        // @ts-ignore
        fs.readFileSync(__dirname + "/user.json")
    )
) };
// console.log(users);return
let selectedUserVal = [];

for(let user in users) {
    let newUser = {
        email: users[user].email,
        phone: users[user].phone_number,
        password: users[user].password
    }
    selectedUserVal.push(newUser);
    // console.log(newUser);
}


r.connect( {host: 'localhost', port:  28015 }, function(err, conn) {
    if (err) throw err;
// console.log("users my custom");
// console.log(users);

r.db('makitidb').table('users').
    insert(selectedUserVal).run(conn, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    }); 
});

