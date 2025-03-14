import { Client } from "@stomp/stompjs";

const SOCKET_URL = "ws://localhost:8081/ws";
const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');

class WebSocketService {
    constructor() {
        this.client = null;
    }

    connect(userId, firstName, onMessageReceived) {
        this.client = new Client({
            brokerURL: SOCKET_URL, // Use native WebSockets
            connectHeaders: {
                Authorization: `Bearer ${token}`, // Attach the JWT token
            },
            onConnect: () => {
                console.log("✅ Connected to WebSocket");
                console.log("🔗 Subscribing to:", `/user/${userId}/queue/messages`);
                this.subscribeToPrivateMessages(userId, firstName, onMessageReceived);
            },
            onStompError: (frame) => {
                console.error("❌ WebSocket error:", frame);
            },
        });

        this.client.activate();
    }

    connectToGroup(groupId, onGroupMessageReceived) {
        if (this.client && this.client.connected) {
            this.subscribeToGroup(groupId, onGroupMessageReceived);
        } else {
            console.log("🔌 Connecting to WebSocket for group chat...");
            this.client = new Client({
                brokerURL: SOCKET_URL,
                connectHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                onConnect: () => {
                    console.log("✅ Connected to WebSocket (Group)");
                    this.subscribeToGroup(groupId, onGroupMessageReceived);
                },
                onStompError: (frame) => {
                    console.error("❌ WebSocket error:", frame);
                },
            });

            this.client.activate();
        }
    }

    subscribeToPrivateMessages(userId, firstName, onMessageReceived) {
        const destination = `/user/${userId}/queue/messages`;
        this.client.subscribe(destination, (message) => {
            console.log("📩 Message received:", JSON.parse(message.body));
            onMessageReceived(JSON.parse(message.body));
        });
    }

    sendPrivateMessage(receiverId, message) {
        if (this.client && this.client.connected) {
            this.client.publish({
                destination: "/collapp/private-message",
                body: JSON.stringify(message),
            });
            console.log("📤 Message sent:", message);
        }
    }

    subscribeToGroup(groupId, onGroupMessageReceived) {
        if (!this.client || !this.client.connected) {
            console.error("🚨 WebSocket not connected! Retrying...");
            setTimeout(() => this.subscribeToGroup(groupId, onGroupMessageReceived), 1000);
            return;
        }
    
        if (!this.groupSubscriptions) {
            this.groupSubscriptions = {}; // Ensure it's initialized
        }
    
        if (this.groupSubscriptions[groupId]) {
            console.log(`✅ Already subscribed to group ${groupId}`);
            return;
        }
    
        const destination = `/topic/group/${groupId}`;
        this.client.subscribe(destination, (message) => {
            try {
                const parsedMessage = JSON.parse(message.body);
                console.log("📩 Received Group Message:", parsedMessage);
                onGroupMessageReceived(parsedMessage);
            } catch (error) {
                console.error("Error parsing message body:", error);
            }
        });
    }
    


    sendGroupMessage(groupId, message) {
        if (this.client && this.client.connected) {
            this.client.publish({
                destination: "/collapp/group-message",
                body: JSON.stringify(message),
            });
            console.log("📤 Group Message Sent:", message);
        } else {
            console.error("❌ WebSocket is not connected. Cannot send message.");
        }
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
        }
    }
}

export default new WebSocketService();
