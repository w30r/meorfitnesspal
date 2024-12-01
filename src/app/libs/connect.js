import mongoose from "mongoose";

const connect2Mongo = () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("🍃 Freaking connected to DB");
  } catch (err) {
    console.error(err);
  }
};

export default connect2Mongo;
