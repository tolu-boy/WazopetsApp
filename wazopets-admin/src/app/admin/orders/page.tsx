// "use client";

// import * as React from "react";
// import Image from "next/image";
// import { useQuery } from "convex/react";
// import { api } from "@/lib/convex-api";
// import { Input } from "@/components/ui/input";
// // import { Badge } from "@/components/ui/badge";
// // import { Button } from "@/components/ui/button";
// // import { useRouter } from "next/navigation";

// export default function OrdersPage() {
//   const orders = useQuery(api.functions.order.getAllOrders);
//   //   const router = useRouter();

//   const [search, setSearch] = React.useState("");

//   const filteredOrders = React.useMemo(() => {
//     if (!orders) return [];
//     return orders.filter(
//       (order: any) =>
//         order.paymentReference?.toLowerCase().includes(search.toLowerCase()) ||
//         order.userId.toLowerCase().includes(search.toLowerCase()),
//     );
//   }, [orders, search]);

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Orders</h1>
//       </div>

//       {/* Search */}
//       <Input
//         placeholder="Search by payment ref or user ID..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="max-w-sm"
//       />

//       {/* Loading */}
//       {!orders && <p>Loading orders...</p>}

//       {/* Empty */}
//       {orders && filteredOrders.length === 0 && (
//         <p className="text-muted-foreground">No orders found.</p>
//       )}

//       {/* Orders list */}
//       <div className="grid gap-4">
//         {filteredOrders.map((order: any) => {
//           //   const firstItem = order.items?.[0];

//           return (
//             <div
//               key={order._id}
//               className="rounded-xl bg-white border shadow-sm hover:shadow-md transition"
//             >
//               {/* HEADER */}
//               <div className="flex items-center justify-between px-5 pt-4">
//                 <div>
//                   <p className="text-sm font-semibold">
//                     Order #{order._id.slice(-6)}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {order.createdAt
//                       ? new Date(order.createdAt).toDateString()
//                       : "—"}
//                   </p>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <span className="text-sm font-semibold">
//                     ₦{order.totalAmount.toLocaleString()}
//                   </span>

//                   {order.deliveryStatus && (
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
//                       ${
//                         order.deliveryStatus === "processing"
//                           ? "bg-blue-100 text-blue-700"
//                           : order.deliveryStatus === "shipped"
//                             ? "bg-yellow-100 text-yellow-700"
//                             : order.deliveryStatus === "delivered"
//                               ? "bg-green-100 text-green-700"
//                               : order.deliveryStatus.includes("cancel")
//                                 ? "bg-red-100 text-red-700"
//                                 : "bg-gray-100 text-gray-700"
//                       }
//                     `}
//                     >
//                       {order.deliveryStatus}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* USER */}
//               <div className="px-5 text-xs text-gray-500 mt-1 ">
//                 User ID: {order.userId}
//               </div>

//               {/* ITEMS */}
//               <div className="mt-3 border-t divide-y">
//                 {order.items.map((item: any, idx: number) => (
//                   <div key={idx} className="flex gap-3 px-5 py-3">
//                     <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border">
//                       <Image
//                         src={item.image || "/placeholder.png"}
//                         alt={item.name}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>

//                     <div className="flex-1">
//                       <p className="text-sm font-medium">{item.name}</p>
//                       <p className="text-xs text-gray-500">
//                         Qty: {item.quantity} · ₦{item.price.toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* FOOTER */}
//               {/* <div className="flex items-center justify-between px-5 py-4 border-t  rounded-b-xl">
//               <div className="flex gap-2">
//                 {order.paymentStatus && (
//                   <Badge
//                     variant={
//                       order.paymentStatus === "paid"
//                         ? "default"
//                         : order.paymentStatus === "failed"
//                         ? "destructive"
//                         : "secondary"
//                     }
//                   >
//                     {order.paymentStatus}
//                   </Badge>
//                 )}
          
//                 <Badge variant="outline">
//                   {order.items.length} item{order.items.length > 1 ? "s" : ""}
//                 </Badge>
//               </div>
          
//               <Button
//                 size="sm"
//                 variant="outline"
//                 onClick={() => router.push(`/admin/orders/${order._id}`)}
//               >
//                 View Details
//               </Button>
//             </div> */}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


"use client";

import * as React from "react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convex-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentReference?: string;
  paymentStatus?: "pending" | "paid" | "failed";
  deliveryStatus?: "processing" | "shipped" | "delivered" | string;
  shippingAddress?: string;
  createdAt?: string;
  updatedAt?: string;
}

