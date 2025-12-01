// db.js
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`

let dbInstance = null
const dbName = `${process.env.MONGO_DB}`

async function connectToDatabase() {
  if (dbInstance){
    return dbInstance
  };

  const client = new MongoClient(url)      

  // Task 1: Connect to MongoDB
  // {{insert code}}
  try{
    await client.connect()
    console.log('Connected to MongoDB')

    // Task 2: Connect to database giftDB and store in variable dbInstance
    // {{insert code}}
    dbInstance = client.db(dbName)
    console.log(`Connected to database: ${dbName}`)

    // Task 3: Return database instance
    // {{insert code}}
    return dbInstance
  } catch (error){
    console.error('❌ Error connecting to MongoDB:', error)
    throw error
  } 

}

module.exports = connectToDatabase
