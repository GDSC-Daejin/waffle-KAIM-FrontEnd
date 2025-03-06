import React, { useEffect, useState } from "react";
import {
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TablesProjectRow from "components/Tables/TablesProjectRow";

const Projects = ({ title }) => {
  const textColor = useColorModeValue("gray.700", "white");
  // 새 헤더 배열: 지역, 경유, 휘발유, 고급휘발유, 등류, 증가 금액
  const headers = ["지역", "경유", "휘발유", "고급휘발유", "등류", "증가 금액"];

  // 지역 한글명 (순서대로)
  const regionNames = [
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "세종",
    "경기",
    "강원",
    "충북",
    "충남",
    "전북",
    "전남",
    "경북",
    "경남",
  ];

  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    fetch("https://kaim-api.youth-dev.com//dashboard-api/comparison", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const rawData = data.data;
        // 만약 rawData의 길이가 17보다 많다면, 첫 16개만 사용
        const filtered = rawData.slice(0, 16);
        const transformed = filtered.map((item, idx) => {
          // 각 유종: item.fuel = [today, diff]
          // budget: 오늘 가격, diff: 전날 가격 차이
          const budget = {
            diesel: item.diesel[0],
            gasoline: item.gasoline[0],
            premiumGasoline: item.premiumGasoline[0],
            kerosene: item.kerosene[0],
          };
          const diff = {
            diesel: item.diesel[1],
            gasoline: item.gasoline[1],
            premiumGasoline: item.premiumGasoline[1],
            kerosene: item.kerosene[1],
          };
          // 평균 diff = (sum of diffs)/4
          const avgDiff =
            (diff.diesel +
              diff.gasoline +
              diff.premiumGasoline +
              diff.kerosene) /
            4;
          return {
            name: regionNames[idx],
            logo: "", // 로고 없으면 빈 문자열
            budget,
            diff,
            progression: avgDiff.toFixed(2),
          };
        });
        setProjectData(transformed);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Card my='22px' overflowX={{ sm: "scroll", xl: "hidden" }}>
      <CardHeader p='6px 0px 22px 0px'>
        <Flex direction='column'>
          <Text fontSize='lg' color={textColor} fontWeight='bold' pb='.5rem'>
            {title}
          </Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Table variant='simple' color={textColor}>
          <Thead>
            <Tr my='.8rem' pl='0px'>
              {headers.map((caption, idx) => (
                <Th color='gray.400' key={idx} ps={idx === 0 ? "0px" : null}>
                  {caption}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {projectData.map((row) => (
              <TablesProjectRow
                key={row.name}
                name={row.name}
                logo={row.logo}
                budget={row.budget} // 객체 with fuel prices
                diff={row.diff} // 객체 with fuel diff values
                progression={row.progression}
              />
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default Projects;
