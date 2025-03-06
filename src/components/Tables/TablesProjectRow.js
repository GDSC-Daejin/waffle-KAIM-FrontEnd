import React from "react";
import { Tr, Td, Flex, Text, useColorModeValue, Tooltip } from "@chakra-ui/react";

const TablesProjectRow = ({ name, logo, budget, diff, progression }) => {
  const textColor = useColorModeValue("gray.700", "white");

  // helper function: render budget cell with tooltip for diff, using red if increased, blue if decreased
  const renderBudgetCell = (value, diffValue) => {
    let cellColor = textColor;
    if (diffValue > 0) cellColor = "red.400";
    else if (diffValue < 0) cellColor = "blue.400";
    return (
      <Tooltip label={`전일대비 ${diffValue}`} fontSize="xs" placement="top">
        <Text color={cellColor} fontSize='sm'>
          {value}
        </Text>
      </Tooltip>
    );
  };

  return (
    <Tr>
      {/* 지역: 회사명 (프로필 아이콘 제거) */}
      <Td>
        <Flex align='center'>
          {/* Avatar 제거 */}
          <Text color={textColor} fontSize='sm' fontWeight='bold'>
            {name}
          </Text>
        </Flex>
      </Td>
      {/* 경유 */}
      <Td>{renderBudgetCell(budget?.diesel || "-", diff?.diesel)}</Td>
      {/* 휘발유 */}
      <Td>{renderBudgetCell(budget?.gasoline || "-", diff?.gasoline)}</Td>
      {/* 고급휘발유 */}
      <Td>{renderBudgetCell(budget?.premiumGasoline || "-", diff?.premiumGasoline)}</Td>
      {/* 등류 */}
      <Td>{renderBudgetCell(budget?.kerosene || "-", diff?.kerosene)}</Td>
      {/* 증가 금액: 평균 diff */}
      <Td>
        <Text color={textColor} fontSize='sm' fontWeight='bold'>
          {progression}
        </Text>
      </Td>
    </Tr>
  );
};

export default TablesProjectRow;
