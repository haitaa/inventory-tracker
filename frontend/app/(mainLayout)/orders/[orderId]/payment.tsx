"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";

import PaymentForm from "@/components/payment/PaymentForm";
import { OrderType, OrderStatusEnum } from "@/types/schema";
import { PaymentResponse } from "@/app/lib/paymentService";
import { updateOrderStatus } from "@/app/lib/orderService";

interface PaymentComponentProps {
  order: OrderType;
  onPaymentComplete?: () => void;
}

export const PaymentComponent = ({
  order,
  onPaymentComplete,
}: PaymentComponentProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sipariş zaten ödenmişse ödeme butonu gösterme
  const isPaid =
    order.status === OrderStatusEnum.PAID ||
    order.status === OrderStatusEnum.SHIPPED ||
    order.status === OrderStatusEnum.DELIVERED;

  const handlePaymentSuccess = async (response: PaymentResponse) => {
    try {
      setLoading(true);
      // Eğer ödeme tamamlandıysa sipariş durumunu güncelle
      if (response.status === "completed") {
        await updateOrderStatus(order.id, OrderStatusEnum.PAID);
        toast.success("Ödeme başarılı. Sipariş durumu güncellendi.");

        // Sipariş sayfasını yenile
        if (onPaymentComplete) {
          onPaymentComplete();
        }

        router.refresh();
      } else if (response.status === "pending") {
        toast.success("Ödeme işlemi başlatıldı. Ödeme durumu bekleniyor.");
      }

      setIsOpen(false);
    } catch (error: any) {
      toast.error(
        "Sipariş durumu güncellenirken hata oluştu: " + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  if (isPaid) {
    return (
      <div className="flex items-center gap-2 p-4 bg-green-50 rounded-md border border-green-200">
        <CreditCard className="text-green-500" />
        <div>
          <p className="font-medium text-green-700">Ödeme Tamamlandı</p>
          <p className="text-sm text-green-600">
            Bu sipariş için ödeme işlemi tamamlanmıştır.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-amber-50 rounded-md border border-amber-200">
        <div className="flex items-center gap-2">
          <CreditCard className="text-amber-500" />
          <div>
            <p className="font-medium text-amber-700">Ödeme Bekleniyor</p>
            <p className="text-sm text-amber-600">
              Bu sipariş için henüz ödeme yapılmamıştır.
            </p>
          </div>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Ödeme Yap</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Sipariş Ödemesi</DialogTitle>
              <DialogDescription>
                Sipariş #{order.orderNumber} için ödeme yapın.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <PaymentForm
                orderId={order.id}
                amount={Number(order.totalAmount)}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setIsOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PaymentComponent;
