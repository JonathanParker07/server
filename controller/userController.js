import User from "../model/userModel.js"

// Helper function to format user data
const formatUserData = async (user) => {
    // Convert boolean status to string if it's boolean
    const status = typeof user.status === 'boolean' 
        ? (user.status ? 'received' : 'not received')
        : user.status;

    // Ensure level is one of the valid options and has "Level" prefix
    let level = Number(user.level) || 100;
    if (![100, 200, 300, 400].includes(level)) {
        level = 100;
    }

    // Format student ID to 9 digits
    const studentid = String(user.studentid).padStart(9, '0');

    // Format room number to 4 digits
    const roomnum = String(user.roomnum).padStart(4, '0');

    const formattedData = {
        ...user,
        studentid: Number(studentid),
        roomnum: Number(roomnum),
        level,
        status
    };

    // Update the record in the database if any values changed
    if (user._id && (
        user.status !== status ||
        user.level !== level ||
        user.studentid !== Number(studentid) ||
        user.roomnum !== Number(roomnum)
    )) {
        await User.findByIdAndUpdate(user._id, formattedData);
    }

    return formattedData;
};

export const create = async(req, res) => {
    try {
        // Validate required fields
        const { name, studentid, roomnum, level, status } = req.body;
        
        if (!name || !studentid || !roomnum || !level || !status) {
            return res.status(400).json({
                message: "All fields are required: name, studentid, roomnum, level, and status"
            });
        }

        // Validate student ID format (9 digits)
        if (!/^\d{9}$/.test(studentid.toString())) {
            return res.status(400).json({
                message: "Student ID must be exactly 9 digits"
            });
        }

        // Validate room number format (4 digits)
        if (!/^\d{4}$/.test(roomnum.toString())) {
            return res.status(400).json({
                message: "Room number must be exactly 4 digits"
            });
        }

        // Validate level
        const validLevels = [100, 200, 300, 400];
        if (!validLevels.includes(Number(level))) {
            return res.status(400).json({
                message: "Level must be one of: 100, 200, 300, 400"
            });
        }

        // Validate status
        const validStatuses = ['received', 'not received'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Status must be either 'received' or 'not received'"
            });
        }

        // Check if student ID already exists
        const userExist = await User.findOne({ studentid });
        if (userExist) {
            return res.status(400).json({
                message: "Student ID already exists"
            });
        }

        // Create new user with validated data
        const newUser = new User({
            name,
            studentid: Number(studentid),
            roomnum: Number(roomnum),
            level: Number(level),
            status
        });

        const savedData = await newUser.save();
        res.status(201).json(savedData);

    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({
            message: "Error creating student",
            error: error.message
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const userData = await User.find();
        
        if (!userData || userData.length === 0) {
            return res.status(404).json({ message: "User data not found" });
        }

        // Format and update all records
        const formattedData = await Promise.all(
            userData.map(user => formatUserData(user.toObject()))
        );
        
        res.status(200).json(formattedData);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: "Error getting users", error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Format and update the user data
        const formattedUser = await formatUserData(user.toObject());
        
        res.status(200).json(formattedUser);
    } catch (error) {
        res.status(500).json({ message: "Error getting user", error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const id = req.params.id;
        const formattedData = await formatUserData({ ...req.body, _id: id });
        
        const updatedUser = await User.findByIdAndUpdate(
            id,
            formattedData,
            { 
                new: true,
                timestamps: true  // Ensure timestamps are updated
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "You deleted the user successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

export const searchStudents = async (req, res) => {
    try {
        const { query } = req.query;
        
        // Create a search query that matches either name or studentid
        const searchQuery = {
            $or: [
                // Search by name (case-insensitive)
                { name: { $regex: query, $options: 'i' } },
                // Search by exact student ID if the query is a number
                ...(isNaN(query) ? [] : [{ studentid: parseInt(query) }])
            ]
        };

        const students = await User.find(searchQuery);
        
        if (!students || students.length === 0) {
            return res.status(404).json({ message: "No students found matching your search" });
        }
        
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};
