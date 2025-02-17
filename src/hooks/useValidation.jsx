import { useState } from "react";
import {
  validateEmail,
  validateNickname,
  validateGithub,
  validateBlog,
  validatePassword,
} from "../shared/utils/validationUtils";

export const useValidation = (initialState) => {
  const [errors, setErrors] = useState({});

  //  전체 폼 검증
  const validateForm = (form) => {
    if(!form) return {};

    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return newErrors;
  };

  //  개별 필드 검증
  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return validateEmail(value) ? "" : "이메일 형식이 올바르지 않습니다.";
      case "nickname":
        return validateNickname(value)
          ? ""
          : "닉네임은 2~8자 한글, 영어, 숫자 조합만 가능합니다.";
      case "github":
        return validateGithub(value) ? "" : "GitHub URL 형식이 올바르지 않습니다.";
      case "blog":
        return validateBlog(value) ? "" : "블로그 URL 형식이 올바르지 않습니다.";
      case "password":
        if (!value) return "";
        return validatePassword(value)
          ? ""
          : "비밀번호는 소문자, 숫자, 특수문자 포함하여 8자 이상";
      default:
        return "";
    }
  };

  return { errors, validateField, validateForm, setErrors };
};