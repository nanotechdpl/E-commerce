const CompanyCategory = require('../model/company.category.model');

const createCompanyCategory = async (req, res) => {
    try {
        const companyCategory = await CompanyCategory.create(req.body);
        res.status(201).json({ success: true, message: 'CompanyCategory created successfully', data: companyCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error creating CompanyCategory', error: error.message });
    }
};

const getAllCompanyCategorys = async (req, res) => {
    try {
        const companyCategory = await CompanyCategory.find();
        res.status(200).json({success: true, data: companyCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching CompanyCategorys', error: error.message });
    }
};

const getCompanyCategoryById = async (req, res) => {
    try {
        const companyCategory = await CompanyCategory.findById(req.params.id);
        if (!companyCategory) {
            return res.status(404).json({ message: 'CompanyCategory not found' });
        }
        res.status(200).json({ data: companyCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching CompanyCategory', error: error.message });
    }
};

const updateCompanyCategory = async (req, res) => {
    try {
        const companyCategory = await CompanyCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!companyCategory) {
            return res.status(404).json({ message: 'CompanyCategory not found' });
        }
        res.status(200).json({ message: 'CompanyCategory updated successfully', data: companyCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error updating CompanyCategory', error: error.message });
    }
};

const deleteCompanyCategory = async (req, res) => {
    try {
        const companyCategory = await CompanyCategory.findByIdAndDelete(req.params.id);
        if (!companyCategory) {
            return res.status(404).json({ message: 'CompanyCategory not found' });
        }
        res.status(200).json({ message: 'CompanyCategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting CompanyCategory', error: error.message });
    }
};

module.exports = {
    createCompanyCategory,
    getAllCompanyCategorys,
    getCompanyCategoryById,
    updateCompanyCategory,
    deleteCompanyCategory,
};