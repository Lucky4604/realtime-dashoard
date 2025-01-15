export const CONFIG = {
    WS_URL: 'wss://qa65.assetsense.com/ws/c2Fpa2lyYW4uaGlzdG9yaWFuOkh5ZGVWaWwjNzE=/false',
    WS_MESSAGE: {
        msg_type: "CONDITION_DASHBOARD",
        uid: "41-1072",
        to_date: new Date().getTime(),
        from_date: new Date().getTime() - 10*1000,
        realtime: "true",
        tag: "AS-AS-QA-379-1"
    },
    CHART: {
        width: 900,
        height: 600,
        margin: { top: 20, right: 50, bottom: 60, left: 60 }
    },
    CARDS: [
        { title: "136", subtitle: "Created Work Orders" },
        { title: "174", subtitle: "Completed Work Orders" },
        { title: "75", subtitle: "Open Work Orders" },
        { title: "98", subtitle: "Delayed Work Orders" }
    ],
    GRAPH_CARDS: [
        { id: "line-chart", title: "Real-time Data", subtitle: "Condition Data" },
     
    ],

    TAGS: [
        "AS-AS-QA-379-1",
        "AS-AS-QA-108-2",
        "AS-AS-QA-108-4",   
    ],

 
};