import jwt from 'jsonwebtoken'

export const requireSignin = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;                    
        if(!token) return res.status(401).send({
            success: false,
            message: "token not found"
        })
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY); 
        req.user = decoded;      
        next();       
    } catch (error) {
        return res.status(403).send({
            status: false,
            message: "token is not valid",
            error
        })
    }
}

