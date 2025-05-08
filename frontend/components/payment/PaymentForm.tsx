"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  CreditCard,
  Building,
  Globe,
  Settings,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  PaymentMethod,
  CreditCardInfo,
  BankTransferInfo,
  PaymentResponse,
  getPaymentMethods,
  processCreditCardPayment,
  processBankTransfer,
  processOnlinePayment,
  processPosPayment,
} from "@/app/lib/paymentService";

interface PaymentFormProps {
  orderId: string;
  amount: number;
  onSuccess?: (response: PaymentResponse) => void;
  onCancel?: () => void;
}

export default function PaymentForm({
  orderId,
  amount,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [activeTab, setActiveTab] = useState("credit-card");

  // Kredi kartı bilgileri
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");

  // Banka transferi bilgileri
  const [selectedBank, setSelectedBank] = useState("");
  const [transferReference, setTransferReference] = useState("");

  // Online ödeme bilgileri
  const [selectedOnlineMethod, setSelectedOnlineMethod] = useState("");

  // POS bilgileri
  const [selectedPos, setSelectedPos] = useState("");

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const methods = await getPaymentMethods();
      setPaymentMethods(methods);

      // Varsayılan yöntemleri ayarla
      if (methods.length > 0) {
        const creditCards = methods.filter((m) => m.type === "credit_card");
        const banks = methods.filter((m) => m.type === "bank_transfer");
        const onlineMethods = methods.filter(
          (m) => m.type === "online_payment"
        );
        const posDevices = methods.filter((m) => m.type === "pos");

        if (creditCards.length > 0) setActiveTab("credit-card");
        else if (onlineMethods.length > 0) setActiveTab("online-payment");
        else if (banks.length > 0) setActiveTab("bank-transfer");
        else if (posDevices.length > 0) setActiveTab("pos");
      }
    } catch (error: any) {
      setError(error.message || "Ödeme yöntemleri yüklenemedi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreditCardPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Basit doğrulama
      if (
        !cardNumber ||
        !cardHolderName ||
        !expiryMonth ||
        !expiryYear ||
        !cvv
      ) {
        setError("Lütfen tüm kredi kartı bilgilerini doldurun");
        return;
      }

      const creditCardInfo: CreditCardInfo = {
        cardNumber,
        cardHolderName,
        expiryMonth,
        expiryYear,
        cvv,
      };

      const response = await processCreditCardPayment(
        orderId,
        amount,
        creditCardInfo
      );

      toast.success("Ödeme başarıyla tamamlandı");
      if (onSuccess) onSuccess(response);
    } catch (error: any) {
      setError(error.message || "Ödeme işlemi sırasında bir hata oluştu");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBankTransfer = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedBank) {
        setError("Lütfen bir banka seçin");
        return;
      }

      const bankMethod = paymentMethods.find((m) => m.id === selectedBank);
      if (!bankMethod) {
        setError("Seçilen banka bulunamadı");
        return;
      }

      const bankInfo: BankTransferInfo = {
        bankName: bankMethod.name,
        accountName: bankMethod.config?.accountName || "",
        iban: bankMethod.config?.iban || "",
        referenceCode: transferReference,
      };

      const response = await processBankTransfer(orderId, amount, bankInfo);

      toast.success("Havale bilgileri kaydedildi");
      if (onSuccess) onSuccess(response);
    } catch (error: any) {
      setError(error.message || "Havale işlemi sırasında bir hata oluştu");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedOnlineMethod) {
        setError("Lütfen bir online ödeme yöntemi seçin");
        return;
      }

      const returnUrl = `${window.location.origin}/orders/${orderId}`;
      const response = await processOnlinePayment(
        orderId,
        amount,
        selectedOnlineMethod,
        returnUrl
      );

      // Eğer dış ödeme sayfasına yönlendirme varsa
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
        return;
      }

      toast.success("Online ödeme başarıyla tamamlandı");
      if (onSuccess) onSuccess(response);
    } catch (error: any) {
      setError(error.message || "Online ödeme sırasında bir hata oluştu");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePosPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedPos) {
        setError("Lütfen bir POS cihazı seçin");
        return;
      }

      const response = await processPosPayment(orderId, amount, selectedPos);

      toast.success("POS ödeme talebi oluşturuldu");
      if (onSuccess) onSuccess(response);
    } catch (error: any) {
      setError(error.message || "POS işlemi sırasında bir hata oluştu");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Kredi kartını formatlı gösterme (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Kart son kullanma tarihini doğru formatlama (MM/YY)
  const handleExpiryDate = (value: string) => {
    // Sadece rakamları al
    const cleanValue = value.replace(/\D/g, "");

    if (cleanValue.length <= 2) {
      setExpiryMonth(cleanValue);
    } else {
      setExpiryMonth(cleanValue.substr(0, 2));
      setExpiryYear(cleanValue.substr(2, 2));
    }
  };

  const creditCardMethods = paymentMethods.filter(
    (method) => method.type === "credit_card" && method.isActive
  );
  const bankTransferMethods = paymentMethods.filter(
    (method) => method.type === "bank_transfer" && method.isActive
  );
  const onlinePaymentMethods = paymentMethods.filter(
    (method) => method.type === "online_payment" && method.isActive
  );
  const posMethods = paymentMethods.filter(
    (method) => method.type === "pos" && method.isActive
  );

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Ödeme İşlemi</CardTitle>
        <CardDescription>
          Sipariş tutarı: <strong>{formatPrice(amount)}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Hata</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger
              value="credit-card"
              disabled={creditCardMethods.length === 0}
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Kredi Kartı</span>
            </TabsTrigger>
            <TabsTrigger
              value="bank-transfer"
              disabled={bankTransferMethods.length === 0}
              className="flex items-center gap-2"
            >
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Havale</span>
            </TabsTrigger>
            <TabsTrigger
              value="online-payment"
              disabled={onlinePaymentMethods.length === 0}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Online</span>
            </TabsTrigger>
            <TabsTrigger
              value="pos"
              disabled={posMethods.length === 0}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">POS</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="credit-card">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cardNumber">Kart Numarası</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formatCardNumber(cardNumber)}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={19}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cardHolderName">Kart Üzerindeki İsim</Label>
                  <Input
                    id="cardHolderName"
                    placeholder="Ad Soyad"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expiryMonth">Son Kullanma (Ay)</Label>
                    <Input
                      id="expiryMonth"
                      placeholder="MM"
                      value={expiryMonth}
                      onChange={(e) => setExpiryMonth(e.target.value)}
                      maxLength={2}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expiryYear">Son Kullanma (Yıl)</Label>
                    <Input
                      id="expiryYear"
                      placeholder="YY"
                      value={expiryYear}
                      onChange={(e) => setExpiryYear(e.target.value)}
                      maxLength={2}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleCreditCardPayment}
                disabled={loading}
              >
                {loading ? "İşleniyor..." : "Kredi Kartı ile Öde"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="bank-transfer">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bank">Banka Seçin</Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger id="bank">
                      <SelectValue placeholder="Banka seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankTransferMethods.map((bank) => (
                        <SelectItem key={bank.id} value={bank.id}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedBank && (
                  <div className="grid gap-2 p-4 border rounded-md bg-gray-50">
                    <p className="text-sm font-medium">Havale Bilgileri</p>
                    <p className="text-sm">
                      <strong>Alıcı:</strong>{" "}
                      {
                        bankTransferMethods.find((b) => b.id === selectedBank)
                          ?.config?.accountName
                      }
                    </p>
                    <p className="text-sm">
                      <strong>IBAN:</strong>{" "}
                      {
                        bankTransferMethods.find((b) => b.id === selectedBank)
                          ?.config?.iban
                      }
                    </p>
                    <p className="text-sm">
                      <strong>Tutar:</strong> {formatPrice(amount)}
                    </p>
                    <div className="grid gap-2 mt-2">
                      <Label htmlFor="reference">Havale Referans Kodu</Label>
                      <Input
                        id="reference"
                        placeholder="Havale yaparken kullanacağınız referans kodu"
                        value={transferReference}
                        onChange={(e) => setTransferReference(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
              <Button
                className="w-full"
                onClick={handleBankTransfer}
                disabled={loading || !selectedBank}
              >
                {loading ? "İşleniyor..." : "Havale Bilgilerini Kaydet"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="online-payment">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="onlineMethod">Ödeme Yöntemi Seçin</Label>
                  <Select
                    value={selectedOnlineMethod}
                    onValueChange={setSelectedOnlineMethod}
                  >
                    <SelectTrigger id="onlineMethod">
                      <SelectValue placeholder="Ödeme yöntemi seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {onlinePaymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedOnlineMethod && (
                  <div className="grid gap-2 p-4 border rounded-md bg-gray-50">
                    <p className="text-sm">
                      <CheckCircle2 className="h-4 w-4 inline mr-2" />
                      Seçilen ödeme yöntemi:{" "}
                      <strong>
                        {
                          onlinePaymentMethods.find(
                            (m) => m.id === selectedOnlineMethod
                          )?.name
                        }
                      </strong>
                    </p>
                    <p className="text-sm">
                      Ödemeyi tamamlamak için ilgili ödeme sağlayıcısının
                      sayfasına yönlendirileceksiniz.
                    </p>
                  </div>
                )}
              </div>
              <Button
                className="w-full"
                onClick={handleOnlinePayment}
                disabled={loading || !selectedOnlineMethod}
              >
                {loading ? "İşleniyor..." : "Online Ödeme Yap"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="pos">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="posDevice">POS Cihazı Seçin</Label>
                  <Select value={selectedPos} onValueChange={setSelectedPos}>
                    <SelectTrigger id="posDevice">
                      <SelectValue placeholder="POS cihazı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {posMethods.map((pos) => (
                        <SelectItem key={pos.id} value={pos.id}>
                          {pos.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedPos && (
                  <div className="grid gap-2 p-4 border rounded-md bg-gray-50">
                    <p className="text-sm">
                      <CheckCircle2 className="h-4 w-4 inline mr-2" />
                      Seçilen POS cihazı:{" "}
                      <strong>
                        {posMethods.find((p) => p.id === selectedPos)?.name}
                      </strong>
                    </p>
                    <p className="text-sm">
                      POS cihazında ödeme işlemini başlatmak için lütfen "POS
                      ile Öde" butonuna tıklayın. İşlem tamamlandığında sipariş
                      durumunuz güncellenecektir.
                    </p>
                  </div>
                )}
              </div>
              <Button
                className="w-full"
                onClick={handlePosPayment}
                disabled={loading || !selectedPos}
              >
                {loading ? "İşleniyor..." : "POS ile Öde"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          İptal
        </Button>
      </CardFooter>
    </Card>
  );
}
