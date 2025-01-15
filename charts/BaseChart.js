export class Chart {
    constructor(selector, width, height, margin) {
        this.svg = d3.select(selector)
            .attr('viewBox', `0 0 ${width} ${height}`);
        this.width = width;
        this.height = height;
        this.margin = margin;
    }

    createXAxis(x, label) {
        const timeFormat = d3.timeFormat("%H:%M:%S"); // Format for HH:MM:SS
    
        this.svg.append('g')
            .attr('transform', `translate(0, ${this.height - this.margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(timeFormat)) // Use formatted tick labels
            .selectAll('text')
            .attr('font-size', '12px');
        
        this.svg.append('g')
            .attr('transform', `translate(${this.width / 2}, ${this.height - 10})`)
            .append('text')
            .attr('fill', 'black')
            .attr('font-weight', 'light')
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text(label);
    }
    
    
    createYAxis(y, label) {
        this.svg.append('g')
            .attr('transform', `translate(${this.margin.left}, 0)`)
            .call(d3.axisLeft(y))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -this.height / 2)
            .attr('y', -50)
            .attr('fill', 'black')
            .attr('font-weight', 'light')
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text(label);
    }
}