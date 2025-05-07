"use client";
import { BiExport } from "react-icons/bi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import api from "@/app/lib/api";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

// Helper to trigger download
function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export function DropdownExport() {
  const exportCsv = async () => {
    try {
      const res = await api.get("/files/export-csv", { responseType: "blob" });
      downloadBlob(res.data, "products.csv");
      toast.success("CSV başarıyla indirildi.");
    } catch (error) {
      console.error(error);
      toast.error("CSV indirme sırasında bir hata oluştu.");
    }
  };
  const exportExcel = async () => {
    try {
      const res = await api.get("/files/export-excel", {
        responseType: "blob",
      });
      downloadBlob(res.data, "products.xlsx");
      toast.success("Excel dosyası başarıyla indirildi.");
    } catch (error) {
      console.error(error);
      toast.error("Excel indirme sırasında bir hata oluştu.");
    }
  };
  const exportJson = async () => {
    try {
      const res = await api.get("/files/export-json", { responseType: "blob" });
      downloadBlob(res.data, "products.json");
      toast.success("JSON başarıyla indirildi.");
    } catch (error) {
      console.error(error);
      toast.error("JSON indirme sırasında bir hata oluştu.");
    }
  };
  const exportXml = async () => {
    try {
      const res = await api.get("/files/export-xml", { responseType: "blob" });
      downloadBlob(res.data, "products.xml");
      toast.success("XML başarıyla indirildi.");
    } catch (error) {
      console.error(error);
      toast.error("XML indirme sırasında bir hata oluştu.");
    }
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"}>
            <BiExport /> Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Export Products</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={exportCsv}>
              <Image
                src={"/logo/csv.png"}
                alt={"CSV Logo"}
                width={22}
                height={22}
              />
              CSV
              <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportExcel}>
              <Image
                src={"/logo/excel.png"}
                alt={"Excel Logo"}
                width={22}
                height={22}
              />
              Excel
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportJson}>
              <Image
                src={"/logo/folder.png"}
                alt={"JSON Logo"}
                width={22}
                height={22}
              />
              JSON
              <DropdownMenuShortcut>⌘J</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportXml}>
              <Image
                src={"/logo/xml.png"}
                alt={"XML Logo"}
                width={22}
                height={22}
              />
              XML
              <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
