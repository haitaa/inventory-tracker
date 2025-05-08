"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  VisibilityState,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Ürün kategorilerini veri kümesinden ayıklayalım
  const categories = React.useMemo(() => {
    const allCategories = data
      .map((item: any) => item.category)
      .filter(Boolean);
    return [...new Set(allCategories)] as string[];
  }, [data]);

  // Fiyat aralığı için min/max değerler
  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    0, 1000,
  ]);
  const [stockRange, setStockRange] = React.useState<[number, number]>([
    0, 100,
  ]);

  const minMaxPrice = React.useMemo(() => {
    const prices = data.map((item: any) => parseFloat(item.price || 0));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [data]);

  const minMaxStock = React.useMemo(() => {
    const stocks = data.map((item: any) => parseInt(item.stock || 0));
    return {
      min: Math.min(...stocks),
      max: Math.max(...stocks),
    };
  }, [data]);

  // Filtre listesi
  const [activeFilters, setActiveFilters] = React.useState<{
    category?: string;
    priceMin?: number;
    priceMax?: number;
    stockMin?: number;
    stockMax?: number;
    inStock?: boolean;
  }>({});

  // Aktif filtre sayısı
  const activeFilterCount = Object.keys(activeFilters).length;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, id, filterValue) => {
      const safeValue = String(row.getValue(id) ?? "").toLowerCase();
      return safeValue.includes(String(filterValue).toLowerCase());
    },
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  // Filtre uygulama fonksiyonu
  const applyFilters = () => {
    // Kategori filtresi
    /* Kategori kolonu olmadığı için yorum satırına aldım
    if (activeFilters.category) {
      table.getColumn("category")?.setFilterValue(activeFilters.category);
    } else {
      table.getColumn("category")?.setFilterValue(undefined);
    }
    */

    // Fiyat filtresi
    if (
      activeFilters.priceMin !== undefined ||
      activeFilters.priceMax !== undefined
    ) {
      table
        .getColumn("price")
        ?.setFilterValue([
          activeFilters.priceMin || minMaxPrice.min,
          activeFilters.priceMax || minMaxPrice.max,
        ]);
    } else {
      table.getColumn("price")?.setFilterValue(undefined);
    }

    // Stok filtresi
    /* Stock kolonu olmadığı için yorum satırına aldım
    if (
      activeFilters.stockMin !== undefined ||
      activeFilters.stockMax !== undefined ||
      activeFilters.inStock !== undefined
    ) {
      table.getColumn("stock")?.setFilterValue({
        min: activeFilters.stockMin || 0,
        max: activeFilters.stockMax || Infinity,
        inStock: activeFilters.inStock,
      });
    } else {
      table.getColumn("stock")?.setFilterValue(undefined);
    }
    */
  };

  // Filtreleri temizleme
  const clearFilters = () => {
    setActiveFilters({});
    table.resetColumnFilters();
  };

  // Filtreler değiştiğinde uygula
  React.useEffect(() => {
    applyFilters();
  }, [activeFilters]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row items-center px-4 py-3 border-b bg-gray-50 gap-3">
        <div className="relative w-full md:w-auto flex-1 max-w-md">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Ürün ara..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-8 max-w-full"
          />
          {globalFilter && (
            <X
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={() => setGlobalFilter("")}
            />
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filtrele
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filtreler</h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Kategori</label>
                  <Select
                    value={activeFilters.category || "all"}
                    onValueChange={(value: string) =>
                      setActiveFilters({
                        ...activeFilters,
                        category: value === "all" ? undefined : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tüm kategoriler" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm kategoriler</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Fiyat Aralığı</label>
                    <span className="text-sm text-gray-500">
                      ₺{activeFilters.priceMin || minMaxPrice.min} - ₺
                      {activeFilters.priceMax || minMaxPrice.max}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[minMaxPrice.min, minMaxPrice.max]}
                    min={minMaxPrice.min}
                    max={minMaxPrice.max}
                    step={1}
                    value={[
                      activeFilters.priceMin !== undefined
                        ? activeFilters.priceMin
                        : minMaxPrice.min,
                      activeFilters.priceMax !== undefined
                        ? activeFilters.priceMax
                        : minMaxPrice.max,
                    ]}
                    onValueChange={(value: [number, number]) => {
                      setActiveFilters({
                        ...activeFilters,
                        priceMin: value[0],
                        priceMax: value[1],
                      });
                    }}
                    className="my-4"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Stok Miktarı</label>
                    <span className="text-sm text-gray-500">
                      {activeFilters.stockMin || 0} -{" "}
                      {activeFilters.stockMax || "∞"}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, minMaxStock.max]}
                    min={0}
                    max={minMaxStock.max}
                    step={1}
                    value={[
                      activeFilters.stockMin !== undefined
                        ? activeFilters.stockMin
                        : 0,
                      activeFilters.stockMax !== undefined
                        ? activeFilters.stockMax
                        : minMaxStock.max,
                    ]}
                    onValueChange={(value: [number, number]) => {
                      setActiveFilters({
                        ...activeFilters,
                        stockMin: value[0],
                        stockMax: value[1],
                      });
                    }}
                    className="my-4"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={activeFilters.inStock}
                    onCheckedChange={(checked) => {
                      setActiveFilters({
                        ...activeFilters,
                        inStock: checked === true ? true : undefined,
                      });
                    }}
                  />
                  <label
                    htmlFor="in-stock"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Sadece stokta olanları göster
                  </label>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Filtreleri Temizle
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => applyFilters()} // Filtreleri uygula
                  >
                    Uygula
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Sütunlar</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Aktif filtreler gösterimi */}
      {activeFilterCount > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-b flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-500">
            Aktif Filtreler:
          </span>

          {activeFilters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Kategori: {activeFilters.category}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setActiveFilters({ ...activeFilters, category: undefined })
                }
              />
            </Badge>
          )}

          {(activeFilters.priceMin !== undefined ||
            activeFilters.priceMax !== undefined) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Fiyat: ₺{activeFilters.priceMin || minMaxPrice.min} - ₺
              {activeFilters.priceMax || minMaxPrice.max}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setActiveFilters({
                    ...activeFilters,
                    priceMin: undefined,
                    priceMax: undefined,
                  })
                }
              />
            </Badge>
          )}

          {(activeFilters.stockMin !== undefined ||
            activeFilters.stockMax !== undefined) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Stok: {activeFilters.stockMin || 0} -{" "}
              {activeFilters.stockMax || "∞"}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setActiveFilters({
                    ...activeFilters,
                    stockMin: undefined,
                    stockMax: undefined,
                  })
                }
              />
            </Badge>
          )}

          {activeFilters.inStock && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Sadece stokta olanlar
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setActiveFilters({ ...activeFilters, inStock: undefined })
                }
              />
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={clearFilters}
          >
            Tümünü Temizle
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sonuç bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end px-4 py-3 border-t bg-gray-50 text-sm text-gray-600 space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} /{" "}
          {table.getFilteredRowModel().rows.length} satır seçildi.
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Önceki
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Sonraki
        </Button>
      </div>
    </div>
  );
}
