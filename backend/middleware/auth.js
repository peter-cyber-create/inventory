const jwt = require("jsonwebtoken");
const User = require("../models/users/userModel.js");

const Auth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
        return res.status(401).json({ 
            status: 'error',
            message: "No Access Token Found" 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRETKEY)
        const user = await User.findByPk(decoded.id)

        if (!user) {
            return res.status(404).json({ 
                status: 'error',
                message: "No User Found with this Id" 
            });
        }
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ 
            status: 'error',
            message: "Not authorized to access this route" 
        });
    }
}

module.exports = Auth;