// https://medium.com/dailyjs/real-time-apps-with-typescript-integrating-web-sockets-node-angular-e2b57cbd1ec1
import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketio from 'socket.io';

import { Message } from './model/message.model';

export default class ChatServer {
    public static readonly PORT: number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }
    
    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;   
    }

    private sockets(): void {
        this.io = socketio(this.server);
    }

    private listen(): void {

        // Start listening
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);

        });

        // Handle connection and events
        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s', this.port);
            socket.on('message', (m: Message) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            })

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            })
        })
    }

    public getApp(): express.Application {
        return this.app;
    }
}

