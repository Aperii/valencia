//create mongodb connection
import mongodb, { MongoClient, Collection } from 'mongodb';
import Config from '../Config';

export const collections : {users?: Collection, posts?: Collection, cdn?: Collection, connections?: Collection} = {};

export async function connectToDatabase() {
    const client: MongoClient = new MongoClient(Config.MONGO_URI);
            
    await client.connect();
        
    const db: mongodb.Db = client.db(Config.DB_NAME);

    const usersCollection: mongodb.Collection = db.collection("user");
    const postsCollection: mongodb.Collection = db.collection("posts");
    const cdnCollection: mongodb.Collection = db.collection("cdn");
    const connCollection: mongodb.Collection = db.collection("connections");
 
    collections.users = usersCollection;
    collections.posts = postsCollection;
    collections.cdn = cdnCollection;
    collections.connections = connCollection;
       
    console.log(`Successfully connected to database: ${db.databaseName}`);
}