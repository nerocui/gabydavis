import { Mongo } from "meteor/mongo";

export const Keys = new Mongo.Collection("keys");
export const Records = new Mongo.Collection("records");
export const People = new Mongo.Collection("people");