const OrdersPage: React.FC = () => {
  const orders = useQuery(api.functions.order.getAllOrders) as
    | Order[]
    | undefined;

  const updateDeliveryStatus = useMutation(
    api.functions.order.updateOrderDeliveryStatus
  );

  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Order | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState<string | undefined>();
  const [updating, setUpdating] = React.useState(false);

  const filteredOrders = React.useMemo(() => {
    if (!orders) return [];
    return orders.filter(
      (o) =>
        o.userId.toLowerCase().includes(search.toLowerCase()) ||
        o.paymentReference?.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  const deliveryStyles: Record<string, string> = {
    processing: "bg-blue-100 text-blue-700 border-blue-200",
    shipped: "bg-yellow-100 text-yellow-700 border-yellow-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
  };

  const paymentStyles: Record<string, string> = {
    paid: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    failed: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      <Input
        placeholder="Search by user ID or payment reference..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Card>
        <CardHeader>
          <CardTitle>All orders</CardTitle>
        </CardHeader>
        <CardContent>
          {!orders && (
            <p className="text-sm text-muted-foreground">Loading orders…</p>
          )}

          {orders && filteredOrders.length === 0 && (
            <p className="text-sm text-muted-foreground">No orders found.</p>
          )}

          {orders && filteredOrders.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      #{order._id.slice(-6)}
                    </TableCell>

                    <TableCell className="max-w-[220px] truncate">
                      {order.userId}
                    </TableCell>

                    <TableCell>
                      {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </TableCell>

                    <TableCell>
                      ₦{order.totalAmount.toLocaleString()}
                    </TableCell>

                    <TableCell>
                      {order.paymentStatus ? (
                        <Badge
                          variant="outline"
                          className={
                            paymentStyles[order.paymentStatus] ??
                            "bg-gray-100 text-gray-700 border-gray-200"
                          }
                        >
                          {order.paymentStatus}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      {order.deliveryStatus ? (
                        <Badge
                          variant="outline"
                          className={
                            deliveryStyles[order.deliveryStatus] ??
                            "bg-gray-100 text-gray-700 border-gray-200"
                          }
                        >
                          {order.deliveryStatus}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "—"}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelected(order);
                          setNewStatus(order.deliveryStatus);
                          setViewOpen(true);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* DETAILS MODAL */}
      <Dialog
        open={viewOpen}
        onOpenChange={(open) => {
          setViewOpen(open);
          if (!open) {
            setSelected(null);
            setNewStatus(undefined);
            setUpdating(false);
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order details</DialogTitle>
          </DialogHeader>

          {!selected ? (
            <p>No order selected.</p>
          ) : (
            <div className="space-y-6 text-sm">
              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">User ID</p>
                  <p className="font-medium break-all">
                    {selected.userId}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium">
                    ₦{selected.totalAmount.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Payment Reference</p>
                  <p className="font-medium break-all">
                    {selected.paymentReference ?? "—"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Shipping Address</p>
                  <p className="font-medium">
                    {selected.shippingAddress ?? "—"}
                  </p>
                </div>
              </div>

              {/* Editable Delivery Status */}
              <div>
                <p className="text-muted-foreground mb-2">
                  Update Delivery Status
                </p>

                <div className="flex items-center gap-3">
                  <Select
                    value={newStatus}
                    onValueChange={(value) => setNewStatus(value)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="processing">
                        Processing
                      </SelectItem>
                      <SelectItem value="shipped">
                        Shipped
                      </SelectItem>
                      <SelectItem value="delivered">
                        Delivered
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    size="sm"
                    disabled={
                      updating ||
                      !newStatus ||
                      newStatus === selected.deliveryStatus
                    }
                    onClick={async () => {
                      if (!newStatus) return;

                      try {
                        setUpdating(true);

                        await updateDeliveryStatus({
                          orderId: selected._id,
                          deliveryStatus: newStatus,
                        });

                        setSelected({
                          ...selected,
                          deliveryStatus: newStatus,
                        });
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setUpdating(false);
                      }
                    }}
                  >
                    {updating ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-muted-foreground mb-3">Items</p>

                <div className="space-y-3">
                  {selected.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 border rounded-md p-3"
                    >
                      <div className="relative h-14 w-14 overflow-hidden rounded border">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} · ₦
                          {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;