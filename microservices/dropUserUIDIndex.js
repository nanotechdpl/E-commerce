const mongoose = require("mongoose");

const url =
  "mongodb+srv://tast25:qFoddj94LJlf9r5v@cluster0.ad9ott7.mongodb.net/tast25?retryWrites=true&w=majority";

const connectAndDropIndex = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas (tast25)");

    const collection = mongoose.connection.db.collection("admins");
    const indexes = await collection.indexes();

    const hasUserUIDIndex = indexes.find((i) => i.name === "userUID_1");
    if (hasUserUIDIndex) {
      await collection.dropIndex("userUID_1");
      console.log("✅ Dropped index: userUID_1");
    } else {
      console.log("ℹ️ No userUID_1 index found.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error dropping index:", error.message);
    process.exit(1);
  }
};

connectAndDropIndex();
