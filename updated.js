// @ts-nocheck
'use strict';
const rs= require("randomstring")
const users =require("./user.json");
const https = require('https');
const shops =require("./shop.json");
const products =require("./products.json");
//const cats=require("./cats.json");
const states =require("./states.json");
const countries =require("./countries.json");
const cities =require("./cities.json");
const  fs =require("fs");
const images=require("./images.json");
let nodeGeocoder = require('node-geocoder');
const admins =require("./shopadmin.json")

   var data = { ...(
    JSON.parse(
        // @ts-ignore
        fs.readFileSync(__dirname + "/user.json")
    )
) };


let selectedUserVal = [];





for(let user in users) {

    let new_user_profile = false;
    let new_user_cover = false;
    let profile_url =""
    let cover_url=""

    if (users[user].avatar) {
        new_user_profile = true;
        profile_url =users[user].avatar
    } else if (users[user].picture) {
        new_user_profile = true;
        profile_url =users[user].picture
    } else {
        new_user_profile = false;
    }

    if (users[user].cover) {
        new_user_cover = true;
        cover_url =users[user].cover
    } else {
        new_user_cover = false;
    }


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
        "has-profile":new_user_profile,
        "has-cover":new_user_cover,
        "profile_url":profile_url,
        "cover_url":cover_url,
        "has-audio":false,// false by default
        "old_data":{
        "user_id": users[user].user_id,
         "email-status":users[user].email_status,
         "first_name":users[user].first_name,
         "last_name":users[user].last_name,
         "email":users[user].email,
         "password":users[user].password,
         "phone_number":users[user].phone_number,
         "address":users[user].address,
         "role":users[user].role,
         "avatar":users[user].avatar,
         "picture":users[user].picture,
         "banned":users[user].banned,
         "show_email":users[user].show_email,
         "show_phone":users[user].show_phone,
         "show_location":users[user].show_location,
         "last-seen":users[user].last_seen,
         "created-at":users[user].created_at,
         "is_old_user":users[user].is_old_user,
        "number_of_sales":users[user].number_of_sales,
        "facebook_id":users[user].facebook_id,
        "send-email-new-message":users[user].send_email_new_message,
        "google_id":users[user].google_id,
        "twitter_id":users[user].twitter_id,
        "slug":users[user].slug,
        "about_me":users[user].about_me,
        "coords_lat":users[user].coords_lat,
        "coords_lang":users[user].coords_lng,
        "facebook_url":users[user].facebook_url,
        "twitter_url":users[user].twitter_url,
        "instagram_url":users[user].instagram_url,
        "pininterest_url":users[user].pinterest_url,
        "linkedin_url":users[user].linkedin_url,
        "youtube_url":users[user].youtube_url,
        "user_status":users[user].user_status,
        "city_id":users[user].city_id,
        "country-id":users[user].country_id,
        "state-id":users[user].state_id
        }
    }
    selectedUserVal.push(newUser);
    // console.log(newUser);
}
// @ts-ignore




let selectedfilesVal=[];




let selectedshopsVal=[]

for (let admin in admins){

    let shopadmin={
        admins:admins[admin].users_id


    }
    selectadminVal.push(shopadmin)
}

let selectedshopsVal=[];



for (let ishop in shops){

    let options = {
        provider: 'openstreetmap'
      };

      let geoCoder = nodeGeocoder(options);// Reverse Geocode
        geoCoder.reverse({lat:shops[ishop].coords_lat, lng:shops[ishop].coords_lng})
        .then((locations)=> {
          console.log(locations);
        })
        .catch((err)=> {
          console.log(err);
        });

        let admn = selectedshopsVal.map(a => admins);


let newShop ={
    name:shops[ishop].name,
    created:new Date().getTime(),
    description:shops[ishop].description,
    address:shops[ishop].address,
    owner:shops[ishop].user_id,
    admin:admn,
    cat:shops[ishop].cat,
    shop:shops[ishop].shop_id,
    ccode:"224",
    slug:shops[ishop].slug,
    phone:shops[ishop].phone_number,
    email:shops[ishop].email,
    status:"normal",
    location:"null",
    audios:"",
    "has-logo":"",
    profile:"",
    "has-cover":"",
    cover:"",
    "cover-key":"",
    note:0,
    notes:{},
    followers:"",
    following:"",
    plan:"basic",
    "shop-number":"",
     city:"",
     state:"",
     country:""    
    "old-data":{
        "shop_id":shops[ishop].shop_id,
        "name":shops[ishop].name,
        "slug":shops[ishop].slug,
        "description":shops[ishop].description,
        "logo":shops[ishop].logo,
        "cover_picture":shops[ishop].cover_picture,
        "category":shops[ishop].category,
        "phone_number":shops[ishop].phone_number,
        "email":shops[ishop].email,
        "audio":shops[ishop].audio,
        "address":shops[ishop].address,
        "id":shops[ishop].user_id,
        "shop-status":shops[ishop].shop_status,
        "coords_lat":shops[ishop].coords_lat,
        "coords-lng":shops[ishop].coords_lng

    }




}
selectedshopsVal.push(newShop);


}


