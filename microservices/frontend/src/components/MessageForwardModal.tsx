import React, { useState, useEffect } from 'react';

interface MessageForwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
  messageContent: string;
  onForward: (toAdminId: string, note: string) => void;
}

const MessageForwardModal: React.FC<MessageForwardModalProps> = ({
  isOpen,
  onClose,
  messageId,
  messageContent,
  onForward
}) => {
  const [toAdminId, setToAdminId] = useState('');
  const [note, setNote] = useState('');
  const [availableAdmins, setAvailableAdmins] = useState<Array<{id: string, name: string}>>([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch available admins
      fetch('http://localhost:3006/api/users?user_type=admin')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setAvailableAdmins(data.data.map((admin: any) => ({
              id: admin.user_id.toString(),
              name: admin.user_name
            })));
          }
        })
        .catch(error => {
          console.error('Failed to fetch admins:', error);
        });
    }
  }, [isOpen]);

  const handleForward = () => {
    if (!toAdminId.trim()) {
      alert('Please select an admin to forward to');
      return;
    }
    onForward(toAdminId, note);
    onClose();
    setToAdminId('');
    setNote('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        <h2 className="text-xl font-bold mb-4">Forward Message</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Original Message:
          </label>
          <div className="p-3 bg-gray-100 rounded border text-sm">
            {messageContent}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Forward to Admin:
          </label>
          <select
            value={toAdminId}
            onChange={(e) => setToAdminId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an admin...</option>
            {availableAdmins.map(admin => (
              <option key={admin.id} value={admin.id}>
                {admin.name} (ID: {admin.id})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note (optional):
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note about why you're forwarding this message..."
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleForward}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Forward
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageForwardModal; 