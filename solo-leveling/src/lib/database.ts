import {MongoClient} from 'mongodb';

//MongoDB connection string from env variables
const uri = process.env.MONGODB_URI;

if (!uri){
    throw new Error("Please add your MONGODB_URI to .env.local!")
}

//prevent multiple connections 
declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>; //eventually return client

if (process.env.NODE_ENV === "development"){
    if (!global._mongoClientPromise){ //if client is undefined
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect(); //async function that connects the new client uri
    }
    clientPromise = global._mongoClientPromise;
} else{
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;

