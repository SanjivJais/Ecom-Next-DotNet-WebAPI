import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'fallback_jwt_secret'; // Replace with your JWT secret key

function decodeToken(token: string) {
    try {
        if (!SECRET_KEY) {
            throw new Error('SECRET_KEY is not set');
        }
        // Verify the token and decode its payload
        const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
        console.log(decoded)
        return decoded; // Contains the payload (e.g., { id, role, etc. })
    } catch (error) {
        console.error('Error decoding token:', error);
        return null; // Invalid or expired token
    }
}

export default decodeToken;
