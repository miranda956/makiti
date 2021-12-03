// @ts-nocheck
'use strict';
const rs= require("randomstring")
const users =require("./user.json");
const https = require('https');
const shops =require("./shop.json");
const products =require("./products.json");
const cats=require("./cats.json");
const  fs =require("fs");
let nodeGeocoder = require('node-geocoder');

   var data = { ...(
    JSON.parse(
        // @ts-ignore
        fs.readFileSync(__dirname + "/user.json")
    )
) }; 


const thinky = require('thinky')({
    host:  'localhost',
    port:  28015,
    db:    'makitidb'
});

let selectedUserVal = [];


function checkprofile(){
// function to check presence of avator 


}


for(let user in users) {
    let newUser = {
        email: users[user].email,
        phone: users[user].phone_number,
        password: users[user].password,
        first_name:users[user].last_name,
        last_name:users[user].last_name,
        address:users[user].address,
        ccode:'224',
        logtype:"custom",
        "pending-ccode":"null",//need some explanations from TIM
        "pending-phone":"null",
        "phone-vcode":"null",
        "pending-email":"null",
        "email-vcode":"null",
        "has-profile":false,// function needed to check presence of avatar,picture,cover_avator before setting false
        "has-cover":false,
        "has-audio":false,// false by default 
        "old_user_id": users[user].user_id,// do the same for all the remaining unaffected data
        "old_number_of_sales":users[user].number_of_sales,
        "old_facebook_id":users[user].facebook_id,
        "old_google_id":users[user].google_id,
        "old_twitter_id":users[user].twitter_id,
        "old_slug":users[user].slug,
        "old_about_me":users[user].about_me,
        "old_coords_lat":users[user].coords_lat,
        "old_coords_lang":users[user].coords.lang,
        "old_facebook_url":users[user].facebook_url,
        "old_twitter_url":users[user].twitter_url,
        "old_instagram_url":users[user].instagram_url,
        "old_pininterest_url":users[user].pinterest_url,
        "old__linkedin_url":users[user].linkedin_url,
        "old_youtube_url":users[user].youtube_url,
        "old-status":users[user].user_status,
        "old-city_id":users[user].city_id,
        "old-country-id":users[user].country_id,
        "old-state-id":users[user].state_id



    }
    selectedUserVal.push(newUser);
    // console.log(newUser);
}
// @ts-ignore

let selectedMarketVal=[];

for ( let market in users){
    let marketUsers={
        followers:"[]",
        following:"[]",
        likes:"[]",
        notes:"[]",
        note:0,
        plan:"basic",
        status:"normal"

    }

    selectedMarketVal.push(marketUsers);

}
let selectedfilesVal=[];


for (let file in users){

    let files={
        "is-img": true,
        key: rs.generate({length: 32, charset: "alphanumeric"}),
        type:"'image' / 'text' / 'misc'",


        requirements: {
			"max-size": 15728640,
			"min-size": 0,
			types: ["webp","jpeg","jpg","png","gif"],
			"max-height": 4320,
			"max-width": 7680,
			"min-height": 512,
			"min-width": 512
		},
        resolution: 512,

    }
    selectedfilesVal.push(files);

}

console.log(selectedfilesVal)

let selectedshopsVal=[];

for (let ishop in shops){

let newShop ={
    name:shops[ishop].name,
    description:shops[ishop].description,
    address:shops[ishop].address,
    owner:shops[ishop].user_id,
    admin:"",
    cat:shops[ishop].cat,
    ccode:"224",
    phone:shops[ishop].phone_number,
    email:shops[ishop].email,
    location:"",
    // function needed to get location from longitutes and latitudes
    note:0,
    notes:{},
    "has-logo":shops[ishop].logo,
    "has-cover":false,
    "has-audio":false,
    "old-id":shops[ishop].user.id,
    "old-slug":shops[ishop].slug,
    "logo-key":"",
    "old-shop-status":shops[ishop].shop_status,
    "old-coords_lat":shops[ishop].coords_lat,
    "old-coords-lng":shops[ishop].coords_lng




}
selectedshopsVal.push(newShop);


}


for (cat in cats){
let newCat ={
    name:cats[cat].title_meta_tag,
    description:cats[cat].description,
    keyword:cats[cat].keywords,
    rank:cats[cat].category_order,
    image:cats[cat].image,
    props:{},


    "old-slug":cats[cat].slug,
    "old-mage-for-mobile-app":cats[cat].image_for_mobile_app





}



}
let productaudio = {
    "is-img": false,
    key: rs.generate({length: 32, charset: "alphanumeric"}),
    status: "unsent",
    requirements: {
        "max-size": 15728640,
        "min-size": 0,
        types: ["aac","bin","mid","midi","mp3","oga","ogx","opus","wav","weba"]
    },
    "old-a-shop": user.id
};

// function to get address from longitude and latitude coord
// reverse geolocation
 
