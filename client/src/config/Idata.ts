interface IData {
    appName: string;
    appData: {
        appPath: string;
        appOwner: string;
        isValid: boolean;
    };
}

export default IData;