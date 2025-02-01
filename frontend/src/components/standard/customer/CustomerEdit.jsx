import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, HStack, Input, Stack, Textarea } from "@chakra-ui/react";
import { Button } from "../../ui/button.jsx";
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
import { Field } from "../../ui/field.jsx";
import { Checkbox } from "../../ui/checkbox.jsx";

function CustomerEdit({ isOpen, onCancel, customerKey, onEdit }) {
  const initialCustomer = {
    customerFax: "",
    customerAddressDetails: "",
    customerNote: "",
    customerActive: true,
  };
  const [customer, setCustomer] = useState(initialCustomer);

  //정보 불러오기
  useEffect(() => {
    if (isOpen && customerKey) {
      axios
        .get(`/api/customer/view/${customerKey}`)
        .then((res) => {
          setCustomer(res.data);
          console.log("back 반환", res.data);
        })
        .catch((error) => console.error("오류 발생", error));
    }
  }, [isOpen, customerKey]);
  // console.log("key", customerKey);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
    // console.log("입력 정보", customer);
  };

  const handleClose = () => {
    // setIsEditing(false);
    onCancel();
  };

  return (
    <Box>
      <DialogRoot
        open={isOpen}
        onOpenChange={() => {
          onCancel();
          setCustomer(initialCustomer);
        }}
        size={"lg"}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>협력 업체 정보</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {customer ? (
              <Stack gap={2}>
                <HStack>
                  <Field orientation="horizontal" label={"업체명"}>
                    <Input
                      name="customerName"
                      value={customer.customerName || ""}
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Field orientation="horizontal" label={"업체 코드"}>
                    <Input readOnly value={customer.customerCode || ""} />
                  </Field>
                </HStack>
                <Field orientation="horizontal" label={"취급 품목"}>
                  <Input readOnly name="itemName" value={customer.itemName} />
                </Field>
                <HStack>
                  <Field orientation="horizontal" label={"대표자"}>
                    <Input
                      name="customerRep"
                      value={customer.customerRep}
                      onChange={handleInputChange}
                    />
                  </Field>

                  <Field orientation="horizontal" label={"사업자 번호"}>
                    <Input
                      name="customerNo"
                      value={customer.customerNo}
                      onChange={handleInputChange}
                    />
                  </Field>
                </HStack>
                <HStack>
                  <Field orientation="horizontal" label={"전화 번호"}>
                    <Input
                      name="customerTel"
                      value={customer.customerTel}
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Field orientation="horizontal" label={"팩스 번호"}>
                    <Input
                      name="customerFax"
                      value={customer.customerFax}
                      onChange={handleInputChange}
                    />
                  </Field>
                </HStack>
                <Field orientation="horizontal" label={"우편 번호"}>
                  <Input
                    name={"customerPost"}
                    value={customer.customerPost}
                    onChange={handleInputChange}
                  />
                </Field>
                <Field orientation="horizontal" label={"주소"}>
                  <Input
                    name={"customerAddress"}
                    value={customer.customerAddress}
                    onChange={handleInputChange}
                  />
                </Field>
                <Field orientation="horizontal" label={"상세 주소"}>
                  <Input
                    name={"customerAddressDetails"}
                    value={customer.customerAddressDetails}
                    onChange={handleInputChange}
                  />
                </Field>
                <Field orientation="horizontal" label={"비고"}>
                  <Textarea
                    name={"customerNote"}
                    value={customer.customerNote}
                    onChange={handleInputChange}
                  />
                </Field>
                <Field orientation="horizontal" label={"사용 여부"}>
                  <Checkbox
                    transform="translateX(-2590%)"
                    name={"customerActive"}
                    isChecked={customer.customerActive}
                    onChange={(e) => {
                      console.log(
                        "체크박스 변경 전 값:",
                        customer.customerActive,
                      );
                      console.log("체크박스 변경 후 값:", e.target.checked);
                      const { checked } = e.target; // 체크 여부 가져오기
                      setCustomer((prevCustomer) => ({
                        ...prevCustomer,
                        customerActive: checked, // 상태 업데이트
                      }));
                    }}
                  />
                </Field>
              </Stack>
            ) : (
              <p>고객 정보를 불러오는 중입니다...</p>
            )}
          </DialogBody>
          <DialogFooter>
            <HStack>
              <DialogActionTrigger asChild>
                <Button variant="outline" onClick={handleClose}>
                  취소
                </Button>
              </DialogActionTrigger>
              <Button onClick={() => onEdit(customer)}>확인</Button>
            </HStack>
            <DialogCloseTrigger />
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}

export default CustomerEdit;
