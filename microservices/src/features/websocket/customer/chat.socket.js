module.exports.chatuser = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected to chat');

        socket.on('chatMessage', (msg) => {
            console.log('Chat message:', msg);
            io.emit('chatMessage', msg);
        });

        // Handle private messaging
        socket.on('privateMessage', ({ sender, receiver, message }) => {
            const receiverSocketId = users[receiver];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('privateMessage', { sender, message });
            }
        });
        socket.on("send-message", async (data) => {
            const { sender, receiver, content } = data;
    
            // Fetch receiver's blocked users list
            const receiverData = await User.findById(receiver);
    
            // Prevent message notification if sender is blocked
            if (receiverData.blockedUsers.includes(sender)) {
                socket.emit("message-blocked", { message: "Message blocked by recipient." });
                return;
            }
    
            // Send message notification only if not blocked
            io.to(receiver).emit("new-message", { sender, content });
        });

        /* socket.on("send-message", async (data) => {
            const { sender, receiver, content } = data;
    
            // Fetch receiver's blocked users list
            const receiverData = await User.findById(receiver);
    
            // Prevent delivery if sender is blocked
            if (receiverData.blockedUsers.includes(sender)) {
                socket.emit("message-blocked", { message: "Message blocked by recipient." });
                return;
            }
    
            // Broadcast message if not blocked
            io.to(receiver).emit("receive-message", { sender, content });
        }); */

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected from chat');
        });
    });
};
