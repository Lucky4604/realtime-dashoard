export class WebSocketClient {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.onMessageCallback = null;
    }

    connect(onOpenCallback) {
        this.socket = new WebSocket(this.url);
        
        this.socket.onopen = () => {
            console.log('WebSocket connection established');
            if (onOpenCallback) {
                onOpenCallback();
            }
        };

        this.socket.onmessage = (event) => {
            if (this.onMessageCallback) {
                this.onMessageCallback(event);
            }
        };

        this.socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }

    setOnMessageCallback(callback) {
        this.onMessageCallback = callback;
    }

    sendMessage(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log('Sending message:', message);
            this.socket.send(JSON.stringify(message));
        }
    }

    convertTimestamp(timestamp) {
        return new Date(timestamp).toISOString();
    }
}