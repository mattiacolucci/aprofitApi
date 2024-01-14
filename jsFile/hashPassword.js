var bcrypt = require("bcryptjs");

const hashPassword = async function(password) { 
    const hash = await bcrypt.hash(password, 10);
    return hash;
}; 

module.exports=hashPassword;