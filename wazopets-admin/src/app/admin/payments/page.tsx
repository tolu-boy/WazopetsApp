
"use client";

import * as React from "react";
import { useQuery } from "convex/react";
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

interface Payment {
  _id: string;
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  status: "pending" | "successful" | "failed" | "refunded" | "paid";
  reference: string;
  provider?: string;
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
}

const PaymentsPage: React.FC = () => {
  const payments = useQuery(api.functions.payments.getAllPayments) as
    | Payment[]
    | undefined;

  const [search, setSearch] = React.useState("");
  const [viewOpen, setViewOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Payment | null>(null);

  const filteredPayments = React.useMemo(() => {
    if (!payments) return [];
    return payments.filter(
      (p) =>
        p.reference.toLowerCase().includes(search.toLowerCase()) ||
        p.userId.toLowerCase().includes(search.toLowerCase()) ||
        p.orderId.toLowerCase().includes(search.toLowerCase())
    );
  }, [payments, search]);

  // 🔥 Status Colors
  const statusStyles: Record<Payment["status"], string> = {
    successful:
      "bg-emerald-100 text-emerald-700 border-emerald-300 font-semibold",
    paid:
      "bg-emerald-100 text-emerald-700 border-emerald-300 font-semibold",
    pending: "bg-amber-100 text-amber-700 border-amber-300",
    failed: "bg-red-100 text-red-700 border-red-300",
    refunded: "bg-gray-100 text-gray-700 border-gray-300",
  };

  // 🔥 Payment Method Colors
  const methodStyles: Record<string, string> = {
    card: "bg-blue-100 text-blue-700 border-blue-300",
    transfer: "bg-purple-100 text-purple-700 border-purple-300",
    bank_transfer: "bg-indigo-100 text-indigo-700 border-indigo-300",
    wallet: "bg-teal-100 text-teal-700 border-teal-300",
    cash: "bg-orange-100 text-orange-700 border-orange-300",
  };

  const getMethodStyle = (method?: string) => {
    if (!method) return "bg-gray-100 text-gray-700 border-gray-300";
    return (
      methodStyles[method.toLowerCase()] ||
      "bg-gray-100 text-gray-700 border-gray-300"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Payments</h1>
      </div>

      <Input
        placeholder="Search by reference, user ID, or order ID…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Card>
        <CardHeader>
          <CardTitle>All payments</CardTitle>
        </CardHeader>
        <CardContent>
          {!payments && (
            <p className="text-sm text-muted-foreground">Loading payments…</p>
          )}

          {payments && filteredPayments.length === 0 && (
            <p className="text-sm text-muted-foreground">No payments found.</p>
          )}

          {payments && filteredPayments.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell className="font-medium">
                      {payment.reference}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusStyles[payment.status]}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {payment.currency} {payment.amount.toLocaleString()}
                    </TableCell>

                    <TableCell className="max-w-[240px] truncate">
                      {payment.userId}
                    </TableCell>

                    <TableCell>
                      {payment.paymentMethod ? (
                        <Badge
                          variant="outline"
                          className={getMethodStyle(payment.paymentMethod)}
                        >
                          {payment.paymentMethod}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      {payment.createdAt
                        ? new Date(payment.createdAt).toLocaleString()
                        : "—"}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelected(payment);
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
        onOpenChange={(o) => {
          setViewOpen(o);
          if (!o) setSelected(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment details</DialogTitle>
          </DialogHeader>

          {!selected ? (
            <p className="text-sm text-muted-foreground">
              No payment selected.
            </p>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Reference</p>
                  <p className="font-medium break-all">
                    {selected.reference}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge
                    variant="outline"
                    className={statusStyles[selected.status]}
                  >
                    {selected.status}
                  </Badge>
                </div>

                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p className="font-medium">
                    {selected.currency}{" "}
                    {selected.amount.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Payment Method</p>
                  {selected.paymentMethod ? (
                    <Badge
                      variant="outline"
                      className={getMethodStyle(selected.paymentMethod)}
                    >
                      {selected.paymentMethod}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </div>

                <div>
                  <p className="text-muted-foreground">User ID</p>
                  <p className="font-medium break-all">
                    {selected.userId}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Order ID</p>
                  <p className="font-medium break-all">
                    {selected.orderId}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground mb-2">Metadata</p>
                <pre className="max-h-[320px] overflow-auto rounded-md border bg-muted/30 p-3 text-xs">
                  {selected.metadata
                    ? JSON.stringify(selected.metadata, null, 2)
                    : "—"}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsPage;