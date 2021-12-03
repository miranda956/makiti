#! /usr/bin/env node

let fs = require("fs"),
	https = require("https"),

	// @ts-ignore
	r = require("rethinkdb"),
	rs = require("randomstring"),
	// @ts-ignore
	sh = require("sharp"),

	// When data is in one file
	mdbs = { ...(
		JSON.parse(
			// @ts-ignore
			fs.readFileSync(__dirname + "/user.json")
		)
	) },

	// When data is spread over several files
	// mdbs = [
	// 	{
	// 		type: "table",
	// 		name: "users",
	// 		data: JSON.parse(
	// 			fs.readFileSync(__dirname + "/DB-JSON/users.json")
	// 		).RECORDS
	// 	},
	// 	{
	// 		type: "table",
	// 		name: "products",
	// 		data: JSON.parse(
	// 			fs.readFileSync(__dirname + "/DB-JSON/products.json")
	// 		).RECORDS
	// 	},
	// 	{
	// 		type: "table",
	// 		name: "images",
	// 		data: JSON.parse(
	// 			fs.readFileSync(__dirname + "/DB-JSON/images.json")
	// 		).RECORDS
	// 	},
	// 	{
	// 		type: "table",
	// 		name: "media",
	// 		data: JSON.parse(
	// 			fs.readFileSync(__dirname + "/DB-JSON/media.json")
	// 		).RECORDS
	// 	}
	// ],

	// @ts-ignore
	user, uget, uarr, newUser, newUsers = {},
	// @ts-ignore
	pimg, pget, parr, newPimg, newPimgs = {}, // Profile images
	// @ts-ignore
	cimg, cget, carr, newCimg, newCimgs = {}, // Cover images
	// @ts-ignore
	uaudio, uaget, uaarr, newUaudio, newUaudios = {}, // Users sudio files

	// @ts-ignore
	newShop, sget, sarr, newShops ={},
	// @ts-ignore
	limg, lget, larr, newLimg, newLimgs = {}, // Logo images
	// @ts-ignore
	scimg, scget, scarr, newSCimg, newSCimgs = {}, // Shop cover images
	// @ts-ignore
	saudio, saget, saarr, newSaudio, newSaudios = {}, // Shops audio files

	post, newPost, newPosts = {},
	// @ts-ignore
	img, iget, iarr, newImg, newImgs = {}, // Posts images
	// @ts-ignore
	audio, aget, aarr, newAudio, newAudios = {}, // Posts audio files

	ttest = /^6[1256]\d{7}$/,
	etest = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/
;

// @ts-ignore
async function get(url) {
	// @ts-ignore
	return new Promise((resolve, reject) => {
		https.get(url, res => {
			let data = Buffer.alloc(0);
			res.on("data", chunk => {
				data = Buffer.concat([data, chunk]);
			});
			res.on("end", () => resolve(data));
		});
	});
}

// @ts-ignore
async function arrify(cursor) {
	return new Promise((resolve, reject) => {
		cursor.toArray((err, arr) => {
			if(err) reject(err);
			resolve(arr);
		});
	});
}

for(let mdb in mdbs) {
	if(mdbs[mdb].type == "table") {
		mdbs[ mdbs[mdb].name ] = mdbs[mdb].data;
		fs.writeFileSync(
			__dirname + "/../tables/" + mdbs[mdb].name + ".json",
	JSON.stringify(mdbs[mdb].data)
	 );
	}
	delete mdbs[mdb];
}

