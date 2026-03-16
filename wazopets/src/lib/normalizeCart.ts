export function normalizeCloudCart(items: any[]) {
  return (items ?? []).map((it) => ({
    id: it.productId,
    name: it.name,
    price: it.price,
    image: it.image,
    quantity: it.quantity,
  }));
}
