export class GraphCard {
    constructor(selector, data) {
        this.selector = selector;
        this.data = data;
    }

    create() {
        const graphCardsContainer = d3.select(this.selector)
            .append("div")
            .attr("class", "graph-cards-container");

        graphCardsContainer.selectAll(".graph-card")
            .data(this.data)
            .enter()
            .append("div")
            .attr("class", "card graph-card")
            .html(d => `
                <h4>${d.title}</h4>
                <svg id="${d.id}"></svg>
            `);
    }
}