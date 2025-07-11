const mongoose = require('mongoose');
const Topic = require('../models/Topic');
const PredefinedMessage = require('../models/PredefinedMessage');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eccommerce');
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedTopics = async () => {
  const topics = [
    {
      name: 'Technical Support',
      description: 'Get help with technical issues and troubleshooting',
      category: 'technical',
      priority: 1
    },
    {
      name: 'Billing & Payments',
      description: 'Questions about billing, payments, and invoices',
      category: 'billing',
      priority: 2
    },
    {
      name: 'General Support',
      description: 'General questions and support requests',
      category: 'support',
      priority: 3
    },
    {
      name: 'Sales & Pricing',
      description: 'Information about products, pricing, and sales',
      category: 'sales',
      priority: 4
    },
    {
      name: 'Account Management',
      description: 'Help with account settings and management',
      category: 'general',
      priority: 5
    }
  ];

  for (const topic of topics) {
    try {
      await Topic.findOneAndUpdate(
        { name: topic.name },
        topic,
        { upsert: true, new: true }
      );
      console.log(`Topic "${topic.name}" seeded successfully`);
    } catch (error) {
      console.error(`Error seeding topic "${topic.name}":`, error);
    }
  }
};

const seedPredefinedMessages = async () => {
  const adminId = 2; // Default admin ID
  const adminName = 'Admin';

  const messages = [
    {
      admin_id: adminId,
      admin_name: adminName,
      title: 'Welcome Message',
      message: 'Hello! Welcome to our support chat. How can I help you today?',
      category: 'greeting'
    },
    {
      admin_id: adminId,
      admin_name: adminName,
      title: 'Technical Issue Acknowledgment',
      message: 'I understand you\'re experiencing a technical issue. Let me help you resolve this.',
      category: 'technical'
    },
    {
      admin_id: adminId,
      admin_name: adminName,
      title: 'Billing Inquiry Response',
      message: 'I can help you with your billing inquiry. Could you please provide your account number?',
      category: 'billing'
    },
    {
      admin_id: adminId,
      admin_name: adminName,
      title: 'Escalation Notice',
      message: 'I\'m escalating your issue to our specialized team. They will contact you shortly.',
      category: 'support'
    },
    {
      admin_id: adminId,
      admin_name: adminName,
      title: 'Closing Message',
      message: 'Thank you for contacting us. Is there anything else I can help you with?',
      category: 'general'
    },
    {
      admin_id: adminId,
      admin_name: adminName,
      title: 'Follow-up Request',
      message: 'I\'ll follow up on this issue and get back to you within 24 hours.',
      category: 'support'
    },
    {
      admin_id: adminId,
      admin_name: adminName,
      title: 'Sales Information',
      message: 'I\'d be happy to provide you with information about our products and pricing.',
      category: 'sales'
    },
    {
      admin_id: adminId,
      admin_name: adminName,
      title: 'Account Verification',
      message: 'For security purposes, could you please verify your account details?',
      category: 'general'
    }
  ];

  for (const message of messages) {
    try {
      await PredefinedMessage.findOneAndUpdate(
        { title: message.title, admin_id: message.admin_id },
        message,
        { upsert: true, new: true }
      );
      console.log(`Predefined message "${message.title}" seeded successfully`);
    } catch (error) {
      console.error(`Error seeding message "${message.title}":`, error);
    }
  }
};

const main = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    await seedTopics();
    await seedPredefinedMessages();
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

main(); 