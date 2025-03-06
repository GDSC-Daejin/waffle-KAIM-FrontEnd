// Chakra imports
import {
  Flex,
  Grid,
  Image,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// assets
import peopleImage from "assets/img/people-image.png";
import logoChakra from "assets/svg/logo-white.svg";
import BarChart from "components/Charts/BarChart";
import LineChart from "components/Charts/LineChart";
import Projects from "./components/Projects_copy";
// Custom icons
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  WalletIcon,
} from "components/Icons/Icons.js";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { dashboardTableData, timelineData } from "variables/general";
import ActiveUsers from "./components/ActiveUsers";
import BuiltByDevelopers from "./components/BuiltByDevelopers";
import MiniStatistics from "./components/MiniStatistics";
import SalesOverview from "./components/SalesOverview";
import WorkWithTheRockets from "./components/WorkWithTheRockets";

export default function Dashboard() {
  const iconBoxInside = useColorModeValue("white", "white");
  const [stats, setStats] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // 절대 URL 사용하여 호출 (proxy 없이)
    fetch("http://203.237.81.27:8000/dashboard-api/nav-info", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("dashboard-api/nav-info response:", data);
        setStats(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // 로깅: stats가 변경될 때마다 출력
  useEffect(() => {
    console.log("Updated stats:", stats);
  }, [stats]);

  return (
    <Flex flexDirection="column" pt={{ base: "30px", md: "50px", xl: "75px" }}>
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing="24px">
        <MiniStatistics
          title={"오늘의 환율"}
          amount={stats ? stats.exchangeRate[0].toFixed(2) : "-"}
          percentage={stats ? stats.exchangeRate[1].toFixed(2) : null}
          showPercent={false}
          icon={<WalletIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={"국제 유가 평균"}
          amount={stats ? stats.oilPrice[0].toFixed(2) : "-"}
          percentage={stats ? stats.oilPrice[1].toFixed(2) : null}
          showPercent={false}
          icon={<GlobeIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={"한국 기준 금리"}
          amount={stats ? stats.interestRate[0].toFixed(2) : "-"}
          percentage={stats ? stats.interestRate[1].toFixed(2) : null}
          icon={<DocumentIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={"한국 GDP"}
          amount={stats ? stats.gdp[0].toFixed(2) : "-"}
          percentage={stats ? stats.gdp[1].toFixed(2) : null}
          icon={<CartIcon h={"24px"} w={"24px"} color={iconBoxInside} />}
        />
      </SimpleGrid>
      <Grid my="13px"></Grid>
      <Grid
        templateColumns={{ sm: "1fr", lg: "1.3fr 1.7fr" }}
        templateRows={{ sm: "repeat(2, 1fr)", lg: "1fr" }}
        gap="24px"
        mb={{ lg: "26px" }}
      >
        <ActiveUsers
          title={"Active Users"}
          percentage={23}
          chart={<BarChart />}
        />
        <SalesOverview
          title={"Sales Overview"}
          percentage={5}
          chart={<LineChart key={location.key} />}
        />
      </Grid>
      <Projects
        title={"Projects Table"}
        captions={["Companies", "Budget", "Status", "Completion", ""]}
        data={dashboardTableData}
      />
    </Flex>
  );
}
