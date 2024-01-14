const bcrypt=require("bcryptjs");

// Method to check the entered password is correct or not 
const validPassword = async (password,hash)=>{ 
    return await bcrypt.compare(password,hash);
}; 

module.exports=validPassword;