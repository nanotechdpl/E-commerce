const Message = require('./models/Message');

/**
 * Checks if an admin or sub-admin has replied in the chat room after the user's first message.
 * @param {string} roomId - The chat room ID
 * @param {string|number} userId - The user/agency ID
 * @returns {Promise<boolean>} - True if admin/sub-admin has replied, false otherwise
 */
async function hasAdminReplied(roomId, userId) {
    try {
        // Find all messages in the room ordered by creation time
        const messages = await Message.find({ room_id: roomId }).sort({ createdAt: 1 });
        
        // Find the first message from this user/agency
        const userFirstMessageIndex = messages.findIndex(m => 
            String(m.sender_id) === String(userId) && 
            (m.sender_role === 'user' || m.sender_role === 'agency')
        );
        
        if (userFirstMessageIndex === -1) {
            return false; // User/agency has not sent a message yet
        }
        
        // Check if there's an admin reply after the user's first message
        const messagesAfterUserFirst = messages.slice(userFirstMessageIndex + 1);
        
        // Robust admin detection - check sender_role, sender_name, and common admin IDs
        const adminReply = messagesAfterUserFirst.find(m => {
            const isAdminByRole = m.sender_role === 'admin' || m.sender_role === 'sub-admin';
            const isAdminByName = m.sender_name === 'Admin' || m.sender_name === 'admin';
            const isAdminById = m.sender_id === 2 || m.sender_id === '2'; // Common admin ID
            
            return isAdminByRole || isAdminByName || isAdminById;
        });
        
        return !!adminReply;
    } catch (error) {
        console.error('[hasAdminReplied] Error:', error);
        return false;
    }
}

module.exports = {
    hasAdminReplied
}; 