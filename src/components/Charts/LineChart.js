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

  componentDidMount() {
    fetch("http://203.237.81.27:8000/dashboard-api/linear-graph", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const apiData = data.data;
        // x축 카테고리: 과거(h6 ~ h0) + 미래(pre0 ~ pre2)
        const pastKeys = ["h6", "h5", "h4", "h3", "h2", "h1", "h0"];
        const futureKeys = ["pre0", "pre1", "pre2"];
        const xCategories = [...pastKeys, ...futureKeys];

        // 연료 종류 및 순서: 경유(diesel), 휘발유(gasoline), 고급휘발유(premiumGasoline), 등유(kerosene)
        const fuels = ["diesel", "gasoline", "premiumGasoline", "kerosene"];
        const series = [];
        fuels.forEach((fuel) => {
          // 과거 데이터: pastKeys에 해당하는 값, 미래 칸에는 null 채움
          const pastValues = pastKeys.map((key) => apiData[key][fuel]);
          const pastSeries = pastValues.concat(Array(futureKeys.length).fill(null));
          // 미래 데이터: 앞부분은 null, 단 h0 값으로 채워서 과거와 자연스럽게 연결, 이후 미래 값 채움
          const futureValues = futureKeys.map((key) => apiData[key][fuel]);
          const futureSeries = Array(pastKeys.length - 1).fill(null)
            .concat([apiData["h0"][fuel]])
            .concat(futureValues);

          const fuelName = fuel.charAt(0).toUpperCase() + fuel.slice(1);
           // 동일 연료의 과거값(실선)
          series.push({
            name: fuelName,
            data: pastSeries,
          });
          // 동일 연료의 미래값(점선)
          series.push({
            name: `${fuelName} (Forecast)`,
            data: futureSeries,
          });
        });

        // 각 연료는 2개의 시리즈가 있으므로, 총 8개 시리즈
        // 지정할 색상 순서: 과거, 미래 모두 동일 색상
        const colors = [
          "#123E01", "#123E01", // 경유
          "#E4960E", "#E4960E", // 휘발유
          "#B30709", "#B30709", // 고급휘발유
          "#767676", "#767676", // 등유
        ];
        // 과거는 실선(0), 미래는 점선(4) -> 시리즈별 dashArray
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
