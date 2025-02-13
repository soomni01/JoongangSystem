import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Input, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { Tooltip } from "../../components/ui/tooltip.jsx";
import { Field } from "../../components/ui/field.jsx";
import { SpacedLabel } from "../../components/tool/form/SpaceLabel.jsx";

function TextItem({ children, path, ...rest }) {
  const navigate = useNavigate();

  return (
    <Box
      h={"40px"}
      w={{ base: "90px", sm: "110px" }} // 반응형: 작은 화면에서는 더 좁게
      display="flex" // Flexbox 활성화
      justifyContent="center" // 가로 방향 가운데 정렬
      alignItems="center" // 세로 방향 가운데 정렬
      _hover={{ cursor: "pointer", bgColor: "whiteAlpha.700" }}
      onClick={() => path && navigate(path)}
      {...rest}
    >
      <Text fontWeight={"bold"} color={"gray.700"} whiteSpace={"nowrap"}>
        {children}
      </Text>
    </Box>
  );
}

function MemberInfo({ updateCheck }) {
  const { id } = useContext(AuthenticationContext);
  const [employee, setEmployee] = useState(null);
  const [empChange, setEmpChange] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/info/${id}`)
      .then((res) => res.data)
      .then((data) => {
        setEmployee(data);
        setEmpChange(data);
        setLoading(false);
      });
  }, []);

  let disable = false;
  if (employee !== null) {
    disable = !(
      employee.employeeName.trim().length > 0 &&
      employee.employeePassword > 0 &&
      employee.employeeTel
    );
  }

  if (loading) {
    return;
  }

  function formatPhoneNumber(value) {
    value = value.replace(/\D/g, ""); // 숫자만 남기기

    // 02 지역번호 (서울)
    if (value.startsWith("02")) {
      return value.replace(/(\d{2})(\d{3,4})(\d{4})/, "$1-$2-$3").slice(0, 12);
    }
    // 휴대폰 및 일반 지역번호 (3자리 지역번호 포함)
    return value.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3").slice(0, 13);
  }

  const handleSaveInfo = () => {
    axios
      .put("/api/info/update", {
        employeeKey: employee.employeeKey,
        employeeWorkPlaceName: employee.employeeWorkPlaceName,
        employeeNo: employee.employeeNo,
        employeeName: employee.employeeName,
        employeePassword: employee.employeePassword,
        employeeTel: employee.employeeTel,
        employeeNote: employee.employeeNote,
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        setEmpChange(employee);
        // 3초 후에 새로고침
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      });
  };
  const handleClose = () => {
    setEmployee(empChange);
  };

  return (
    <DialogRoot
      size={"lg"}
      onOpenChange={() => {
        setEmployee(empChange);
      }}
    >
      <DialogTrigger asChild>
        <TextItem
          onClick={() => {
            setEmployee(empChange);
          }}
        >
          {employee.employeeName}
        </TextItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>내 정보</DialogTitle>
        </DialogHeader>
        <DialogBody
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          css={{ "--field-label-width": "85px" }}
        >
          <Field label={<SpacedLabel text={"소속"} />} orientation="horizontal">
            <Input
              value={employee.employeeWorkPlaceName}
              readOnly
              variant="subtle"
            />
          </Field>
          <Field
            label={<SpacedLabel text={"아이디"} />}
            orientation="horizontal"
          >
            <Input value={employee.employeeNo} readOnly variant="subtle" />
          </Field>
          <Field label={<SpacedLabel text={"이름"} />} orientation="horizontal">
            <Input
              value={employee.employeeName}
              onChange={(e) =>
                setEmployee((prev) => ({
                  ...prev,
                  employeeName: e.target.value,
                }))
              }
            />
          </Field>
          <Field
            label={<SpacedLabel text={"비밀번호"} />}
            orientation="horizontal"
          >
            <Input
              value={employee.employeePassword}
              onChange={(e) =>
                setEmployee((prev) => ({
                  ...prev,
                  employeePassword: e.target.value,
                }))
              }
            />
          </Field>
          <Field
            label={<SpacedLabel text={"전화번호"} />}
            orientation="horizontal"
          >
            <Input
              value={employee.employeeTel}
              onChange={(e) =>
                setEmployee((prev) => ({
                  ...prev,
                  employeeTel: formatPhoneNumber(e.target.value),
                }))
              }
            />
          </Field>
          <Field label={<SpacedLabel text={"비고"} />} orientation="horizontal">
            <Textarea
              placeholder={"최대 50자"}
              value={employee.employeeNote}
              onChange={(e) =>
                setEmployee((prev) => ({
                  ...prev,
                  employeeNote: e.target.value,
                }))
              }
              maxHeight={"100px"}
            />
          </Field>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={handleClose}>
              취소
            </Button>
          </DialogActionTrigger>
          <Tooltip
            content="입력을 완료해 주세요."
            openDelay={500}
            closeDelay={100}
            disabled={!disable}
          >
            <Button onClick={handleSaveInfo} disabled={disable}>
              확인
            </Button>
          </Tooltip>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}

export default MemberInfo;
