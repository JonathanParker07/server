import User from "../model/userModel.js"


export const create =async(req, res)=>{
    try {
        const newUser = new User(req.body)
        const { studentid } = newUser;

        const userExist = await User.findOne({studentid});
        if (userExist){
            return res.status(400).json({message: "student already exists."});
        }
        const savedData = await newUser.save();
        res.status(200).json(savedData);


    } catch (error) {
        res.status(500).json({errorMessage:error.message})
        
    }
};

export const getAllUsers = async (req, res) =>{
    try {
          
        const userData = await User.find();
        
        if (!userData || userData.length === 0){
            return res.status(404).json({message:"User data not found"});
        }
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({errorMessage:error.message})
    }
};


export const getUserById = async (req, res)=>{
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist){
            return res.status(404).json({message:"Usernot found"});
            
        }
        res.status(200).json(userExist);

    
    } catch (error) {
        res.status(500).json({errorMessage:error.message})

        
    }
};

export const update = async (req, res)=>{
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist){
            return res.status(404).json({message:"Usernot found"});    
        }
        const updatedData = await User.findByIdAndUpdate(id, req.body, {
            new:true
        });
        res.status(200).json(updatedData);
        
    } catch (error) {
        res.status(500).json({errorMessage:error.message})

        
    }
}

export const deleteUser = async (req, res)=>{
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist){
            return res.status(404).json({message:"Usernot found"});    
        }
         await User.findByIdAndDelete(id);
        res.status(200).json({message:"You deleted the user successfully "})
        
    } catch (error) {
        res.status(500).json({errorMessage:error.message})

        
    }
}

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
