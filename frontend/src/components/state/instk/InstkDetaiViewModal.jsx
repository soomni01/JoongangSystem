import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../../ui/dialog.jsx";
import { Button } from "../../ui/button.jsx";
import {
  Center,
  createListCollection,
  HStack,
  Input,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { Field } from "../../ui/field.jsx";
import React, { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../../context/AuthenticationProvider.jsx";
import axios from "axios";
import Select from "react-select";

export function InstkDetaiViewModal({
  isModalOpen,
  setChangeModal,
  instk,
  isLoading,
}) {
  const { id } = useContext(AuthenticationContext);
  const [detailData, setDetailData] = useState({ serialList: [] });
  const [serialLocationList, setSerialLocationList] = useState([]);
  const [item, setItem] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [selectLocationKey, setSelectLocationKey] = useState();

  useEffect(() => {
    if (!instk?.inputKey) return; // instk가 없으면 실행 안 함

    setIsDataLoading(true); // 데이터 로딩 시작

    axios
      .get(`/api/instk/detailview/${instk.inputKey}`, {
        params: {
          inputCommonCodeName: instk.inputCommonCodeName,
          inputNo: instk.inputNo,
        },
      })
      .then((res) => {
        setDetailData(res.data);
        const list = res.data?.serialLocationList || [];
        console.log(list, "list");
        if (list.length > 0) {
          const formattedList = createListCollection({
            items: list.map((item) => ({
              label: `${item.serialNo}`,
              value: item.locationKey,
            })),
          });
          setSerialLocationList(formattedList);
        } else {
          setSerialLocationList([]); // 빈 배열로 설정하여 오류 방지
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setSerialLocationList(null); // 에러 발생 시 리스트 초기화
      })
      .finally(() => {
        setIsDataLoading(false); // 데이터 로딩 완료
      });
  }, [instk]); // instk가 변경될 때마다 실행

  if (isLoading || isDataLoading) {
    return <Input readOnly value="로딩 중..." />;
  }

  const handleSerialChange = (e) => {
    console.log(e);
    setItem(e.value);
    setSelectLocationKey(e.value);
  };

  console.log(instk, "detail");

  return (
    <DialogRoot size={"lg"} open={isModalOpen} onOpenChange={setChangeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {instk.inputConsent == true ? "입고 상세" : "입고 반려"}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <DialogBody>
            <Center p={4}>
              <Spinner /> {/* 또는 다른 로딩 인디케이터 */}
            </Center>
          </DialogBody>
        ) : (
          <DialogBody>
            <Stack gap={15}>
              <HStack>
                <Field orientation="horizontal" label={"입고 구분 명"}>
                  <Input value={instk.inputCommonCodeName} />
                </Field>
                <Field orientation="horizontal" label={"주문 번호"}>
                  <Input readOnly value={instk.inputNo} />
                </Field>
              </HStack>
              <HStack>
                <Field orientation="horizontal" label={"품목 명"}>
                  <Input readOnly value={instk.itemCommonName} />
                </Field>
                {instk.inputConsent && ( // 오류 방지
                  <Field label={"시리얼 번호"} orientation="horizontal">
                    <SelectRoot
                      collection={serialLocationList}
                      value={item || ""}
                      onValueChange={handleSerialChange}
                      position="relative"
                    >
                      <SelectTrigger>
                        <SelectValueText placeholder={"전체"} />
                      </SelectTrigger>
                      <SelectContent
                        style={{
                          width: "100%",
                          top: "40px",
                          position: "absolute",
                        }}
                      >
                        {serialLocationList.items.map((code, index) => (
                          <SelectItem item={code} key={index}>
                            {code.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  </Field>
                )}
              </HStack>
              <HStack>
                <Field label={"주문 요청자"} orientation="horizontal">
                  <Input readOnly value={instk.requestEmployeeName} />
                </Field>
                <Field label={"사번"} orientation="horizontal">
                  <Input readOnly value={instk.requestEmployeeNo} />
                </Field>
              </HStack>
              <HStack>
                <Field label={"담당 업체"} orientation="horizontal">
                  <Input readOnly value={instk.customerName} />
                </Field>
                <Field label={"창고 정보"} orientation="horizontal">
                  <Input
                    readOnly
                    value={`${detailData.wareHouseName} ${instk.inputConsent ? `(Location: ${selectLocationKey || ""})` : ""}`}
                  />
                </Field>
              </HStack>
              {instk.inputConsent && (
                <HStack>
                  <Field label={"입고 승인자"} orientation="horizontal">
                    <Input readOnl value={instk.inputStockEmployeeName} />
                  </Field>
                  <Field label={"사번"} orientation="horizontal">
                    <Input readOnl value={instk.inputStockEmployeeNo} />
                  </Field>
                </HStack>
              )}
              <Field label={"승인 비고"} orientation="horizontal">
                <Input readOnly value={instk.inputNote} />
              </Field>
              {instk.inputConsent && (
                <Field label={"입고 날짜"} orientation="horizontal">
                  <Input readOnly value={instk.inputStockDate} />
                </Field>
              )}
              {instk.inputConsent && (
                <Field label={"입고 비고"} orientation="horizontal">
                  <Input readOnly value={detailData.inputStockNote} />
                </Field>
              )}
            </Stack>
          </DialogBody>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setChangeModal();
            }}
          >
            닫기
          </Button>
        </DialogFooter>
        <DialogCloseTrigger
          onClick={() => {
            setChangeModal();
          }}
        />
      </DialogContent>
    </DialogRoot>
  );
}
