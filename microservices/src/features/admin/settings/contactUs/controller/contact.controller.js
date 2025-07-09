const Contact = require('../model/contact.model');


exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ 
        error: 'All fields are required',
        status: 400,
        message: 'Please provide name, email, phone, and message',
        success: false
       });
    }
    const newContact = new Contact({
      name,
      email,
      phone,
      message
    });

    const result = await newContact.save();


    res.status(201).json({
      message: 'Contact created successfully',
      data: result,
      status: 201,
      success: true
    });
  } catch (error) {
    res.status(400).json({ error: error.message,
      status: 400,
      message: 'Failed to create contact',
      success: false
    
     });
  }
};


exports.getAllContacts = async (req, res) => {
  try {
    const { from, to } = req.query;

    let filter = {};

    if (from && to) {
      filter.created_at = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const contacts = await Contact.find(filter);
    res.status(200).json(contacts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.updateContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, message },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};