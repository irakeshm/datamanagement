import User from '../models/user';
import bcrypt from 'bcrypt';
import { Constants } from '../constants/const';

const getUserByUsername = (username: string): User | null => {
    const users: User[] = [
        { username: Constants.APP_ADMIN_NAME, password: bcrypt.hashSync(Constants.APP_ADMIN_PASSWORD, 10), role: Constants.APP_ADMIN_ROLE },
        { username: Constants.APP_USER_NAME, password: bcrypt.hashSync(Constants.APP_USER_PASSWORD, 10), role: Constants.APP_USER_ROLE },
    ];

    return users.find((user) => user.username === username) || null;
};

export default getUserByUsername;