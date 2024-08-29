// 1开头的11位数字 第二位数字为3-9

export const phoneReg = /^1[3-9]\d{9}$/;
export const validatePhone = (phone: string) => {
  return phoneReg.test(phone);
};
