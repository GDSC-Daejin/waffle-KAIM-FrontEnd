import React from "react";
import ReactApexChart from "react-apexcharts";
import { lineChartOptions } from "variables/charts";

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  fetchData = () => {
    fetch("http://203.237.81.27:8000/dashboard-api/linear-graph", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const apiData = data.data;
        const pastKeys = ["h6", "h5", "h4", "h3", "h2", "h1", "h0"];
        const futureKeys = ["pre0", "pre1", "pre2"];
        const xCategories = [...pastKeys, ...futureKeys];
        const fuels = ["diesel", "gasoline", "premiumGasoline", "kerosene"];
        const series = [];
        fuels.forEach((fuel) => {
          const pastValues = pastKeys.map((key) => apiData[key][fuel]);
          const pastSeries = pastValues.concat(Array(futureKeys.length).fill(null));
          const futureValues = futureKeys.map((key) => apiData[key][fuel]);
          const futureSeries = Array(pastKeys.length - 1).fill(null)
            .concat([apiData["h0"][fuel]])
            .concat(futureValues);

          const fuelName = fuel.charAt(0).toUpperCase() + fuel.slice(1);
          series.push({
            name: fuelName,
            data: pastSeries,
          });
          series.push({
            name: `${fuelName} (Forecast)`,
            data: futureSeries,
          });
        });

        const colors = [
          "#123E01", "#123E01",
          "#E4960E", "#E4960E",
          "#B30709", "#B30709",
          "#767676", "#767676",
        ];
        const dashArray = [0, 4, 0, 4, 0, 4, 0, 4];

        const updatedOptions = {
          ...lineChartOptions,
          xaxis: {
            ...lineChartOptions.xaxis,
            categories: xCategories,
          },
          stroke: {
            curve: "smooth",
            dashArray: dashArray,
          },
          colors: colors,
        };

        this.setState({
          chartData: series,
          chartOptions: updatedOptions,
        });
      })
      .catch((err) => console.error(err));
  }

  handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      this.fetchData();
    }
  }

  handleFocus = () => {
    this.fetchData();
  }

  componentDidMount() {
    this.fetchData();
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    window.addEventListener("focus", this.handleFocus);
  }

  componentWillUnmount() {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    window.removeEventListener("focus", this.handleFocus);
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.chartOptions}
        series={this.state.chartData}
        type="area"
        width="100%"
        height="100%"
      />
    );
  }
}

export default LineChart;
