export class Card {
    constructor(selector, data) {
        this.selector = selector;
        this.data = data;
    }

    create() {
        const cardContainer = d3.select(this.selector)
            .append("div")
            .attr("class", "card-container");

       const cards= cardContainer.selectAll(".card")
            .data(this.data)
            .enter()
            .append("div")
            .attr("class", "card")
            cards.append('h4')
            .text(d => d.title);
          
          cards.append('h6')
            .text(d => d.subtitle);
    }
}
