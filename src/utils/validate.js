// 正则验证

export const regMobile = /^(1[3-9][0-9])\d{8}$/;

export const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const regMobileCode = /^(\d{6}|\d{4})$/;

export const regChinese = /^[\u4e00-\u9fff]{0,}$/;
