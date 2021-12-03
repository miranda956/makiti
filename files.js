
var thinky = require('thinky')()


var files= thinky.createModel('files',{

    key:String,
    type:[{
    
    }],
    mime:String,
    requirements:[{
        "max-size": 15728640,
        "min-size": 0,
        // The following sub fields are only set for images
        "max-height": 4320,
        "min-height": 512,
        "max-width": 7680,
        "min-width": 512,
        "resolution": 512 / 1080,
        
    
    
    }]
    });

    export default files;