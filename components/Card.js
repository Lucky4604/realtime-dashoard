export class Card {
    constructor(selector, data) {
        this.selector = selector;
        this.data = data;
    }

    create() {
        const cardContainer = d3.select(this.selector)
            .append("div")
            .attr("class", "card-container");

        cardContainer.selectAll(".card")
            .data(this.data)
            .enter()
            .append("div")
            .attr("class", "card")
            .html(d => `
                <div class="card1"> 
                    <h4>${d.title}</h4>
                    <h6>${d.subtitle}</h6>
                </div>
            `);
    }
}
