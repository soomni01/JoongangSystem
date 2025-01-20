import React, { useEffect, useState } from "react";
import { Box, Button, Center, Heading, HStack } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../../components/ui/pagination.jsx";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { StandardSideBar } from "../../../components/tool/sidebar/StandardSideBar.jsx";
import { FranchiseList } from "../../../components/standard/franchise/FranchiseList.jsx";
import { FranchiseDialog } from "../../../components/standard/franchise/FranchiseDialog.jsx";

export function Franchise() {
  // 뷰 모드 관련 상태
  const [viewMode, setViewMode] = useState("view");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState({
    type: "all",
    keyword: "",
  });
  const [checkedActive, setCheckedActive] = useState(false);
  const [standard, setStandard] = useState({
    sort: "franchise_key",
    order: "DESC",
  });
  // 데이터 및 페이지 관련 상태
  const [franchiseList, setFranchiseList] = useState([]);
  const [count, setCount] = useState(0);
  // 선택된 항목 관련 상태
  const [franchiseKey, setFranchiseKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 새로운 가맹점 정보 추가 또는 수정
  const handleSave = (newFranchise) => {
    if (newFranchise?.franchiseKey) {
      console.log("가맹점 수정 또는 추가:", newFranchise);

      setFranchiseList((prevList) => {
        // 가맹점 수정 처리
        const index = prevList.findIndex(
          (item) => item.franchiseKey === newFranchise.franchiseKey,
        );

        // 만약 해당 가맹점이 리스트에 존재하면 -> (index !== -1)
        if (index !== -1) {
          // 수정된 가맹점 정보로 업데이트
          const updatedList = [...prevList];
          updatedList[index] = newFranchise;
          return updatedList;
        }

        // 가맹점이 리스트에 없는 경우 (추가)
        const updatedList = [newFranchise, ...prevList];

        // 1페이지는 최대 10개만 보이게 하고, 추가된 항목은 2페이지로 넘김
        if (updatedList.length > 10) {
          const secondPageData = updatedList.slice(10); // 2페이지로 넘길 데이터 (11번째 이후)
          const firstPageData = updatedList.slice(0, 10); // 1페이지 데이터

          setFranchiseList(firstPageData); // 1페이지 데이터 업데이트

          // 2페이지 데이터 처리
          console.log("넘길 데이터 (2페이지로):", secondPageData);

          return firstPageData; // 1페이지에 10개만 남기고 반환
        }

        return updatedList; // 10개 이하일 경우 그대로 반환
      });
    } else {
      console.error("잘못된 가맹점 정보가 전달되었습니다:", newFranchise);
    }
  };

  // 가맹점 삭제
  const handleDelete = (franchiseKey) => {
    // 해당 franchiseKey를 가진 가맹점을 리스트에서 제거
    setFranchiseList((prevList) => {
      return prevList.filter((item) => item.franchiseKey !== franchiseKey);
    });

    // 현재 페이지 번호 가져오기
    const currentPage = Number(searchParams.get("page") || 1);

    // 삭제 후 데이터 재조회: 현재 페이지의 가맹점 리스트 업데이트
    axios
      .get("/api/franchise/list", {
        params: {
          active: checkedActive,
          page: currentPage,
          type: searchParams.get("type") || "all",
          keyword: searchParams.get("keyword") || "",
          sort: searchParams.get("sort") || standard.sort,
          order: searchParams.get("order") || standard.order,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        setCount(data.count);
        setFranchiseList(data.franchiseList);
        setIsLoading(false);
      });
  };

  // 가맹점 리스트 가져오기
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/api/franchise/list", {
        params: {
          // active: searchParams.get("active") || "false",
          active: checkedActive,
          page: searchParams.get("page") || "1",
          type: searchParams.get("type") || "all",
          keyword: searchParams.get("keyword") || "",
          sort: searchParams.get("sort") || standard.sort,
          order: searchParams.get("order") || standard.order,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        setCount(data.count);
        setFranchiseList(data.franchiseList);
        setIsLoading(false);
      });
  }, [searchParams, standard, checkedActive]);

  // 검색 상태를 URLSearchParams에 맞게 업데이트
  useEffect(() => {
    const nextSearch = { ...search };
    if (searchParams.get("type")) {
      nextSearch.type = searchParams.get("type");
    } else {
      nextSearch.type = "all";
    }
    if (searchParams.get("keyword")) {
      nextSearch.keyword = searchParams.get("keyword");
    } else {
      nextSearch.keyword = "";
    }
    setSearch(nextSearch);
  }, [searchParams]);

  // 검색 파라미터 업데이트
  const handleSearchClick = () => {
    const nextSearchParam = new URLSearchParams(searchParams);
    if (search.keyword.trim().length > 0) {
      nextSearchParam.set("type", search.type);
      nextSearchParam.set("keyword", search.keyword);
      nextSearchParam.set("page", 1);
    } else {
      nextSearchParam.delete("type");
      nextSearchParam.delete("keyword");
    }
    setSearchParams(nextSearchParam);
  };

  // 삭제 내역 체크박스 상태 바꾸고, 그에 따라 URL의 'active' 파라미터 업데이트
  const toggleCheckedActive = () => {
    const nextValue = !checkedActive;
    setCheckedActive(nextValue);

    const nextSearchParams = new URLSearchParams(searchParams);
    if (nextValue) {
      nextSearchParams.set("active", "true");
    } else {
      nextSearchParams.set("active", "false");
    }
    setSearchParams(nextSearchParams);
  };

  // 페이지네이션
  const pageParam = searchParams.get("page") ? searchParams.get("page") : "1";
  const page = Number(pageParam);

  // 페이지 번호 변경 시 URL 의 쿼리 파라미터 업데이트
  function handlePageChange(e) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", e.page);
    setSearchParams(nextSearchParams);
  }

  // 정렬 기준 변경 시 URL 파라미터 업데이트
  const handleSortChange = (sortField) => {
    const nextOrder = standard.order === "ASC" ? "DESC" : "ASC";
    setStandard({ sort: sortField, order: nextOrder });
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("sort", sortField);
    nextSearchParams.set("order", nextOrder);
    setSearchParams(nextSearchParams);
  };

  // 가맹점 클릭 시 상세 보기
  const handleFranchiseClick = (key) => {
    setFranchiseKey(key);
    setIsDialogOpen(true);
  };

  // 추가 버튼 클릭 시 add 다이얼로그
  const handleAddFranchiseClick = () => {
    setIsAddDialogOpen(true);
  };

  // 다이얼로그 닫기
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsAddDialogOpen(false);
  };

  return (
    <Box display={"flex"} h={"100vh"}>
      <StandardSideBar />
      <Box flex={"1"} p={4}>
        <Heading size="md" mb={4}>
          가맹점 관리
        </Heading>
        <FranchiseList
          franchiseList={franchiseList}
          count={count}
          search={search}
          setSearch={setSearch}
          checkedActive={checkedActive}
          setCheckedActive={setCheckedActive}
          toggleCheckedActive={toggleCheckedActive}
          handlePageChange={handlePageChange}
          handleSearchClick={handleSearchClick}
          handleSortChange={handleSortChange}
          standard={standard}
          setStandard={setStandard}
          onFranchiseClick={handleFranchiseClick}
        />
        {/* 페이지네이션 */}
        <Center>
          <PaginationRoot
            onPageChange={handlePageChange}
            count={count}
            pageSize={10}
            // page={Number(searchParams.get("page") || 1)}
            variant="solid"
          >
            <HStack>
              <PaginationPrevTrigger />
              <PaginationItems />
              <PaginationNextTrigger />
            </HStack>
          </PaginationRoot>
        </Center>
        {/* 추가 버튼 */}
        <Box display="flex" justifyContent="flex-end" mb={4}>
          <Button onClick={handleAddFranchiseClick}>추가</Button>
        </Box>
        {/* 다이얼로그 */}
        <FranchiseDialog
          isOpen={isDialogOpen || isAddDialogOpen}
          onClose={handleDialogClose}
          franchiseKey={franchiseKey}
          isAddDialogOpen={isAddDialogOpen}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </Box>
    </Box>
  );
}
