import { belongsTo, createServer, hasMany, Model, RestSerializer } from "miragejs";


const serializer = RestSerializer.extend({
    embed: true,
    root: false,
    serializeIds: 'always'
});


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

            this.get("/food", (schema, request) => {
                let q = request.queryParams.query.trim().toLowerCase();
                return schema.foods.where(food => food.name.toLowerCase().includes(q));
            });
            this.get("/food/:id", (schema, request) => {
                console.log(request);
                return schema.foods.find(request.params.id);
            });
            this.get("/users/:id/food_records/:date", (schema, request) => {
                return schema.foodRecords.where({userId: request.params.id, date: request.params.date}).sort((a,b) => b.id - a.id);
            });
            this.post("/users/:id/food_records", (schema, request) => {
                let attrs = JSON.parse(request.requestBody);
                console.log(attrs);
                return schema.foodRecords.create(attrs);
            });
        },
    })
    return server;
};

