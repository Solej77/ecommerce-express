const { MongoClient } = require('mongodb');
const { config } = require('../config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = encodeURIComponent(config.dbName);

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`; // prettier-ignore

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.dbName = DB_NAME;
    this.connection();
  }

  connection() {
    return new Promise((resolve, reject) => {
      this.client.connect(error => {
        if(error) {
          reject(error);
        }

        console.log('Connection succesfully to mongo');
        resolve(this.client.db(this.dbName));
      });
    });
  }

  getAll(collection, query) {
    return this.client
      .db(this.dbName)
      .collection(collection)
      .find(query)
      .toArray();
  }
}

module.exports = MongoLib;
