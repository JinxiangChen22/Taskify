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

    test("GET /privacy returns 200", async () => {
        const res = await request(app).get("/privacy");
        expect(res.statusCode).toBe(200);
    });

    test("GET /privacy contains Privacy Policy and essential cookies", async () => {
        const res = await request(app).get("/privacy");
        expect(res.text).toContain("Privacy Policy");
        expect(res.text.toLowerCase()).toContain("essential cookies");
    });

    test("GET /dashboard without session redirects to /signup", async () => {
        const res = await request(app).get("/dashboard");
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe("/signup");
        expect(res.text).not.toContain('action="/logout"');
    });

    test("GET /nonexistent returns 404", async () => {
        const res = await request(app).get("/nonexistent");
        expect(res.statusCode).toBe(404);
    });
});

describe("D1 session auth", () => {
    test("POST /login with valid fields redirects to /dashboard and sets session cookie", async () => {
        const agent = request.agent(app);
        const res = await agent
            .post("/login")
            .type("form")
            .send({ LoginEmail: "user@test.com", LoginPassword: "secret" })
            .expect(302);
        expect(res.headers.location).toBe("/dashboard");
        expect(res.headers["set-cookie"]).toBeDefined();
    });

    test("authenticated GET /dashboard returns 200", async () => {
        const agent = request.agent(app);
        await agent
            .post("/login")
            .type("form")
            .send({ LoginEmail: "user@test.com", LoginPassword: "secret" })
            .expect(302);
        const dash = await agent.get("/dashboard").expect(200);
        expect(dash.text).toContain("dashboard-content-container");
    });

    test("POST /logout destroys session and redirects to /", async () => {
        const agent = request.agent(app);
        await agent
            .post("/login")
            .type("form")
            .send({ LoginEmail: "x@test.com", LoginPassword: "p" })
            .expect(302);
        await agent.get("/dashboard").expect(200);
        const out = await agent.post("/logout").expect(302);
        expect(out.headers.location).toBe("/");
        const blocked = await agent.get("/dashboard").expect(302);
        expect(blocked.headers.location).toBe("/signup");
    });

    test("POST /login with missing fields returns 400", async () => {
        const res = await request(app)
            .post("/login")
            .type("form")
            .send({ LoginEmail: "", LoginPassword: "" })
            .expect(400);
        expect(res.text).toContain("Email and password are required.");
    });
});
