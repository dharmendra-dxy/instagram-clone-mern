import jwt from "jsonwebtoken";

const isAuthenticated = async (req,res,next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message : "user is not authenticated",
                success : false,
            });
        }

        // if token-> then verify the token:
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message : "invalid token",
                success : false,
            });
        }

        // if decode is verified -> then send the userID:
        req.id = decode.userId;

        next();
    }
    catch(error){
        console.log("error: ", error);
    }
}

export default isAuthenticated;