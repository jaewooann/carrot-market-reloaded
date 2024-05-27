export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);
export const PASSWORD_REGEX_ERROR =
  "비밀번호는 소문자, 대문자, 숫자, 특수문자를 포함해야합니다.";

export const MB = 1048576;
export const PLZ_ADD_PHOTO = "사진을 추가해주세요.";
