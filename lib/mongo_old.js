const { MongoClient, ObjectId } = require('mongodb');
const debug = require("debug")("app:mongo");
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

        debug('Connection succesfully to mongo');
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

  get(collection, id) {
    return this.client
      .db(this.dbName)
      .collection(collection)
      .findOne({ _id: ObjectId(id) });
  }

  create(collection, data) {
    return this.client
      .db(this.dbName)
      .collection(collection)
      .insertOne(data)
      .then(result => result.insertedId);
  }

  update(collection, id, data) {
    return this.client
      .db(this.dbName)
      .collection(collection)
      .update({ _id: ObjectId(id) }, { $set: data })
      .then(result => result.upsertedId || id);
  }

  delete(collection, id) {
    this.client
      .db(this.dbName)
      .collection(collection)
      .deleteOne({ _id: ObjectId(id) })
      .then(() => id);
  }

}

module.exports = MongoLib;
