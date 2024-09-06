export default function formatPrice(price: number) {
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    currency: "VND",
    style: "currency",
  }).format(price);
  return formattedPrice;
}
