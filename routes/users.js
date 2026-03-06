var express = require('express');
var router = express.Router();
const User = require('../schemas/users'); 

// [CREATE] Thêm mới User
router.post('/', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// [READ] Lấy danh sách tất cả User
router.get('/', async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false }).populate('role');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// [READ] Lấy User theo ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!user) return res.status(404).json({ message: 'User không tồn tại' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// [UPDATE] Cập nhật User
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ message: 'User không tồn tại' });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// [DELETE] Xoá mềm User
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (!deletedUser) return res.status(404).json({ message: 'User không tồn tại' });
        res.status(200).json({ message: 'Đã xoá User thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// [POST] Câu 2: API /enable
router.post('/enable', async (req, res) => {
    try {
        const { email, username } = req.body;
        
        const user = await User.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'Thông tin email hoặc username không chính xác' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// [POST] Câu 3: API /disable
router.post('/disable', async (req, res) => {
    try {
        const { email, username } = req.body;
        
        const user = await User.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'Thông tin email hoặc username không chính xác' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;