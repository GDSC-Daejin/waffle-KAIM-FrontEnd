// Chakra imports
import { Flex, SimpleGrid, Text, useColorModeValue, Box } from "@chakra-ui/react"; // Box 추가
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
// Custom icons
import {
  CartIcon,
  RocketIcon,
  StatsIcon,
  WalletIcon,
} from "components/Icons/Icons.js";
import React, { useEffect, useState } from "react";
import ChartStatistics from "./ChartStatistics";
import { ReactComponent as WaterIcon } from "components/Icons/water.svg"; // 추가된 임포트

const ActiveUsers = ({ chart }) => {
  const iconBoxInside = useColorModeValue("white", "white");
  const textColor = useColorModeValue("gray.700", "white");
  const [nationalData, setNationalData] = useState(null);

  useEffect(() => {
    fetch("http://203.237.81.27:8000/dashboard-api/national-average", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("national-average response:", data);
        setNationalData(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // 만약 데이터가 없으면 기본값 사용
  const lastWeekChange = nationalData ? nationalData[0][0] : 0;
  const fuelValues = nationalData ? nationalData[1] : [0, 0, 0, 0];
  // fuel 종류: Diesel, Gas, Premium, Kero
  const fuelTitles = ["Diesel", "Gas", "Premium", "Kero"];
  const fuelColors = ["#123E01", "#E4960E", "#B30709", "#767676"];

  return (
    <Card p='16px'>
      <CardBody>
        <Flex direction='column' w='100%'>
          {chart}
          <Flex direction='column' mt='24px' mb='36px' alignSelf='flex-start'>
            <Text fontSize='lg' color={textColor} fontWeight='bold' mb='6px'>
              전국 유가
            </Text>
            <Text fontSize='md' fontWeight='medium' color='gray.400'>
              <Text as='span' fontWeight='bold' color={lastWeekChange > 0 ? "green.400" : "red.400"}>
                {lastWeekChange}
              </Text>{" "}
              than last week
            </Text>
          </Flex>
          <SimpleGrid gap={{ sm: "12px" }} columns={4}>
            {fuelTitles.map((title, idx) => (
              <ChartStatistics
                key={title}
                title={title}
                amount={fuelValues[idx]}
                percentage={0}
                icon={
                  <Box 
                    as={WaterIcon} 
                    width="15px" 
                    height="15px" 
                    sx={{ fill: `${fuelColors[idx]} !important` }}
                  />
                }
              />
            ))}
          </SimpleGrid>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default ActiveUsers;
