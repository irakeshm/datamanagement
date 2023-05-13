interface AppData {
    appPath: string;
    appOwner: string;
    isValid: boolean;
}

interface App {
    appName: string;
    appData: AppData;
}

export default App;