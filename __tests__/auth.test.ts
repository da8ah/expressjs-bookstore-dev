import { MongoClient } from 'mongodb';
import request from 'supertest';
import server from '../src/server';
import app from '../src/app';
import config from '../src/config/config';

// Pre Configuration
const appHandler = request(app);

// On finish
afterAll(async () => {
    try {
        server.close();
    } catch (error) {
        if (error) {
            console.error(error);
            process.exit(1);
        }
    }
})

// Tests
const SIGNUP_PATH = "/signup";
const SIGNIN_PATH = "/signin";

describe("Test SignUp and SignIn data", () => {

    describe("data has not valid format", () => {
        const bodyData = [
            { email: "", password: "" },
            { password: "", email: "abcde@mail.com" },
            { password: "abcde" },
            { username: "username" },
            {}
        ];

        it("signup: should respond with 400 status code", async () => {
            for (const body of bodyData) {
                const response = await appHandler.post(SIGNUP_PATH).send(body)
                expect(response.statusCode).toBe(400)
            }
        });

        it("signin: should respond with 400 status code", async () => {
            for (const body of bodyData) {
                const response = await appHandler.post(SIGNIN_PATH).send(body)
                expect(response.statusCode).toBe(400)
            }
        });
    });

    describe("auth with new user", () => {
        afterAll(async () => {
            try {
                const conn = await MongoClient.connect(config.MONGO_URI);
                conn.db(config.MONGO_URI)
                    .collection("users")
                    .findOneAndDelete({ email: "abcde@mail.com" });

            } catch (error) {
                console.error(error);
            }
        });

        it("signup: should respond with 201 status code", async () => {
            const response = await appHandler.post(SIGNUP_PATH).send({
                email: "abcde@mail.com",
                password: "abcde"
            })
            expect(response.statusCode).toBe(201)
        });

        it("signin: should respond with 200 status code", async () => {
            const response = await appHandler.post(SIGNIN_PATH).send({
                email: "abcde@mail.com",
                password: "abcde"
            })
            expect(response.statusCode).toBe(200)
        });
    });

});
