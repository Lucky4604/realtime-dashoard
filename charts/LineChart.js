
import { Chart } from './BaseChart.js';



export class LineChart extends Chart {
    constructor(selector, width, height, margin, data, xKey, yKey) {
        super(selector, width, height, margin);
        this.data = {};
        this.xKey = xKey;
        this.yKey = yKey;
        this.colors = ['#2196F3', '#4CAF50', '#FFC107', '#E91E63'];
        this.setupTooltip();
    }

    setupTooltip() {
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background-color', 'white')
            .style('border', '1px solid #ddd')
            .style('border-radius', '4px')
            .style('padding', '8px')
            .style('font-size', '12px')
            .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)');
    }

    LineGraph() {
        this.svg.selectAll("*").remove();
    
        const allData = Object.values(this.data)
            .flat()
            .sort((a, b) => new Date(a[this.xKey]) - new Date(b[this.xKey]));
    
        if (allData.length === 0) return;
    
        const x = d3.scaleTime()
            .domain(d3.extent(allData, d => new Date(d[this.xKey])))
            .range([this.margin.left, this.width - this.margin.right]);
    
        const y = d3.scaleLinear()
            .domain([
                // d3.min(allData, d => d[this.yKey]),
                0,
                d3.max(allData, d => d[this.yKey])
            ])
            .range([this.height - this.margin.bottom, this.margin.top])
            .nice();

    
        this.createXAxis(x, 'Time');
        this.createYAxis(y, 'Value');
    
        const line = d3.line()
            .curve(d3.curveCardinal.tension(0.3))  
            .x(d => x(new Date(d[this.xKey])))
            .y(d => y(d[this.yKey]));
    
        Object.entries(this.data).forEach(([tag, seriesData], index) => {
            const sortedData = [...seriesData].sort((a, b) =>
                new Date(a[this.xKey]) - new Date(b[this.xKey])
            );
    
            this.svg.append("path")
                .datum(sortedData)
                .attr("fill", "none")
                .attr("stroke", this.colors[index % this.colors.length])
                .attr("stroke-width", 2)
                .attr("class", `line-${tag}`)
                .attr("d", line);
        });
    
        this.createLegend();
        this.addTooltip(x, y);
    }
    

    createLegend() {
        const legend = this.svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${this.width - this.margin.right -20}, ${this.margin.top-20})`);

        // Object.entries(this.data).forEach(([tag, _], index) => {
        //     const legendItem = legend.append("g")
        //         .attr("transform", `translate(0, ${index * 20})`);

        //     legendItem.append("rect")
        //         .attr("width", 15)
        //         .attr("height", 3)
        //         .style("margin-right", "150px")
        //         .attr("fill", this.colors[index % this.colors.length]);

        //     const displayTag = tag.split('-').pop();
        //     legendItem.append("text")
        //         .attr("x", 20)
        //         .attr("y", 5)
        //         .style("font-size", "12px")
        //         .text(`Series ${displayTag}`);
        // });
    }

    updateData(newData, tag) {
        const sortedNewData = [...newData].sort((a, b) =>
            new Date(a[this.xKey]) - new Date(b[this.xKey])
        );

        if (!this.data[tag]) {
            this.data[tag] = [];
        }
        this.data[tag] = sortedNewData;
        this.LineGraph();
    }

    addTooltip(x, y) {
        const timeFormat = d3.timeFormat("%H:%M:%S");
        const bisect = d3.bisector(d => new Date(d[this.xKey])).left;

        const focuses = Object.entries(this.data).map(([tag, _], index) => {
            const focus = this.svg.append("g")
                .attr("class", `focus-${tag}`)
                .style("display", "none");

            focus.append("circle")
                .attr("r", 5)
                .attr("fill", this.colors[index % this.colors.length]);

            return { tag, focus };
        });

        this.svg.append("rect")
            .attr("class", "overlay")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("opacity", 0)
            .on("mouseover", () => {
                focuses.forEach(({ focus }) => focus.style("display", null));
                this.tooltip.style('visibility', 'visible');
            })
            .on("mouseout", () => {
                focuses.forEach(({ focus }) => focus.style("display", "none"));
                this.tooltip.style('visibility', 'hidden');
            })
            .on("mousemove", (event) => {
                const x0 = x.invert(d3.pointer(event)[0]);
                let tooltipHTML = '<div style="font-weight: bold;">Data Points</div>';

                focuses.forEach(({ tag, focus }, index) => {
                    const seriesData = this.data[tag];
                    const i = bisect(seriesData, x0, 1);
                    if (i >= seriesData.length) return;

                    const d0 = seriesData[i - 1];
                    const d1 = seriesData[i];
                    if (!d0 || !d1) return;

                    const d = x0 - new Date(d0[this.xKey]) > new Date(d1[this.xKey]) - x0 ? d1 : d0;

                    focus.attr("transform",
                        `translate(${x(new Date(d[this.xKey]))},${y(d[this.yKey])})`);

                    tooltipHTML += `
                        <div style="color: ${this.colors[index % this.colors.length]} ">
                            Series ${tag.split('-').pop()}: ${d[this.yKey].toFixed(2)}
                        </div>`;
                });

                tooltipHTML += `<div>Time: ${timeFormat(x0)}</div>`;

                this.tooltip
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY - 10}px`)
                    .html(tooltipHTML);
            });
    }
}