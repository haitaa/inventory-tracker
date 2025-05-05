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

export function DropdownImport() {
  return (
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
          <DropdownMenuItem>
            <Image
              src={"/logo/csv.png"}
              alt={"CSV Logo"}
              width={22}
              height={22}
            />
            <span>CSV</span>
            <DropdownMenuShortcut>⇧⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Image
              src={"/logo/excel.png"}
              alt={"Excel Logo"}
              width={22}
              height={22}
            />
            <span>Excel</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem>
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
                <DropdownMenuItem>
                  <Image
                    src={"/logo/folder.png"}
                    alt={"JSON Logo"}
                    width={22}
                    height={22}
                  />
                  <span>JSON</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Image
                    src={"/logo/xml.png"}
                    alt={"XML Logo"}
                    width={22}
                    height={22}
                  />
                  <span>XML</span>
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
  );
}
