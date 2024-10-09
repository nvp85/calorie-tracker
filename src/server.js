import { createServer, Model } from "miragejs";


export function makeServer() {
  let server = createServer({
    models: {
        food: Model,
    },

    seeds(server) {
        server.create("food", {id: "1", name: "Chicken egg", calories: "157.0", proteins: "12.7", fats: "10.9", carbs: "0.7", serving: "55g"});
        server.create("food", {id: "2", name: "Bananas", calories: "95.0", proteins: "1.5", fats: "0.2", carbs: "21.8", serving: "110g"});
        server.create("food", {id: "3", name: "Milk whole", calories: "59.0", proteins: "2.9", fats: "3.2", carbs: "4.7", serving: "1 cup (225g)"});
        server.create("food", {id: "4", name: "Milk 1.5%", calories: "44.0", proteins: "2.8", fats: "1.5", carbs: "4.7", serving: "1 cup (255g)"});
        server.create("food", {id: "5", name: "Wheat Bread", calories: "242.0", proteins: "8.1", fats: "1.0", carbs: "48.8", serving: ""});
    },
// TODO: add brands and categories
    routes() {
        this.namespace = "api";

        this.get("/food", (schema, request) => {
            let q = request.queryParams.query.trim().toLowerCase();
            console.log(q);
            return schema.foods.where(food => food.name.toLowerCase().includes(q));
        });
        this.get("api/food/:id", (schema, request) => {
            return schema.food.find(request.params.id);
        });
    },
  })
  return server;
};

