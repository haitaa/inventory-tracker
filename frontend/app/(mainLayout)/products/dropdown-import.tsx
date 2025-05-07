"use client";
import { Cloud, LifeBuoy, PlusCircle, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BiImport } from "react-icons/bi";
import Image from "next/image";
import { useRef, useState } from "react";
import api from "@/app/lib/api";
import toast, { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function DropdownImport() {
  const [excelDialog, setExcelDialog] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [csvDialog, setCsvDialog] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [jsonDialog, setJsonDialog] = useState(false);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [xmlDialog, setXmlDialog] = useState(false);
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [sheetsDialog, setSheetsDialog] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");
  const [importing, setImporting] = useState(false);

  const importFile = async (endpoint: string, payload: FormData | object) => {
    setImporting(true);
    try {
      let response;
      if (payload instanceof FormData) {
        response = await api.post(endpoint, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await api.post(endpoint, payload);
      }
      toast.success(`Başarıyla ${response.data.imported} ürün aktarıldı.`);
    } catch (error) {
      console.error(error);
      toast.error("İçe aktarma sırasında bir hata oluştu.");
    } finally {
      setImporting(false);
    }
  };

  const handleSheetsSubmit = async () => {
    setSheetsDialog(false);
    setImporting(true);
    try {
      const response = await api.post("/files/import-sheets", { sheetUrl });
      toast.success(`Başarıyla ${response.data.imported} ürün aktarıldı.`);
    } catch (error) {
      console.error(error);
      toast.error("Google Sheets yükleme sırasında bir hata oluştu.");
    } finally {
      setImporting(false);
      setSheetUrl("");
    }
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <BiImport />
            Import
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Import Products </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setCsvDialog(true)}
              disabled={importing}
            >
              <Image
                src={"/logo/csv.png"}
                alt={"CSV Logo"}
                width={22}
                height={22}
              />
              <span>CSV</span>
              <DropdownMenuShortcut>⇧⌘C</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setExcelDialog(true)}
              disabled={importing}
            >
              <Image
                src={"/logo/excel.png"}
                alt={"Excel Logo"}
                width={22}
                height={22}
              />
              <span>Excel</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setSheetsDialog(true)}
              disabled={importing}
            >
              <Image
                src={"/logo/sheets.png"}
                alt={"Sheet Logo"}
                width={22}
                height={22}
              />
              <span>Google Sheets</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Image
                  src={"/logo/data-quality.png"}
                  alt={"Css Logo"}
                  width={22}
                  height={22}
                />
                <span className={"pl-2"}>Data Feeds</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => setJsonDialog(true)}
                    disabled={importing}
                  >
                    <Image
                      src={"/logo/folder.png"}
                      alt={"JSON Logo"}
                      width={22}
                      height={22}
                    />
                    <span>JSON</span>
                    <DropdownMenuShortcut>⌘J</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setXmlDialog(true)}
                    disabled={importing}
                  >
                    <Image
                      src={"/logo/xml.png"}
                      alt={"XML Logo"}
                      width={22}
                      height={22}
                    />
                    <span>XML</span>
                    <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <PlusCircle />
                    <span>More...</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Image
                src={"/logo/shopify.png"}
                alt={"Shopify Logo"}
                width={22}
                height={22}
              />
              <span>Shopify</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Image
                src={"/logo/social.png"}
                alt={"Amazon Logo"}
                width={22}
                height={22}
              />
              <span>Amazon</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Image
                src={"/logo/etsy.png"}
                alt={"Etsy Logo"}
                width={22}
                height={22}
              />
              <span>Etsy</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <LifeBuoy />
            <span>Support</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Cloud />
            <span>API</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={excelDialog} onOpenChange={setExcelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excel İçe Aktar</DialogTitle>
            <DialogDescription>.xlsx veya .xls dosyası seçin</DialogDescription>
          </DialogHeader>
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setExcelFile(e.target.files?.[0] ?? null)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setExcelDialog(false)}>
              İptal
            </Button>
            <Button
              onClick={() => {
                if (!excelFile) return;
                const fd = new FormData();
                fd.append("file", excelFile);
                importFile("/files/import", fd);
                setExcelDialog(false);
                setExcelFile(null);
              }}
              disabled={!excelFile || importing}
            >
              {importing ? "Yükleniyor..." : "İçe Aktar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={csvDialog} onOpenChange={setCsvDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CSV İçe Aktar</DialogTitle>
            <DialogDescription>CSV dosyası seçin</DialogDescription>
          </DialogHeader>
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCsvDialog(false)}>
              İptal
            </Button>
            <Button
              onClick={() => {
                if (!csvFile) return;
                const fd = new FormData();
                fd.append("file", csvFile);
                importFile("/files/import-csv", fd);
                setCsvDialog(false);
                setCsvFile(null);
              }}
              disabled={!csvFile || importing}
            >
              {importing ? "Yükleniyor..." : "İçe Aktar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={jsonDialog} onOpenChange={setJsonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>JSON İçe Aktar</DialogTitle>
            <DialogDescription>JSON dosyası seçin</DialogDescription>
          </DialogHeader>
          <Input
            type="file"
            accept=".json"
            onChange={(e) => setJsonFile(e.target.files?.[0] ?? null)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setJsonDialog(false)}>
              İptal
            </Button>
            <Button
              onClick={() => {
                if (!jsonFile) return;
                const fd = new FormData();
                fd.append("file", jsonFile);
                importFile("/files/import-json", fd);
                setJsonDialog(false);
                setJsonFile(null);
              }}
              disabled={!jsonFile || importing}
            >
              {importing ? "Yükleniyor..." : "İçe Aktar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={xmlDialog} onOpenChange={setXmlDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>XML İçe Aktar</DialogTitle>
            <DialogDescription>XML dosyası seçin</DialogDescription>
          </DialogHeader>
          <Input
            type="file"
            accept=".xml"
            onChange={(e) => setXmlFile(e.target.files?.[0] ?? null)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setXmlDialog(false)}>
              İptal
            </Button>
            <Button
              onClick={() => {
                if (!xmlFile) return;
                const fd = new FormData();
                fd.append("file", xmlFile);
                importFile("/files/import-xml", fd);
                setXmlDialog(false);
                setXmlFile(null);
              }}
              disabled={!xmlFile || importing}
            >
              {importing ? "Yükleniyor..." : "İçe Aktar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={sheetsDialog} onOpenChange={setSheetsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Google Sheets İçe Aktar</DialogTitle>
            <DialogDescription>
              CSV formatında export edilmiş Google Sheets URL girin
            </DialogDescription>
          </DialogHeader>
          <Input
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            placeholder="Sheet URL"
            className="mb-4"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSheetsDialog(false)}>
              İptal
            </Button>
            <Button onClick={handleSheetsSubmit} disabled={importing}>
              İçe Aktar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
