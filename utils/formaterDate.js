export function formaterDate(formater, t) {
  const date = t ? new Date(t * 1) : new Date(),
      Y = date.getFullYear() + '',
      M = date.getMonth() + 1,
      D = date.getDate(),
      H = date.getHours(),
      m = date.getMinutes(),
      s = date.getSeconds()
  return formater
      .replace(/YYYY|yyyy/g, Y)
      .replace(/YY|yy/g, Y.substr(2, 2))
      .replace(/MM/g, (M < 10 ? '0' : '') + M)
      .replace(/DD/g, (D < 10 ? '0' : '') + D)
      .replace(/HH|hh/g, (H < 10 ? '0' : '') + H)
      .replace(/mm/g, (m < 10 ? '0' : '') + m)
      .replace(/ss/g, (s < 10 ? '0' : '') + s)
}

export default formaterDate
