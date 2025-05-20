export const Currencies = [
  { value: "BRL", label: "R$ Real", locale: "pt-BR" },
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
  { value: "JPY", label: "¥ Yen", locale: "ja-JP" },
  { value: "GBP", label: "£ Pound", locale: "en-GB" },
  { value: "CNY", label: "¥ Chinese Yuan", locale: "zh-CN" },
  { value: "INR", label: "₹ Indian Rupee", locale: "en-IN" },
]

export type Currency = (typeof Currencies)[0]