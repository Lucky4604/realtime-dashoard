export class GraphCard {
    constructor(selector, data) {
        this.selector = selector;
        this.data = data;
    }

    create() {
        const graphCardsContainer = d3.select(this.selector)
            .append("div")
            .attr("class", "graph-cards-container");

       const cards= graphCardsContainer.selectAll(".graph-card")
            .data(this.data)
            .enter()
            .append("div")
            .attr("class", "card graph-card")
            cards.append("h4")
            .text(d => d.title);

            cards.append("svg")
             .attr("id", d => d.id);
    }
}