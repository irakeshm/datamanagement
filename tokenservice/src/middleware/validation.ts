import { Request, Response, NextFunction } from 'express';

const validateAuthCodeInput = (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    next();
};

export default validateAuthCodeInput;