let selectedimageVal=[]
for(let img  in images){
let newImage={
    "main-image":images[img].ismain
}

selectedimageVal.push(newImage)


}
let selectedcatsVal=[];
/*
for ( let cat in cats){

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

selectedcatsVal.push(newCat);


}

*/


// function to get address from longitude and latitude coord
// reverse geolocation

function validateLatLng(lat, lng) {
    let pattern = new RegExp('^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}');

    return pattern.test(lat) && pattern.test(lng);
  }

  //Convert lat/long to gps coordinates for location

let selectedcountryVal=[]
  for (let country in countries){
      let newCountry={

        name:countries[country].country_name
      }

      selectedcountryVal.push(newCountry)
  }

let selectedstatesVal=[]
  for (let state in states){
      let newState={
          state:states[state].state,


      }

      selectedstateVal.push(newState)
  }


  let selectedcitiesVal =[];

let selectedcitiesVal=[]
  for (let city in cities){
      let newCity={
          city:cities[city].city_name,


      }

      selectedcitiesVal.push(newCity)
  }


let selectedproductVal =[];

for (let product in products){
 let result = selectedimageVal.map(a => a["main-image"]);


   let  dateTime = new Date();
    let newProducts={
        title:products[product].name,
        created:new Date().getTime(),
        owner:products[product].user_id,
        address:"null",
        shop:products[product].shop_id,
        description:products[product].description,
        price:products[product].price,
        negotiable:products[product].negociable,
        cat:products[product].category,
        unused:"null",
        plan:"basic",
        "last-touch":dateTime,
        location:products[product].coords_name,
        comments:[],
        images:"",
        "main-img":result,
        likes:[],
        // function to get location from lng and ltd coordinates
         audios:"",
         "old-data":{
            "product_id":products[product].product_id,
            "name":products[product].name,
            "slug":products[product].slug,
            "description":products[product].description,
            "negociable":products[product].negociable,
            "audio_description":products[product].audio_description,
            "category":products[product].category,
            "sub_category":products[product].sub_category,
            "type_of_article":products[product].type_of_article,
            "posted-date":products[product].posted_on,
            "status":products[product].products_status,
            "subcategory":products[product].sub_category,
            "slug":products[product].slug,
            "voice-signature":products[product].use_shop_voice_signature,
            "coords-lat":products[product].coords_lat,
            "coords-lng":products[product].coords_lng,
            "subcat":products[product].sub_category,
            "person-of-contact":products[product].person_of_contact_id,
            "city":products[product].city_id,
            "state-id":products[product].state_id,
            "user-id":products[product].user_id

         }





    }
    selectedproductVal.push(newProducts);

}




const thinky = require('thinky')({
    host:  'localhost',
    port:  28015,
    db:    'makitidb'
});

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
    followers:Object,
    note:Number,
    notes:Number,
    notes:Object,
    cover:String,
    profile:String,
    "cover-key":String,
    "has-logo":Boolean,
    "notes-hist":Object,
    "has-cover":Boolean,
    "has-audio":Boolean,
    "logo-key":String,

})

var Products = thinky.createModel('Products',{
    owner:String,
    shop:String,
    title:String,
    description:String,
    plan:String,
    address:String,
    price:Number,
    negotiable:Boolean,
    unused:Boolean,
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

var imag = thinky.createModel('Imag',{
images_storage_id:Number,
requirements:String,
resolution:Number,


})

var cities =thinky.createModel('cities',{
    city_id:Number,
    city_name:String,

})

var states =thinky.createModel('states',{
    state_id:Number,
    state:String,


})

var counrtry =think.createModel('countries',{
    country_id:Number,
    country_name:String
})

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




var files= thinky.createModel('files',{

key:String,
type:[{

}],
mime:String,
requirements:String
});
/*
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
*/
/*
products.belongsTo(users,"users","iduser","id")
files.belongsTo(users, "users" ,"iduser", "id");
marketUsers.belongsTo(users, "users" ,"iduser", "id")
images.belongsTo(products,"products","productid","id")
shops.belongsTo(users,"users","iduser","id")
*/


r.connect( {host: 'localhost', port:  28015 }, function(err, conn) {
    if (err) throw err;
// console.log("users my custom");
// console.log(users);

r.db('makitidb').table('users').
    insert(selectedUserVal).run(conn, function(err, result) {
        if (err) throw err;

    });
    r.db('makitidb').table('Shop').
    insert(selectedshopsVal).run(conn, function(err, result) {
        if (err) throw err;

    });
    r.db('makitidb').table('Products').
    insert(selectedproductVal).run(conn, function(err, result) {
        if (err) throw err;

    });
r.db('makitidb').table('cats').
    insert(selectedcatsVal).run(conn, function(err, result) {
        if (err) throw err;

    });


    r.db('makiti-market').table('users').
    insert(selectedMarketVal).run(conn, function(err, result) {
        if (err) throw err;

    });
    r.db('flystore').table('files').
    insert(selectedfilesVal).run(conn, function(err, result) {
        if (err) throw err;
    });
});

