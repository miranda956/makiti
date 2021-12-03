var thinky = require('thinky')()


var marketUsers =thinky.createModel('marketUsers',{

    //audio 
followers:String().default("[]"),
following:String().default("[]"),
likes:String().default("[]"),
notes:String().default("[]"),
note:Number.default(0),
plan:String.default("basic"),
status:String.default("normal")
})

export default marketUsers;