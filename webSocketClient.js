export class WebSocketClient {
    constructor(url, message) {
        this.url = url;
        this.message = message;
        this.socket = null;
        this.onMessageCallback = null;
    }

    connect() {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log('WebSocket connection established');
            this.socket.send(JSON.stringify(this.message));
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


    sendMessage(newMessage) {
        this.message = { ...this.message, ...newMessage };
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log('Sending updated message:', this.message);  
            this.socket.send(JSON.stringify(this.message));
        }
    }

    updateMessage(newData) {
        this.message = { ...this.message, ...newData };
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log('Updating message with new data:', this.message);
            this.socket.send(JSON.stringify(this.message));
        }
    }

    convertTimestamp(timestamp) {
        return new Date(timestamp).toISOString();
    }
}
