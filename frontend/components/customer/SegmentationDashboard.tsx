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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCustomers } from "@/app/lib/customerService";
import { getSegmentDistribution, segmentCustomers } from "@/app/lib/crmService";
import { CustomerSegmentEnum, CustomerType } from "@/types/schema";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Users,
  UserCheck,
  Star,
  UserMinus,
  UserPlus,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Segment renkleri
const SEGMENT_COLORS: Record<CustomerSegmentEnum, string> = {
  [CustomerSegmentEnum.VIP]: "#8884d8",
  [CustomerSegmentEnum.PREMIUM]: "#82ca9d",
  [CustomerSegmentEnum.REGULAR]: "#8dd1e1",
  [CustomerSegmentEnum.NEW]: "#a4de6c",
  [CustomerSegmentEnum.INACTIVE]: "#d0d0d0",
  [CustomerSegmentEnum.AT_RISK]: "#ffc658",
};

// Segment ikonları
const SegmentIcon = ({ segment }: { segment: CustomerSegmentEnum }) => {
  switch (segment) {
    case CustomerSegmentEnum.VIP:
      return <Star className="h-6 w-6 text-purple-500" />;
    case CustomerSegmentEnum.PREMIUM:
      return <UserCheck className="h-6 w-6 text-green-500" />;
    case CustomerSegmentEnum.REGULAR:
      return <Users className="h-6 w-6 text-blue-500" />;
    case CustomerSegmentEnum.NEW:
      return <UserPlus className="h-6 w-6 text-lime-500" />;
    case CustomerSegmentEnum.INACTIVE:
      return <UserMinus className="h-6 w-6 text-gray-500" />;
    case CustomerSegmentEnum.AT_RISK:
      return <AlertTriangle className="h-6 w-6 text-amber-500" />;
    default:
      return <Users className="h-6 w-6" />;
  }
};

// Segment Türkçe açıklamaları
const segmentLabels: Record<CustomerSegmentEnum, string> = {
  [CustomerSegmentEnum.VIP]: "VIP Müşteriler",
  [CustomerSegmentEnum.PREMIUM]: "Premium Müşteriler",
  [CustomerSegmentEnum.REGULAR]: "Standart Müşteriler",
  [CustomerSegmentEnum.NEW]: "Yeni Müşteriler",
  [CustomerSegmentEnum.INACTIVE]: "Pasif Müşteriler",
  [CustomerSegmentEnum.AT_RISK]: "Risk Altındaki Müşteriler",
};

// Segment açıklamaları
const segmentDescriptions: Record<CustomerSegmentEnum, string> = {
  [CustomerSegmentEnum.VIP]:
    "En değerli, sık alışveriş yapan ve yüksek harcama yapan müşteriler",
  [CustomerSegmentEnum.PREMIUM]:
    "Yüksek değerli, düzenli alışveriş yapan müşteriler",
  [CustomerSegmentEnum.REGULAR]:
    "Normal sıklıkta alışveriş yapan standart müşteriler",
  [CustomerSegmentEnum.NEW]: "Son dönemde kazanılan yeni müşteriler",
  [CustomerSegmentEnum.INACTIVE]:
    "Uzun süredir alışveriş yapmayan pasif müşteriler",
  [CustomerSegmentEnum.AT_RISK]:
    "Yakın zamanda kaybetme riski olan değerli müşteriler",
};

const SegmentationDashboard = () => {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [segmentData, setSegmentData] = useState<
    { name: string; value: number; segment: CustomerSegmentEnum }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [segmenting, setSegmenting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("chart");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
      updateSegmentData(data);
    } catch (error) {
      console.error("Müşteriler yüklenirken hata:", error);
      toast.error("Müşteri verisi yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const updateSegmentData = (customerData: CustomerType[]) => {
    const distribution = getSegmentDistribution(customerData);
    const chartData = Object.entries(distribution).map(([segment, count]) => ({
      name: segmentLabels[segment as CustomerSegmentEnum],
      value: count,
      segment: segment as CustomerSegmentEnum,
    }));
    setSegmentData(chartData);
  };

  const handleSegmentAll = async () => {
    if (!customers.length) {
      toast.error("Segmentasyon için müşteri bulunamadı");
      return;
    }

    setSegmenting(true);
    try {
      toast.loading("Müşteriler segmentleniyor...");
      const segmented = await segmentCustomers(customers);
      setCustomers(segmented);
      updateSegmentData(segmented);
      toast.dismiss();
      toast.success("Müşteri segmentasyonu tamamlandı");
    } catch (error) {
      console.error("Segmentasyon hatası:", error);
      toast.dismiss();
      toast.error("Segmentasyon sırasında hata oluştu");
    } finally {
      setSegmenting(false);
    }
  };

  const totalCustomers = customers.length;
  const renderCustomActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
    } = props;

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={-18}
          textAnchor="middle"
          fill="#333"
          className="text-lg font-medium"
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill="#666"
          className="text-sm"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <text
          x={cx}
          y={cy}
          dy={30}
          textAnchor="middle"
          fill="#666"
          className="text-sm"
        >
          ({payload.value} müşteri)
        </text>
      </g>
    );
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold">
              Müşteri Segmentasyonu
            </CardTitle>
            <CardDescription className="mt-1">
              RFM (Recency, Frequency, Monetary) analizine dayalı müşteri
              segmentleri
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCustomers}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Yenile
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSegmentAll}
              disabled={segmenting || !customers.length}
              className="gap-2 bg-gradient-to-r from-indigo-600 to-blue-500"
            >
              {segmenting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              {segmenting ? "Segmentleniyor..." : "Segmentasyonu Güncelle"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full max-w-md mx-auto">
            <TabsTrigger value="chart" className="flex-1 gap-2">
              <PieChartIcon className="h-4 w-4" />
              Pasta Grafik
            </TabsTrigger>
            <TabsTrigger value="segments" className="flex-1 gap-2">
              <BarChart3 className="h-4 w-4" />
              Detaylı Görünüm
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="pt-2">
            {segmentData.length > 0 ? (
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      activeIndex={0}
                      activeShape={renderCustomActiveShape}
                      data={segmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={95}
                      outerRadius={130}
                      fill="#8884d8"
                      paddingAngle={1}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={{
                        stroke: "#666",
                        strokeWidth: 0.5,
                        strokeDasharray: "5 5",
                      }}
                    >
                      {segmentData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            SEGMENT_COLORS[entry.segment as CustomerSegmentEnum]
                          }
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <Users className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-500">
                  Henüz segmentasyon verisi bulunmuyor
                </p>
                <p className="text-sm text-gray-400 mt-2 max-w-md">
                  Müşterileri segmentlere ayırmak için "Segmentasyonu Güncelle"
                  butonuna tıklayın
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="segments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(CustomerSegmentEnum).map((segment) => {
                const segmentCount =
                  segmentData.find((d) => d.segment === segment)?.value || 0;
                const percentage =
                  totalCustomers > 0
                    ? ((segmentCount / totalCustomers) * 100).toFixed(1)
                    : "0.0";

                return (
                  <Card
                    key={segment}
                    className="border border-gray-200 overflow-hidden"
                  >
                    <CardHeader className="pb-2 flex flex-row items-center">
                      <div className="mr-3">
                        <SegmentIcon segment={segment} />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">
                          {segmentLabels[segment]}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {segmentCount} müşteri ({percentage}%)
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {segmentDescriptions[segment]}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SegmentationDashboard;