for(let ukey in mdbs.users) {
	user = mdbs.users[ukey];

	if(
		user.u_login == "**********account_deleted**********"
		|| (
			!user.u_login &&
			!user.phone_number &&
			!user.email
		)
	)
		continue;

	newUser = {
		status: "new",
		old: true,
		plan: "basic",
		"log-type": "custom",
		followers: [],
		following: [],
		note: 0,
		notes: {},
		"notes-hist": [],
		views: [],
		likes: [],
		"has-profile": (user.avatar && (/^https/.test(user.avatar))),
		"has-cover": false,
		"has-audio": false,
		"old-id": user.id
	};

	if(user.created_at)
		// @ts-ignore
		newUser.created = (new Date(user.created_at)).getTime();
	// @ts-ignore
	else newUser.created = (new Date).getTime();

	if(user.phone_number) {
		user.phone_number = user.phone_number
			.replace(/\D/g, "")
		;

		if(/^224/.test(user.phone_number))
			user.phone_number  = user.phone_number.slice(3);
	}

	if(
		!user.phone_number &&
		(/^6[1256]\d{7}@makitiplus\.com/.test(user.u_login))
	) {
		user.phone_number = user.u_login.replace("@makitiplus.com", "");
	}

	if(ttest.test(user.phone_number)) {
		// @ts-ignore
		newUser.tel = user.phone_number;
		// @ts-ignore
		newUser.ccode = "224";
	}
	else user.phone_number = undefined;

	if(user.email) {
		user.email = user.email.toLowerCase();
		if(
			etest.test(user.email) &&
			!(/@makitiplus\.com$/.test(user.email))
		)
			// @ts-ignore
			newUser.email = user.email;
		else user.email = undefined;
	}

	// @ts-ignore
	if(!newUser.tel && !newUser.email) continue;

	// @ts-ignore
	if(user.first_name) newUser.name = user.first_name;

	// @ts-ignore
	if(user.last_name) newUser.surname = user.last_name;

	// @ts-ignore
	if(user.address) newUser.address = user.address;

	newUsers[user.id] = newUser;

	newPimg = {
		"is-img": true,
		key: rs.generate({length: 32, charset: "alphanumeric"}),
		status: ((user.avatar && (/^https/.test(user.avatar)))? "sent" : "unsent"),
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
		"old-user": user.id,
		"old-img": ((user.avatar && (/^https/.test(user.avatar)))? user.avatar : 0)
	};
	newPimgs[user.id] = newPimg;

	newCimg = {
		"is-img": true,
		key: rs.generate({length: 32, charset: "alphanumeric"}),
		status: "unsent",
		requirements: {
			"max-size": 15728640,
			"min-size": 0,
			types: ["webp","jpeg","jpg","png","gif"],
			"max-height": 4320,
			"max-width": 7680,
			"min-height": 512,
			"min-width": 512
		},
		"old-c-user": user.id
	};
	newCimgs[user.id] = newCimg;

	newUaudio = {
		"is-img": false,
		key: rs.generate({length: 32, charset: "alphanumeric"}),
		status: "unsent",
		requirements: {
			"max-size": 15728640,
			"min-size": 0,
			types: ["aac","bin","mid","midi","mp3","oga","ogx","opus","wav","weba"]
		},
		"old-a-user": user.id
	};
	newUaudios[user.id] = newUaudio;

	if(user.shop_name) {
		newShop = {
			name: user.shop_name,
			description: user.shop_name,
			cat: 9,
			views: [],
			followers: [],
			note: 0,
			notes: {},
			"notes-hist": [],
			"has-logo": (user.avatar && (/^https/.test(user.avatar))),
			"has-cover": false,
			"has-audio": false,
			"old-id": user.id
		};

		if(user.created_at)
			// @ts-ignore
			newShop.created = (new Date(user.created_at)).getTime();
		// @ts-ignore
		else newShop.created = (new Date()).getTime();

		if(user.phone_number)
			// @ts-ignore
			newShop.tel = "+224" + user.phone_number;

		// @ts-ignore
		if(user.email) newShop.email = user.email;

		// @ts-ignore
		if(user.address) newShop.address = user.address;

		newShops[user.id] = newShop;

		newLimg = {
			"is-img": true,
			key: rs.generate({length: 32, charset: "alphanumeric"}),
			status: ((user.avatar && (/^https/.test(user.avatar)))? "sent" : "unsent"),
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
			"old-shop": user.id,
			"old-img": ((user.avatar && (/^https/.test(user.avatar)))? user.avatar : 0)
		};
		newLimgs[user.id] = newLimg;

		newSCimg = {
			"is-img": true,
			key: rs.generate({length: 32, charset: "alphanumeric"}),
			status: "unsent",
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
			"old-c-shop": user.id
		};
		newSCimgs[user.id] = newSCimg;

		newSaudio = {
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
		newSaudios[user.id] = newSaudio;
	}

	user = {};
	newUser = {};
}

for(let pkey in mdbs.products) {
	post = mdbs.products[pkey];
 
	newPost = {
		views: [],
		likes: [],
		unused: true,
		negotiable: true,
		comments: {},
		imgs: [],
		"old-owner": post.user_id
	};

	// @ts-ignore
	if(post.created_at) newPost.created = (new Date(post.created_at)).getTime();
	// @ts-ignore
	else newPost.created = (new Date()).getTime();

	// @ts-ignore
	if(post.title) newPost.name = post.title;

	// @ts-ignore
	if(post.description) newPost.description = post.description.slice(3, -4);

	// @ts-ignore
	if(post.category_id) newPost.cat = post.category_id;

	// @ts-ignore
	if(post.price) newPost.price = post.price;

	newPosts[post.id]= newPost;

	// newAudio = {
	// 	"is-img": false,
	// 	key: rs.generate({length: 32, charset: "alphanumeric"}),
	// 	status: "unsent",
	// 	requirements: {
	// 		"max-size": 15728640,
	// 		"min-size": 0,
	// 		types: ["aac","bin","mid","midi","mp3","oga","ogx","opus","wav","weba"]
	// 	},
	// 	"old-a-post": post.id
	// };
	// newAudios[post.id] = newAudio;

	post = {};
	newPost = {};
}

for(let ikey in mdbs.images) {
	img = mdbs.images[ikey];

	if(img.image_big) {
		newImg = {
			"is-img": true,
			key: rs.generate({length: 32, charset: "alphanumeric"}),
			status: "sent",
			requirements: {
				"max-size": 15728640,
				"min-size": 0,
				types: ["webp","jpeg","jpg","png","gif"],
				"max-height": 4320,
				"max-width": 7680,
				"min-height": 512,
				"min-width": 512
			}, 
			resolution: 1080,
			"old-post": img.product_id,
			"old-img": "https://mk-v2-files.s3.eu-west-3.amazonaws.com/uploads/images/" + img.image_big
		};
		newImgs[img.id] = newImg;
	}

	img = {};
	newImg = {};
}

for(let akey in mdbs.media) {
	audio = mdbs.media[akey];

	if(newPosts[audio.product_id]) {
		newAudio = {
			"is-img": false,
			key: rs.generate({length: 32, charset: "alphanumeric"}),
			status: "sent",
			requirements: {
				"max-size": 15728640,
				"min-size": 0,
				types: ["aac","bin","mid","midi","mp3","oga","ogx","opus","wav","weba"]
			},
			"old-a-post": audio.product_id
		};
		newAudios[audio.id] = newAudio;
	}

}
console.log(Object.keys(newAudios).length, "   ", Object.keys(newPosts).length)


// r.connect({
// 	host: "127.0.0.1",//"194.62.96.24",
// 	port: 7010 // 7510
// }, async (err, conn) => {
// 	if(err) console.error(err);
// 	else {

// 		// Profile pics registration and linking
// 		await r.db("makiti-market").table("files")
// 			.insert(Object.values(newPimgs)).run(conn);
// 		pget = await r.db("makiti-market").table("files")
// 			.hasFields("old-user").run(conn)
// 		;
// 		parr = await arrify(pget);

// 		for(let p in parr) {
// 			pimg = parr[p];
// 			newUsers[pimg["old-user"]]["profile"] = pimg.id;
// 			newUsers[pimg["old-user"]]["profile-key"] = pimg.key;
// 		}

// 		// Users cover pics registration and linking
// 		await r.db("makiti-market").table("files")
// 			.insert(Object.values(newCimgs)).run(conn);
// 		cget = await r.db("makiti-market").table("files")
// 			.hasFields("old-c-user").run(conn)
// 		;
// 		carr = await arrify(cget);
		
// 		for(let c in carr) {
// 			cimg = carr[c];
// 			newUsers[cimg["old-c-user"]]["cover"] = cimg.id;
// 			newUsers[cimg["old-c-user"]]["cover-key"] = cimg.key;
// 		}

// 		// Users audios registration and linking
// 		await r.db("makiti-market").table("files")
// 			.insert(Object.values(newUaudios)).run(conn);
// 		uaget = await r.db("makiti-market").table("files")
// 			.hasFields("old-a-user").run(conn)
// 		;
// 		uaarr = await arrify(uaget);
		
// 		for(let a in uaarr) {
// 			uaudio = uaarr[a];
// 			newUsers[uaudio["old-a-user"]]["audio"] = uaudio.id;
// 			newUsers[uaudio["old-a-user"]]["audio-key"] = uaudio.key;
// 		}


// 		// Users registration
// 		await r.db("makiti").table("users")
// 			.insert(Object.values(newUsers)).run(conn);

// 		uget = await r.db("makiti").table("users").run(conn);
// 		uarr = await arrify(uget);

// 		for(let u in uarr) {
// 			user = uarr[u];
// 			newUsers[user["old-id"]].id = user.id;

// 			if(newShops[user["old-id"]])
// 				newShops[user["old-id"]].owner = user.id;
// 		}


// 		// Shop logos registration and linking
// 		await r.db("makiti-market").table("files")
// 			.insert(Object.values(newLimgs)).run(conn);
// 		lget = await r.db("makiti-market").table("files")
// 			.hasFields("old-shop").run(conn)
// 		;
// 		larr = await arrify(lget);

// 		for(let l in larr) {
// 			limg = larr[l];
// 			newShops[limg["old-shop"]]["logo"] = limg.id;
// 			newShops[limg["old-shop"]]["logo-key"] = limg.key;
// 		}

// 		// Shop covers registration and linking
// 		await r.db("makiti-market").table("files")
// 			.insert(Object.values(newSCimgs)).run(conn);
// 		scget = await r.db("makiti-market").table("files")
// 			.hasFields("old-shop").run(conn)
// 		;
// 		scarr = await arrify(scget);

// 		for(let sc in scarr) {
// 			scimg = scarr[sc];
// 			newShops[scimg["old-shop"]]["cover"] = scimg.id;
// 			newShops[scimg["old-shop"]]["cover-key"] = scimg.key;
// 		}

// 		// Shop audios registration and linking
// 		await r.db("makiti-market").table("files")
// 			.insert(Object.values(newSaudios)).run(conn);
// 		saget = await r.db("makiti-market").table("files")
// 			.hasFields("old-a-shop").run(conn)
// 		;
// 		saarr = await arrify(saget);

// 		for(let sa in saarr) {
// 			saudio = saarr[sa];
// 			newShops[saudio["old-a-shop"]]["audio"] = saudio.id;
// 			newShops[saudio["old-a-shop"]]["audio-key"] = saudio.key;
// 		}

// 		await r.db("makiti-market").table("shops")
// 			.insert(Object.values(newShops)).run(conn)

// 		sget = await r.db("makiti-market").table("shops").run(conn);
// 		sarr = await arrify(sget);
// 		for(let s in sarr) {
// 			shop = sarr[s];
// 			newShops[shop["old-id"]] = shop;
// 		}

// 		for(let i in newImgs) {
// 			if(!newPosts[newImgs[i]["old-post"]])
// 				delete newImgs[i]
// 		}

// 		await r.db("makiti-market").table("files")
// 			.insert(Object.values(newImgs)).run(conn);
// 		iget = await r.db("makiti-market").table("files")
// 			.hasFields("old-post").run(conn)
// 		;
// 		iarr = await arrify(iget);

// 		for(let i in iarr) {
// 			img = iarr[i];
// 			newPosts[img["old-post"]].imgs.push({
// 				fid: img.id,
// 				fkey: img.key
// 			});
// 		}

// 		// Post audios registration and linking
// 		await r.db("makiti-market").table("files")
// 			.insert(Object.values(newAudios)).run(conn);
// 		aget = await r.db("makiti-market").table("files")
// 			.hasFields("old-a-post").run(conn)
// 		;
// 		aarr = await arrify(aget);

// 		for(let a in aarr) {
// 			audio = aarr[a];
// 			newPosts[audio["old-a-post"]]["audio"] = audio.id;
// 			newPosts[audio["old-a-post"]]["audio-key"] = audio.key;
// 		}

// 		for(let p in newPosts) {
// 			post = newPosts[p];

// 			if(newUsers[post["old-owner"]]) {
// 				post.owner = newUsers[post["old-owner"]].id;

// 				if(newShops[post["old-owner"]])
// 					post.shop = newShops[post["old-owner"]].id;
// 			}
// 			else
// 				post.owner = newUsers[84].id;
			
// 			delete post["old-owner"];
// 		}

// 		await r.do(
// 			r.db("makiti").table("users")
// 				.replace(r.row.without("old-id"))
// 			,
// 			r.db("makiti-market").table("shops")
// 				.replace(r.row.without("old-id"))
// 			,
// 			r.db("makiti-market").table("files")
// 				.replace(r.row.without(
// 					"old-user",
// 					//"old-shop",
// 					"old-post"
// 				))
// 			,
// 			r.db("makiti-market").table("posts")
// 				.insert(Object.values(newPosts))
// 		).run(conn)

// 		conn.close();
// 	}
// });
