const request = require("supertest");
const app = require("../src/app");

describe("Page routes", () => {
    test("GET / returns 200", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
    });

    test("GET /signup returns 200", async () => {
        const res = await request(app).get("/signup");
        expect(res.statusCode).toBe(200);
    });

    test("GET /dashboard returns 200", async () => {
        const res = await request(app).get("/dashboard");
        expect(res.statusCode).toBe(200);
    });

    test("GET /nonexistent returns 404", async () => {
        const res = await request(app).get("/nonexistent");
        expect(res.statusCode).toBe(404);
    });
});
