import request from 'supertest';
import server from '../src/server';
import app from '../src/app';
import { API_PATH } from '../src/routes/books.routes';

// Pre Configuration
const appHandler = request(app);

afterAll(async () => {
    server.close();
});

// Tests
describe("Test connection and each CRUD operation", () => {

    it("should load data to https Server", async () => {
        const response = await appHandler.post(API_PATH).send({
            isbn: "9780141988511",
            author: "Peterson, Jordan B.",
            title: "12 Rules for Life: An Antidote to Chaos"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        console.log(response.body)
    });

    it("should get data from https Server", async () => {
        const response = await appHandler.get(API_PATH)
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        console.log(response.body)
    });

    const isbn = API_PATH + "/9780141988511";
    it("should get one document from https Server", async () => {
        const response = await appHandler.get(isbn)
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        console.log(response.body)
    });

    it("should update one document from https Server", async () => {
        const response = await appHandler.put(isbn).send({
            description: "THE MULTI-MILLION COPY BESTSELLER"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        console.log(response.body)
    });

    it("should delete one document from https Server", async () => {
        const response = await appHandler.del(isbn)
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        console.log(response.body)
    });

});

describe("POST /books", () => {

    describe("given wrong urls", () => {
        it("should respond with 404 status code", async () => {
            const response = await appHandler.post(API_PATH + "/<script>alert('Hello World!')</script>")
            expect(response.statusCode).toBe(404)
        });
    });

    describe("data has not valid format", () => {
        it("should respond with 400 status code", async () => {
            const bodyData = [
                { username: "username" },
                { isbn: "" },
                {}
            ]
            for (const body of bodyData) {
                const response = await appHandler.post(API_PATH).send(body)
                expect(response.statusCode).toBe(400)
            }
        });
    });

});

describe("GET /books", () => {

    describe("given wrong urls", () => {
        it("should respond with 404 status code", async () => {
            const urls = ["<script>alert('Hello World!')</script>", "/"]
            for (const url of urls) {
                const response = await appHandler.get(API_PATH + "/" + url)
                expect(response.statusCode).toBe(404)
            }
        });

        it("should respond with 204 status code", async () => {
            const urls = ["asdkflasdf"]
            for (const url of urls) {
                const response = await appHandler.get(API_PATH + "/" + url)
                expect(response.statusCode).toBe(204)
            }
        });
    });

});