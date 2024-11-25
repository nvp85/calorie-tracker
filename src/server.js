import { belongsTo, createServer, hasMany, Model, RestSerializer, Response } from "miragejs";
import sign from "jwt-encode";
import { jwtDecode } from "jwt-decode";


const serializer = RestSerializer.extend({
    embed: true,
    root: false,
    serializeIds: 'always'
});


function verifyToken(token, schema) {
    const decoded = jwtDecode(token, 'app-secret');
    const user = schema.users.find(decoded.id);
    if (!user) {
        throw new Error('Inavalid credentials.');
    }
    if (decoded.exp < Math.floor(Date.now()/1000)) {
        throw new Error('The session has ended.');
    };
    return user;
};


export function makeServer() {
    const cur_date = new Date().toJSON().slice(0,10);
    let server = createServer({
        models: {
            user: Model.extend({
                foodRecord: hasMany('foodRecord'),
            }),
            food: Model.extend({
                foodRecord: hasMany('foodRecord'),
                addedBy: belongsTo("user"),
            }),
            foodRecord: Model.extend({
                user: belongsTo(),
                food: belongsTo(),
            })
        },

        serializers: {
            application: serializer,
            foodRecord: serializer.extend({
                include: ['food', 'user'],
                serialize(resource, request) {
                    let json = serializer.prototype.serialize.apply(this, arguments);
                    function customRecord(record) {
                        return {
                            id: record.id,
                            amount: record.amount,
                            date: record.date,
                            user_id: record.user.id,
                            food_id: record.food.id,
                            food_name: record.food.name,
                            calories_eaten: Math.round(record.amount * record.food.calories / 100),
                            protein_eaten: Math.round(record.amount * record.food.proteins / 100),
                            fat_eaten: Math.round(record.amount * record.food.fats / 100),
                            carbs_eaten: Math.round(record.amount * record.food.carbs / 100),
                        }
                    };
                    json = Array.isArray(json) ? json.map(record => customRecord(record)) : customRecord(json);
                    return json;
                }
            }),
            food: serializer.extend({
                include:['addedBy']
            }),
        },

        seeds(server) {
            //users
            server.create("user", {id: 1, username: "demoUser", email: "user1@example.com", password: "123", budget: 2000});
            server.create("user", {id: 2, username: "demoUser2", email: "user2@example.com", password: "456", budget: 2000});

            //food public
            server.create("food", {id: 1, name: "Chicken egg", calories: 157.0, proteins: 12.7, fats: 0.9, carbs: 0.7, serving: "55g", addedById: null});
            server.create("food", {id: 2, name: "Bananas", calories: 95.0, proteins: 1.5, fats: 0.2, carbs: 21.8, serving: "110g", addedById: null});
            server.create("food", {id: 3, name: "Milk whole", calories: 59.0, proteins: 2.9, fats: 3.2, carbs: 4.7, serving: "1 cup (225g)", addedById: null});
            server.create("food", {id: 4, name: "Milk 1.5%", calories: 44.0, proteins: 2.8, fats: 1.5, carbs: 4.7, serving: "1 cup (255g)", addedById: null});
            server.create("food", {id: 5, name: "Wheat Bread", calories: 242.0, proteins: 25, fats: 32, carbs: 0, serving: "28g", addedById: null});
            
            // users' food
            server.create("food", {id: 6, name: "Crackers", calories: 437.5, proteins: 6.3, fats: 10, carbs: 75, serving: "16g", addedById: 1});
            server.create("food", {id: 7, name: "Sharp cheddar cheese", calories: 392.9, proteins: 1.5, fats: 0.2, carbs: 21.8, serving: "110g", addedById: 1});

            
            //records
            server.create("foodRecord", {id: 1, userId: 1, foodId: 5, amount: 200, date: cur_date});
            server.create("foodRecord", {id: 2, userId: 1, foodId: 1, amount: 110, date: cur_date});
            server.create("foodRecord", {id: 3, userId: 1, foodId: 4, amount: 20, date: cur_date});
            server.create("foodRecord", {id: 4, userId: 1, foodId: 5, amount: 120, date: cur_date});
            server.create("foodRecord", {id: 5, userId: 1, foodId: 2, amount: 300, date: cur_date});
            server.create("foodRecord", {id: 6, userId: 1, foodId: 3, amount: 105, date: cur_date});
            server.create("foodRecord", {id: 7, userId: 2, foodId: 3, amount: 216, date: cur_date});

        },
    // TODO: add brands and categories
        routes() {
            this.namespace = "api";
            this.timing = 2000; // delay in server response

            this.post('/auth/login', (schema, request) => {
                const attr = JSON.parse(request.requestBody);
                const user = schema.users.findBy({email: attr.email});
                if (user && attr.password === user.password) {
                    const token = sign({
                        exp: Math.floor(Date.now()/1000) + 60*60,
                        id: user.id
                    }, 'app-secret'); //replace the app-secret with an actual secret; default alg is HMAC SHA256 
                    return new Response(200, {}, {
                        authtoken: token,
                        user: {
                            id: user.id,
                            name: user.username,
                            email: user.email,
                            budget: user.budget
                        }
                    });
                } else {
                    return new Response(401, {}, {errors: ['Invalid email or password.']});
                }
            });
            // return current users details if the token is valid
            this.get('/auth/user', (schema, request) => {
                const token = request.requestHeaders.authentication;
                let user;
                try {
                    user = verifyToken(token, schema);
                    return new Response(200, {}, {
                        id: user.id,
                        name: user.username,
                        email: user.email,
                        budget: user.budget
                    });
                } catch (err) {
                    console.error(err);
                    return new Response(401, {}, {errors: [err.message]});
                }
            });
            // should return public food and current user's food if the user is logged in
            this.get("/food", (schema, request) => { 
                let q = request.queryParams.query.trim().toLowerCase();
                let user = null;
                //return new Response(400, {}, {error: "Error fetching data"}); 
                console.log("user: ", request.requestHeaders.authentication);  
                if (request.requestHeaders.authentication) {
                    try {
                        const token = request.requestHeaders.authentication;
                        user = verifyToken(token, schema);
                                
                    } catch (err) {
                        console.error(err);
                        return new Response(401, {}, {errors: ['Inavalid credentials.']})
                    };
                }
                
                return schema.foods.where(food => {
                    ((food.addedBy === null || (user && food.addedBy == user.id)) && food.name.toLowerCase().includes(q))
                    if (food.name.toLowerCase().includes(q)) {
                        if ((user && food.addedById == user.id) || food.addedById === null) {
                            
                            return true;
                        };
                    }
                    return false;
                });
            });
            // returns food details if it's public or belongs to the curr user
            this.get("/food/:id", (schema, request) => {
                //console.log(request);
                const food = schema.foods.find(request.params.id); 
                if (request.requestHeaders.authentication && food?.addedById) {
                    let user;
                    try {
                        const token = request.requestHeaders.authentication;
                        user = verifyToken(token, schema);
                    } catch (err) {
                        console.error(err);
                        return new Response(401, {}, {errors: ['Inavalid credentials.']})
                    };
                    if (food.addedById !== user.id) {
                        return new Response(403, {}, {errors: ['Access denied.']})
                    };
                }
                return food;
            });
            // adds a new private food item
            this.post("/food", (schema, request) => {
                //return new Response(400, {}, {error: "Error fetching data"}); 
                const attrs = JSON.parse(request.requestBody);
                let user;
                try {
                    const token = request.requestHeaders.authentication;
                    user = verifyToken(token, schema);
                } catch (err) {
                    console.error(err);
                    return new Response(401, {}, {errors: [err.message]})
                };
                return schema.foods.create({...attrs, addedById: user.id});
            });
            // returns current user's records.
            this.get("/food_records/:date", (schema, request) => {
                //return new Response(400, {}, {error: "Error fetching data"});
                let user;
                try {
                    const token = request.requestHeaders.authentication;
                    user = verifyToken(token, schema);
                } catch (err) {
                    console.error(err);
                    return new Response(401, {}, {errors: ['Inavalid credentials.']})
                };
                return schema.foodRecords.where({userId: user.id, date: request.params.date}).sort((a,b) => b.id - a.id);
            });
            // adds a current user's record to the db
            this.post("/food_records", (schema, request) => {
                //return new Response(400, {}, {error: "Error fetching data"}); 
                const attrs = JSON.parse(request.requestBody);
                let user;
                try {
                    const token = request.requestHeaders.authentication;
                    user = verifyToken(token, schema);
                } catch (err) {
                    console.error(err);
                    return new Response(401, {}, {errors: ['Inavalid credentials.']})
                };
                return schema.foodRecords.create({...attrs, userId: user.id});
            });
            // delete current user's record
            this.del("/food_records/:id", (schema, request) => {
                //return new Response(400, {}, {error: "Error fetching data"}); 
                let user;
                try {
                    const token = request.requestHeaders.authentication;
                    user = verifyToken(token, schema);
                } catch (err) {
                    console.error(err);
                    return new Response(401, {}, {errors: ['Inavalid credentials.']})
                };
                return schema.foodRecords.findBy({id: request.params.id, userId: user.id}).destroy();
            });
            // edit current user's record
            this.patch("/food_records/:id", (schema, request) => {
                const attrs = JSON.parse(request.requestBody);
                let user;
                try {
                    const token = request.requestHeaders.authentication;
                    user = verifyToken(token, schema);
                } catch (err) {
                    console.error(err);
                    return new Response(401, {}, {errors: ['Inavalid credentials.']})
                };
                return schema.foodRecords.findBy({id: request.params.id, userId: user.id}).update(attrs);
            });
        },
    })
    return server;
};

