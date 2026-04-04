import { MongoClient } from "mongodb";

// MongoDB URI from .env file
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in the .env file");
}

// Create a MongoClient instance
const client = new MongoClient(uri);

// Function to connect to MongoDB
export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db();
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

// Function to fetch data from a collection
export async function fetchData(collectionName: string, query: any = {}) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    const result = await collection.find({}).limit(8).toArray();
    return result;
  } catch (error) {
    console.error("Failed to fetch data", error);
    throw error;
  }
}

// Function to insert data into a collection
export async function insertData(collectionName: string, data: any) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(data);
    return result.insertedId;
  } catch (error) {
    console.error("Failed to insert data", error);
    throw error;
  }
}

// Function to update data in a collection
export async function updateData(
  collectionName: string,
  filter: any,
  update: any,
) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    const result = await collection.updateOne(filter, update);
    return result.modifiedCount;
  } catch (error) {
    console.error("Failed to update data", error);
    throw error;
  }
}

// Function to delete data from a collection
export async function deleteData(collectionName: string, filter: any) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne(filter);
    return result.deletedCount;
  } catch (error) {
    console.error("Failed to delete data", error);
    throw error;
  }
}
