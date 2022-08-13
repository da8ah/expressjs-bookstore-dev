import app from './app';
import './database';

const port = app.get('port')

const server = app.listen(port, () => {
    console.log('Server on port', port);
});

export default server;