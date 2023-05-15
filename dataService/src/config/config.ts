interface Config {
    tokenServiceHost: string;
    tokenServicePort: number;
}
const config: Config = {
    tokenServiceHost: process.env.NODE_ENV === 'docker' ? 'http://tokenservice' : 'http://localhost',
    tokenServicePort: parseInt(process.env.TOKENS_ERVICE_PORT || '3001', 10),
};

export default config;
