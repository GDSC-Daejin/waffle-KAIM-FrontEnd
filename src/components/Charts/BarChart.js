import React, { Component } from "react";
import Card from "components/Card/Card";
import Chart from "react-apexcharts";
import { barChartOptions } from "variables/charts";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      chartOptions: {},
    };
    this.fullData = null;
    this.keys = ["diesel", "gasoline", "premiumGasoline"];
    this.currentKeyIndex = 0;
    this.interval = null;
  }

  componentDidMount() {
    // API 호출하여 full 데이터셋 받아오기
    fetch("http://203.237.81.27:8000/dashboard-api/bar-graph")
      .then((res) => res.json())
      .then((data) => {
        this.fullData = data.data;
        const key = this.keys[this.currentKeyIndex];
        const currentData = this.fullData[key];
        // 현재 시리즈의 최소, 최대값 계산
        const computedMin = Math.min(...currentData) - 100;
        const computedMax = Math.max(...currentData) + 100;
        const newOptions = {
          ...barChartOptions,
          yaxis: {
            ...barChartOptions.yaxis,
            min: computedMin,
            max: computedMax,
          },
        };
        this.setState({
          chartData: [
            {
              name: key.charAt(0).toUpperCase() + key.slice(1),
              data: currentData,
            },
          ],
          chartOptions: newOptions,
        });
        // 10초마다 시리즈 순환 및 y축 범위 재계산
        this.interval = setInterval(() => {
          this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
          const newKey = this.keys[this.currentKeyIndex];
          const newData = this.fullData[newKey];
          const newComputedMin = Math.min(...newData) - 100;
          const newComputedMax = Math.max(...newData) + 100;
          const updatedOptions = {
            ...barChartOptions,
            yaxis: {
              ...barChartOptions.yaxis,
              min: newComputedMin,
              max: newComputedMax,
            },
          };
          this.setState({
            chartData: [
              {
                name: newKey.charAt(0).toUpperCase() + newKey.slice(1),
                data: newData,
              },
            ],
            chartOptions: updatedOptions,
          });
        }, 10000);
      })
      .catch((err) => console.error(err));
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    return (
      <Card
        py="1rem"
        height={{ sm: "200px" }}
        width="100%"
        bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
        position="relative"
      >
        <Chart
          options={this.state.chartOptions}
          series={this.state.chartData}
          type="bar"
          width="100%"
          height="100%"
        />
      </Card>
    );
  }
}

export default BarChart;
