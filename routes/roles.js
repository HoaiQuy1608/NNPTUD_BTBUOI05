var express = require('express');
var router = express.Router();
const Role = require('../schemas/roles');

// [CREATE] Thêm mới Role
router.post('/', async (req, res) => {
    try {
        const newRole = await Role.create(req.body);
        res.status(201).json(newRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// [READ] Lấy danh sách tất cả Role
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find({ isDeleted: false });
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// [READ] Lấy Role theo ID
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) return res.status(404).json({ message: 'Role không tồn tại' });
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// [UPDATE] Cập nhật Role
router.put('/:id', async (req, res) => {
    try {
        const updatedRole = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!updatedRole) return res.status(404).json({ message: 'Role không tồn tại' });
        res.status(200).json(updatedRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// [DELETE] Xoá mềm Role
router.delete('/:id', async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (!deletedRole) return res.status(404).json({ message: 'Role không tồn tại' });
        res.status(200).json({ message: 'Đã xoá mềm Role thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;