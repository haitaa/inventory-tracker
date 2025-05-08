"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getCustomerCommunicationLogs,
  addCustomerCommunicationLog,
} from "@/app/lib/customerService";
import { CommunicationLogEntry } from "@/types/schema";
import {
  Phone,
  Mail,
  MessageSquare,
  Users,
  Clock,
  Plus,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "react-hot-toast";

interface CommunicationLogProps {
  customerId: string;
}

const CommunicationLog = ({ customerId }: CommunicationLogProps) => {
  const [logs, setLogs] = useState<CommunicationLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLog, setNewLog] = useState({
    type: "EMAIL",
    subject: "",
    content: "",
    userId: "",
  });

  useEffect(() => {
    fetchLogs();
  }, [customerId]);

  const fetchLogs = async () => {
    if (!customerId) return;

    setLoading(true);
    try {
      const logData = await getCustomerCommunicationLogs(customerId);
      setLogs(logData);
    } catch (error) {
      console.error("İletişim kayıtları yüklenirken hata:", error);
      toast.error("İletişim kayıtları yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async () => {
    if (!newLog.subject || !newLog.content) {
      toast.error("Konu ve içerik alanları doldurulmalıdır");
      return;
    }

    try {
      const communicationEntry: Omit<CommunicationLogEntry, "id" | "date"> = {
        type: newLog.type as "EMAIL" | "SMS" | "PHONE" | "MEETING" | "OTHER",
        subject: newLog.subject,
        content: newLog.content,
        userId: localStorage.getItem("userId") || "unknown",
      };

      await addCustomerCommunicationLog(customerId, communicationEntry);

      // Formu sıfırla ve dialogu kapat
      setNewLog({
        type: "EMAIL",
        subject: "",
        content: "",
        userId: "",
      });
      setIsDialogOpen(false);

      // Kayıtları yenile
      fetchLogs();
      toast.success("İletişim kaydı başarıyla eklendi");
    } catch (error) {
      console.error("İletişim kaydı eklenirken hata:", error);
      toast.error("İletişim kaydı eklenemedi");
    }
  };

  // İletişim türüne göre ikon seç
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "EMAIL":
        return <Mail className="h-4 w-4 text-blue-500" />;
      case "SMS":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case "PHONE":
        return <Phone className="h-4 w-4 text-amber-500" />;
      case "MEETING":
        return <Users className="h-4 w-4 text-indigo-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  // İletişim türü için Türkçe karşılık
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      EMAIL: "E-posta",
      SMS: "SMS",
      PHONE: "Telefon",
      MEETING: "Toplantı",
      OTHER: "Diğer",
    };
    return labels[type] || type;
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold">
              İletişim Geçmişi
            </CardTitle>
            <CardDescription className="mt-1">
              Müşteri ile yapılan tüm görüşmeler ve yazışmalar
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              disabled={loading}
              className="h-8 px-2 text-xs"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 mr-1 ${loading ? "animate-spin" : ""}`}
              />
              Yenile
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 px-2 text-xs bg-gradient-to-r from-indigo-600 to-blue-500"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Yeni Kayıt
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni İletişim Kaydı</DialogTitle>
                  <DialogDescription>
                    Müşteri ile yaptığınız görüşme veya yazışma bilgilerini
                    ekleyin
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="type" className="text-sm font-medium">
                      İletişim Türü
                    </label>
                    <Select
                      value={newLog.type}
                      onValueChange={(value) =>
                        setNewLog({
                          ...newLog,
                          type: value as
                            | "EMAIL"
                            | "SMS"
                            | "PHONE"
                            | "MEETING"
                            | "OTHER",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="İletişim türü seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMAIL">E-posta</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                        <SelectItem value="PHONE">Telefon</SelectItem>
                        <SelectItem value="MEETING">Toplantı</SelectItem>
                        <SelectItem value="OTHER">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Konu
                    </label>
                    <Input
                      id="subject"
                      value={newLog.subject}
                      onChange={(e) =>
                        setNewLog({ ...newLog, subject: e.target.value })
                      }
                      placeholder="İletişim konusu"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="content" className="text-sm font-medium">
                      İçerik
                    </label>
                    <Textarea
                      id="content"
                      value={newLog.content}
                      onChange={(e) =>
                        setNewLog({ ...newLog, content: e.target.value })
                      }
                      placeholder="Görüşme detayları"
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    İptal
                  </Button>
                  <Button onClick={handleAddLog}>Kaydet</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : logs.length > 0 ? (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {getTypeIcon(log.type)}
                    </div>
                    <div>
                      <h3 className="font-medium">{log.subject}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        {getTypeIcon(log.type)}
                        <span>{getTypeLabel(log.type)}</span>
                        <span className="mx-1">•</span>
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(new Date(log.date), "d MMMM yyyy HH:mm", {
                            locale: tr,
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {log.user?.username || "Kullanıcı bilgisi yok"}
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {log.content}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500">
              İletişim kaydı bulunmuyor
            </h3>
            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
              Bu müşteri ile yapılan görüşme veya yazışma kayıtları burada
              görüntülenecektir. Yeni kayıt eklemek için "Yeni Kayıt" butonunu
              kullanabilirsiniz.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunicationLog;
