import React, { useEffect, useState } from "react";
import { Box, Button, HStack, Input } from "@chakra-ui/react";
import { Field } from "../ui/field.jsx";
import axios from "axios";
import { DialogConfirmation } from "../tool/DialogConfirmation.jsx";
import { toaster } from "../ui/toaster.jsx";

export function ItemCommonCodeView({
  itemCommonCodeKey,
  setItemCommonCodeList,
  setChange,
}) {
  const [itemCommonCode, setItemCommonCode] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedItemCommonCode, setEditedItemCommonCode] = useState({
    itemCommonCode: "",
    itemCommonName: "",
    itemCommonCodeNote: "",
  });

  // 수정 상태에서 물품 공통 코드 변경 시 수정 상태 해제
  useEffect(() => {
    setIsEditing(false);
  }, [itemCommonCodeKey]);

  // 물품 공통 코드 상세 정보 가져오기
  useEffect(() => {
    if (itemCommonCodeKey) {
      axios
        .get(`/api/commonCode/item/view/${itemCommonCodeKey}`)
        .then((res) => {
          setItemCommonCode(res.data);
          setEditedItemCommonCode(res.data[0]);
        })
        .catch((error) => {
          console.error("물품 공통 코드 정보 요청 중 오류 발생: ", error);
        });
    }
  }, [itemCommonCodeKey]);

  // 폼 입력 값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItemCommonCode((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  // 물품 공통 코드 삭제 시 사용여부 false
  const handleDeleteConfirm = () => {
    axios
      .put(`/api/commonCode/item/delete/${itemCommonCodeKey}`)
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          description: data.message.text,
          type: data.message.type,
        });
        setItemCommonCodeList((prevItems) =>
          prevItems.filter(
            (itemCommonCode) =>
              itemCommonCode.itemCommonCodeKey !== itemCommonCodeKey,
          ),
        );
        setIsDialogOpen(false);
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({ description: message.text, type: message.type });
      });
  };

  return (
    <Box>
      <HStack>
        {itemCommonCode.map((itemCommonCode) => (
          <Box key={itemCommonCode.itemCommonCodeKey}>
            <Box>
              {isEditing ? (
                <>
                  <Field label={"품목코드"}>
                    <Input
                      name="itemCommonCode"
                      placeholder="품목코드"
                      value={editedItemCommonCode.itemCommonCode}
                      onChange={handleChange}
                    />
                  </Field>
                  <Field label={"품목명"}>
                    <Input
                      name="itemCommonName"
                      placeholder="품목명"
                      value={editedItemCommonCode.itemCommonName}
                      onChange={handleChange}
                    />
                  </Field>
                  <Field label={"비고"}>
                    <Input
                      name="itemCommonCodeNote"
                      placeholder="비고"
                      value={editedItemCommonCode.itemCommonCodeNote}
                      onChange={handleChange}
                    />
                  </Field>
                </>
              ) : (
                <>
                  <Field label={"품목코드"}>
                    <Input readOnly value={itemCommonCode.itemCommonCode} />
                  </Field>
                  <Field label={"품목명"}>
                    <Input readOnly value={itemCommonCode.itemCommonName} />
                  </Field>
                  <Field label={"비고"}>
                    <Input readOnly value={itemCommonCode.itemCommonCodeNote} />
                  </Field>
                  <Field label={"사용 여부"}>
                    <Input
                      readOnly
                      value={
                        itemCommonCode.itemCommonCodeActive ? "사용" : "미사용"
                      }
                    />
                  </Field>
                </>
              )}
            </Box>
          </Box>
        ))}
      </HStack>

      <Box>
        {isEditing ? (
          <HStack>
            <Button onClick={handleSubmitClick}>저장</Button>
            <Button onClick={() => setIsEditing(false)}>취소</Button>
          </HStack>
        ) : (
          <HStack>
            <Button onClick={handleEditClick}>수정</Button>
            <Button onClick={() => setIsDialogOpen(true)}>삭제</Button>
          </HStack>
        )}
      </Box>

      <DialogConfirmation
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="삭제 확인"
        body="정말로 이 항목을 삭제하시겠습니까?"
      />
    </Box>
  );
}
