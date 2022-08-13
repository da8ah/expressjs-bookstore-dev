import { MongoClient, Db, Document, Collection } from 'mongodb';
import config from '../src/config/config';

describe("Testing database CRUD operations", () => {
    let conn: any;
    let db: Db;
    let books: Collection;

    // Inicialization
    beforeAll(async () => {
        try {
            conn = await MongoClient.connect(`${config.MONGO_URI}`);
            db = await conn.db(config.MONGO_URI);
            books = db.collection("test_books"); // creates test collection
        } catch (error) {
            if (error) {
                console.error(error);
                process.exit(1);
            }
        }
    })

    // On finish
    afterAll(async () => {
        await db.dropCollection("test_books"); // drops test collection
        await conn.close();
    })

    // Create
    it("should insert a doc into collection", async () => {
        const mockBook: Document = { _id: 0, name: "Alejandro" }
        await books.insertOne(mockBook);

        // Read
        const book = await books.findOne({ _id: 0 });
        expect(book).toEqual(mockBook);
    })

    // Update
    it("should update a doc from a collection", async () => {
        const response = await books.updateOne({ _id: 0 }, { $set: { last: "Armijos" } });
        expect(response.modifiedCount).toBe(1);
    })

    // Delete
    it("should delete a doc from a collection", async () => {
        const response = await books.deleteOne({ _id: 0 });
        expect(response.deletedCount).toBe(1);

        // Read
        const book = await books.findOne({ _id: 0 });
        expect(book).toBe(null);
    })
})