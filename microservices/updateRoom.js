db = db.getSiblingDB("chat_db");
db.rooms.updateOne(
  { room_id: "demo-room" },
  { $set: { participants: [{ user_id: 1, user_name: "Demo User", role: "member" }] } }
); 