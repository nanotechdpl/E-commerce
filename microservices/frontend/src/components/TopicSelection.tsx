import React, { useEffect, useState } from 'react';
import { useSocket } from './SocketContext';

interface Topic {
  _id: string;
  name: string;
  description: string;
  category: string;
  priority: number;
}

interface TopicSelectionProps {
  onTopicSelected: (roomId: string, topicName: string) => void;
  userId: string;
  userName: string;
  userType: 'user' | 'agency';
}

const APP_NAME = 'ChatFlow';
const APP_DESC = 'A live chat interface that allows for seamless, natural communication and connection.';
const gradient = 'bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-400';

const TopicSelection: React.FC<TopicSelectionProps> = ({ 
  onTopicSelected, 
  userId, 
  userName, 
  userType 
}) => {
  const { socket } = useSocket();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleTopicSelected = (data: { room_id: string; topic_name: string; status: string }) => {
      if (data.status === 'success') {
        onTopicSelected(data.room_id, data.topic_name);
      }
    };

    const handleTopicSelectionError = (data: { error: string }) => {
      setError(data.error);
    };

    socket.on('topic_selected', handleTopicSelected);
    socket.on('topic_selection_error', handleTopicSelectionError);

    return () => {
      socket.off('topic_selected', handleTopicSelected);
      socket.off('topic_selection_error', handleTopicSelectionError);
    };
  }, [socket, onTopicSelected]);

  const fetchTopics = async () => {
    try {
      const response = await fetch('http://localhost:3006/api/topics');
      const data = await response.json();
      
      if (data.success) {
        setTopics(data.data);
      } else {
        setError('Failed to fetch topics');
      }
    } catch (error) {
      setError('Failed to fetch topics');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleStartChat = () => {
    if (!selectedTopic || !socket) return;

    socket.emit('select_topic', {
      user_id: userId,
      user_name: userName,
      user_type: userType,
      topic_id: selectedTopic._id,
      topic_name: selectedTopic.name
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f8fc]">
        <div className="text-lg">Loading topics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f8fc]">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f6f8fc]">
      <div className="w-full max-w-lg rounded-2xl shadow-2xl bg-white border border-gray-100 overflow-hidden">
        {/* Gradient Header */}
        <div className={`relative ${gradient} px-6 pt-6 pb-4`}> 
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <div>
              <div className="font-bold text-white text-xl">{APP_NAME}</div>
              <div className="text-xs text-white/80 mt-1 max-w-xs">{APP_DESC}</div>
            </div>
          </div>
        </div>

        {/* Topic Cards */}
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Live Chat Support</h1>
            <p className="text-gray-600 text-base">Please select a topic to start chatting with our support team</p>
          </div>
          <div className="grid grid-cols-1 gap-5">
            {topics.map((topic) => (
              <div
                key={topic._id}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 shadow-sm ${
                  selectedTopic?._id === topic._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
                onClick={() => handleTopicClick(topic)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-800">{topic.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      topic.category === 'technical' ? 'bg-red-100 text-red-800' :
                      topic.category === 'billing' ? 'bg-yellow-100 text-yellow-800' :
                      topic.category === 'support' ? 'bg-green-100 text-green-800' :
                      topic.category === 'sales' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {topic.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{topic.description || 'No description available'}</p>
                  <span className="text-xs text-gray-400">Priority: {topic.priority}</span>
                </div>
                {selectedTopic?._id === topic._id && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          {selectedTopic && (
            <div className="mt-8 text-center">
              <button
                onClick={handleStartChat}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow"
              >
                Start Chat - {selectedTopic.name}
              </button>
            </div>
          )}
          <div className="mt-8 text-center text-xs text-gray-400">
            <p>Your chat session will be automatically assigned to the best available support agent.</p>
            <p className="mt-2">If you stay offline for 15 minutes, your message history will be automatically deleted.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicSelection; 