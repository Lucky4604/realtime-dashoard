import { CONFIG } from './config.js';
import { GraphCard } from './components/GraphCard.js';
import { LineChart } from './charts/LineChart.js';
import { WebSocketClient } from './webSocketClient.js';



export class Dashboard {
    constructor() {
        this.wsClients = {};
        this.lineChart = null;
        this.graphData = CONFIG.GRAPH_CARDS;
        this.autoRefreshInterval = null;
        this.tags = CONFIG.TAGS;
    }

    initializeDashboard() {
        this.createTimeSlider();
        this.createAutoRefreshControl();
        this.createGraphCards();
        this.setupLineChart();
        this.setupWebSockets();
        this.addUnloadListener();
    }

    createTimeSlider() {
        const filterContainer = d3.select("body")
            .append("div")
            .attr("class", "filter-container")
            .style("margin-top", "20px")
            .style("margin-left", "400px")
            .style("display", "flex")
            .style("align-items", "center");

        filterContainer.append("label")
            .attr("for", "time-slider")
            .text("Time: ")
            .style("margin-right", "10px");

        const timeSlider = filterContainer.append("input")
            .attr("type", "range")
            .attr("id", "time-slider")
            .attr("min", 0)
            .attr("max", 1440)
            .attr("step", 1)
            .style("width", "300px")
            .style("margin-left", "10px");

        const timeDisplay = filterContainer.append("span")
            .attr("id", "time-display")
            .style("margin-left", "10px");

        timeSlider.on("input", () => {
            const minutes = +timeSlider.property("value");
            const hours = Math.floor(minutes / 60);
            const displayMinutes = minutes % 60;
            const timeString = `${String(hours).padStart(2, '0')}:${String(displayMinutes).padStart(2, '0')}`;
            timeDisplay.text(timeString);
            this.updateGraphData(minutes);
        });

        timeSlider.property("value", 0);
        timeDisplay.text("00:00");
    }

    createAutoRefreshControl() {
        const controlContainer = d3.select("body")
            .append("div")
            .attr("class", "refresh-control-container")
            .style("margin-top", "20px")
            .style("margin-left", "400px")
            .style("display", "flex")
            .style("align-items", "center");

        controlContainer.append("label")
            .attr("for", "auto-refresh")
            .text("Auto Refresh: ")
            .style("margin-right", "10px");

        const refreshOptions = controlContainer.append("select")
            .attr("id", "auto-refresh");

        const arr = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45];

        refreshOptions.selectAll("option")
            .data(arr)
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => `${d} seconds`);

        refreshOptions.on("change", this.onAutoRefreshChange.bind(this));
    }

    setupWebSockets() {
        this.tags.forEach(tag => {
            const wsClient = new WebSocketClient(CONFIG.WS_URL, {
                ...CONFIG.WS_MESSAGE,
                tag: tag
            });
            wsClient.setOnMessageCallback((event) => this.handleWebSocketMessage(event, tag));
            wsClient.connect();
            this.wsClients[tag] = wsClient;
        });
    }

    handleWebSocketMessage(event, tag) {
        try {
            const receivedData = JSON.parse(event.data);
            console.log(`Received WebSocket data for ${tag}:`, receivedData);

            if (receivedData.measurements && receivedData.measurements.length > 0) {
                const formattedMeasurements = receivedData.measurements.map(measurement => ({
                    time: this.wsClients[tag].convertTimestamp(measurement.time),
                    value: measurement.value
                }));
                this.lineChart.updateData(formattedMeasurements, tag);
            }
        } catch (error) {
            console.error(`Error parsing received message for ${tag}:`, error);
        }
    }

    createGraphCards() {
        new GraphCard("body", this.graphData).create();
    }

    setupLineChart() {
        const { width, height, margin } = CONFIG.CHART;
        this.lineChart = new LineChart('#line-chart', width, height, margin, [], 'time', 'value');
    }

    updateGraphData(minutes) {
        const timeStamp = minutes * 60 * 1000;
        Object.values(this.wsClients).forEach(client => {
            client.updateMessage({
                time: timeStamp,
                realtime: "true"
            });
        });
        this.refreshData();
    }

    refreshData() {
        const currentTime = new Date().getTime();
        const fromDate = currentTime - 24 * 60 * 60 * 1000;
        const toDate = currentTime;

        Object.values(this.wsClients).forEach(client => {
            const message = {
                ...client.message,
                from_date: fromDate,
                to_date: toDate
            };
            console.log("Sending WebSocket message:", message);
            client.sendMessage(message);
        });
    }

    onAutoRefreshChange() {
        const selectedInterval = parseInt(d3.select("#auto-refresh").property("value"), 10);
        console.log("Auto-refresh interval changed to:", selectedInterval);

        if (this.autoRefreshInterval) {
            console.log("Clearing existing interval.");
            clearInterval(this.autoRefreshInterval);
        }

        if (selectedInterval > 0) {
            console.log("Setting new interval for auto-refresh.");
            this.autoRefreshInterval = setInterval(() => {
                console.log("Auto-refresh triggered");
                this.refreshData();
            }, selectedInterval * 1000);
        }
    }

    addUnloadListener() {
        window.addEventListener('beforeunload', () => {
            Object.values(this.wsClients).forEach(client => {
                if (client) {
                    client.disconnect();
                }
            });

            if (this.autoRefreshInterval) {
                clearInterval(this.autoRefreshInterval);
            }
        });
    }
}