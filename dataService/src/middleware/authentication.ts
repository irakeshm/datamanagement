import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import config from '../config/config';

// Access the API host and port from the configuration
const tokenServiceHost = config.tokenServiceHost;
const tokenServicePort = config.tokenServicePort;

const validateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.header('Authorization');

    try {
        if (!accessToken) {
            return res.status(401).json({ error: 'Access token not provided' });
        }

        const response = await axios.get(tokenServiceHost + ':' + tokenServicePort + '/token/validate', {
            headers: {
                Authorization: accessToken
            }
        });
        const { valid } = response.data;

        if (!valid) {
            return res.status(401).json({ error: 'Invalid access token' });
        }
        next();
    } catch (error) {
        console.log('Error validating access token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default {
    validateAccessToken,
};
