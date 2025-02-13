import React, { useEffect, useState } from "react";
import { Box, Button, Input, Spinner, Textarea } from "@chakra-ui/react";
import { toaster } from "../../ui/toaster.jsx";
import { Field } from "../../ui/field.jsx";
import { Checkbox } from "../../ui/checkbox.jsx";
import { Tooltip } from "../../ui/tooltip.jsx";
import axios from "axios";
import { SpacedLabel } from "../../tool/form/SpaceLabel.jsx";

export function FranchiseView({ franchiseKey, onSave, onDelete, onClose }) {
  const [franchise, setFranchise] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  // 유효성 검사
  const validate = () => {
    return (
      franchise?.franchiseName?.trim() !== "" &&
      franchise?.franchiseRep?.trim() !== "" &&
      franchise?.franchiseNo?.trim() !== "" &&
      franchise?.franchiseTel?.trim() !== "" &&
      franchise?.franchiseAddress?.trim() !== "" &&
      franchise?.franchisePost?.trim() !== "" &&
      franchise?.franchiseState?.trim() !== "" &&
      franchise?.franchiseCity?.trim() !== ""
    );
  };

  // 특정 가맹점 조회
  useEffect(() => {
    const franchiseData = () => {
      axios
        .get(`/api/franchise/view/${franchiseKey}`)
        .then((response) => {
          setFranchise(response.data);
          setOriginalData(response.data);
        })
        .catch((error) => {
          console.error("가맹점 데이터를 가져오는 데 실패했습니다:", error);
        });
    };

    if (franchiseKey) {
      franchiseData();
    }
  }, [franchiseKey]);

  // 입력값이 변경될 때마다 상태를 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFranchise((prevFranchise) => ({
      ...prevFranchise,
      [name]: value,
    }));
  };

  // 확인 (수정 후 저장)
  const handleSaveClick = () => {
    axios
      .put(`/api/franchise/edit/${franchiseKey}`, franchise)
      .then((res) => {
        const message = res.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        setOriginalData(franchise); // 저장 후 초기값 갱신
        onSave(franchise); // 부모 컴포넌트로 수정된 데이터 전달
        onDelete(franchiseKey); // 삭제 후 리스트에서 제거
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      });
  };

  // 취소 버튼 클릭 시 창 닫기
  const handleCancelClick = () => {
    onClose();
  };

  if (!franchise) {
    return <Spinner />;
  }

  return (
    <Box css={{ "--field-label-width": "85px" }}>
      <Box>
        <Box display="flex" gap={5}>
          <Field
            label={<SpacedLabel text="가맹점" />}
            orientation="horizontal"
            mb={15}
          >
            <Input
              name="franchiseName"
              value={franchise.franchiseName}
              onChange={handleChange}
            />
          </Field>
          <Field
            label={<SpacedLabel text="가맹점 코드" />}
            orientation="horizontal"
            mb={15}
          >
            <Input
              name="franchiseCode"
              value={franchise.franchiseCode}
              onChange={handleChange}
              readOnly
              variant="subtle"
            />
          </Field>
        </Box>
        <Field
          label={<SpacedLabel text="사업자 번호" />}
          orientation="horizontal"
          mb={15}
        >
          <Input
            name="franchiseNo"
            value={franchise.franchiseNo}
            onChange={handleChange}
          />
        </Field>
        <Box display="flex" gap={5}>
          <Field
            label={<SpacedLabel text="대표자" />}
            orientation="horizontal"
            mb={15}
          >
            <Input
              name="franchiseRep"
              value={franchise.franchiseRep}
              onChange={handleChange}
            />
          </Field>
          <Field
            label={<SpacedLabel text="전화번호" />}
            orientation="horizontal"
            mb={15}
          >
            <Input
              name="franchiseTel"
              value={franchise.franchiseTel}
              onChange={handleChange}
            />
          </Field>
        </Box>
        <Field
          label={<SpacedLabel text="우편번호" />}
          orientation="horizontal"
          mb={15}
        >
          <Input
            name="franchisePost"
            value={franchise.franchisePost}
            onChange={handleChange}
          />
        </Field>
        <Box display="flex" gap={5}>
          <Field
            label={<SpacedLabel text="광역시도" />}
            orientation="horizontal"
            mb={15}
          >
            <Input
              name="franchiseState"
              value={franchise.franchiseState}
              onChange={handleChange}
            />
          </Field>
          <Field
            label={<SpacedLabel text="시군" />}
            orientation="horizontal"
            mb={15}
          >
            <Input
              name="franchiseCity"
              value={franchise.franchiseCity}
              onChange={handleChange}
            />
          </Field>
        </Box>
        <Field
          label={<SpacedLabel text="주소" />}
          orientation="horizontal"
          mb={15}
        >
          <Input
            name="franchiseAddress"
            value={franchise.franchiseAddress}
            onChange={handleChange}
          />
        </Field>
        <Field
          label={<SpacedLabel text="상세 주소" />}
          orientation="horizontal"
          mb={15}
        >
          <Input
            name="franchiseAddressDetail"
            value={franchise.franchiseAddressDetail}
            onChange={handleChange}
          />
        </Field>
        <Field
          label={<SpacedLabel text="비고" />}
          orientation="horizontal"
          mb={15}
        >
          <Textarea
            name="franchiseNote"
            value={franchise.franchiseNote}
            onChange={handleChange}
            placeholder="최대 50자"
            style={{ maxHeight: "100px", overflowY: "auto" }}
          />
        </Field>
        <Field
          label={<SpacedLabel text="사용 여부" />}
          orientation="horizontal"
        >
          <Checkbox
            style={{ marginRight: "550px" }}
            checked={franchise.franchiseActive}
            onChange={(e) => {
              const checked = e.target.checked;
              setFranchise((prevFranchise) => ({
                ...prevFranchise,
                franchiseActive: checked, // 상태 업데이트
              }));
            }}
          />
        </Field>
        <Box display="flex" gap={4} mt={6} justifyContent="flex-end">
          <Button onClick={handleCancelClick} variant="outline">
            취소
          </Button>
          <Tooltip
            content="입력을 완료해 주세요."
            disabled={validate()}
            openDelay={100}
            closeDelay={100}
          >
            <Button onClick={handleSaveClick} disabled={!validate()}>
              등록
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