let options = {
  provider: 'openstreetmap'
};
 
let geoCoder = nodeGeocoder(options);// Reverse Geocode
  geoCoder.reverse({lat:38.66, lng:-78.43})
  .then((res)=> {
    console.log(res);
  })
  .catch((err)=> {
    console.log(err);
  });
// validate longitude and latitude 

function validateLatLng(lat, lng) {    
    let pattern = new RegExp('^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}');
    
    return pattern.test(lat) && pattern.test(lng);
  }

  //Convert lat/long to gps coordinates for location 

function ConvertDEGToDMS(deg, lat) {
    var absolute = Math.abs(deg);

    var degrees = Math.floor(absolute);
    var minutesNotTruncated = (absolute - degrees) * 60;
    var minutes = Math.floor(minutesNotTruncated);
    var seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

    if (lat) {
        var direction = deg >= 0 ? "N" : "S";
    } else {
        var direction = deg >= 0 ? "E" : "W";
    }

    return degrees + "°" + minutes + "'" + seconds + "\"" + direction;
}
let selectedproductVal =[];

for (product in products){
    let newProducts={
        title:products[product].title,
        shop:products[product].shop_id,
        description:products[product].description,
        price:products[product].price,
        negotiable:products[product].negociable,
        cat:products[product].category,
        plan:"basic",
        "last-touch":"",
        location:"",
        // function to get location from lng and ltd coordinates 
         audios:"",
         "old-posted-date":products[product].posted_on,
         "old-status":products[product].products_status,
         "old-subcategory":products[product].sub_category,
         "old-slug":products[product].slug,
         "old-voice-signature":products[product].use_shop_voice_signature,
         "old-coords-lat":products[product].coords_lat,
         "old-coords-lng":products[product].coords_lng,
         "old-subcat":products[product].sub_category,
         "old-person-of-contact":products[product].person_of_contact_id,
         "old-city":products[product].city_id,
         "old-state-id":products[product].state_id,
         "old-user-id":products[product].user_id

        



    }
    selectedproductVal.push(newProducts);

}


var r = thinky.r;
var Users = thinky.createModel('users', {
      ccode: String,
      phone:  Number,
      "pending-ccode": String,
      "pending-phone":Number,
      "phone-vcode":Number,
      email:String,
      "pending-email":String,
      "email-vcode":Number,
      password:String,
      "log-type":String,
      "has-profile":Boolean,
      "has-cover":Boolean,

});
Users.ensureIndex("createdAt")

var Shop =thinky.createModel('Shop',{
    name:String,
    owner:Number,
    admins:String,
    ccode:String,
    description:String,
    address:String,
    location:String,
    phone:Number,
    audio:{
     id:String,
     key:String
    },
    cat:Number,
    followers:List,
    note:Number,
    notes:Number,
    notes:Object,
    cover:String,
    profile:String,
    "cover-key":String,
    "has-logo":Boolean,
    "notes-hist":List,
    "has-cover":Boolean,
    "has-audio":Boolean,
    "logo-key":String,

})
shop.ensureIndex("createdAt")

var Products = thinky.createModel('Products',{
    owner:String,
    shop:String,
    title:String,
    description:String,
    plan:String,
    address:String,
    price:Number,
    negotiable:BOOLEAN,
    unused:BOOLEAN,
    "last-touch":Date,
    comments:String,
    location:{
        description:String
    },
    audios:{
        Id:String,
        key:String
    },
    images:{
        id:String,
        key:String

    },
    "main-img":Number,
    cat:Number,
    likes:{
        Id:Number
    }


})
products.ensureIndex("createdAt")

var images = thinky.createModel('Images',{
images_storage_id:Number,
requirements:Custom,
resolution:Number,


})

images.ensureIndex("createdAt")

var category =thinky.createModel('cats',{
    name:String,
    description:String,
    keywords:String,
    image:String,
    color:String,
    rank:Number,
    parent_id:Number,
    props:Object
})

category.ensureIndex("createdAt")

/*


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
files.ensureIndex("createdAt")

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


makitiusers.ensureIndex("createdAt")
products.belongsTo(users,"users","iduser","id")
files.belongsTo(users, "users" ,"iduser", "id");
marketUsers.belongsTo(users, "users" ,"iduser", "id")
images.belongsTo(products,"products","productid","id")
*/


r.connect( {host: 'localhost', port:  28015 }, function(err, conn) {
    if (err) throw err;
// console.log("users my custom");
// console.log(users);

r.db('makitidb').table('users').
    insert(selectedUserVal).run(conn, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    });
    r.db('makitidb').table('shops').
    insert(selectedshopsVal).run(conn, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    }); 
    r.db('makitidb').table('products').
    insert(selectedproductVal).run(conn, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    }); 



    r.db('makiti-market').table('users').
    insert(selectedMarketVal).run(conn, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    });
    r.db('flystore').table('files').
    insert(selectedfilesVal).run(conn, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    });
});

