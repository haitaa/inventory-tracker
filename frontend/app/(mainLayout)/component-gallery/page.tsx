"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

interface ComponentCategory {
  id: string;
  name: string;
  description: string;
}

interface Component {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  type: string;
  thumbnail: string;
  isGlobal: boolean;
  isActive: boolean;
}

export default function ComponentGallery() {
  const [categories, setCategories] = useState<ComponentCategory[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get("/api/component-categories");
        setCategories(categoriesResponse.data);

        const componentsResponse = await axios.get("/api/components");
        setComponents(componentsResponse.data);
      } catch (error) {
        console.error("Veri yüklenirken hata oluştu:", error);
      }
    };

    fetchData();
  }, []);

  const filteredComponents = components.filter((component) => {
    const matchesCategory =
      selectedCategory === "all" || component.categoryId === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleComponentSelect = (component: Component) => {
    setSelectedComponent(component);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bileşen Galerisi</h1>
        <Button onClick={() => router.push("/component-editor")}>
          Yeni Bileşen Oluştur
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[250px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Kategoriler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div
              className={`p-2 rounded cursor-pointer ${selectedCategory === "all" ? "bg-primary/10" : "hover:bg-muted"}`}
              onClick={() => setSelectedCategory("all")}
            >
              Tüm Bileşenler
            </div>
            {categories.map((category) => (
              <div
                key={category.id}
                className={`p-2 rounded cursor-pointer ${selectedCategory === category.id ? "bg-primary/10" : "hover:bg-muted"}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Bileşen ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredComponents.map((component) => (
              <Card key={component.id} className="overflow-hidden">
                <div className="relative h-40 bg-muted">
                  {component.thumbnail ? (
                    <Image
                      src={component.thumbnail}
                      alt={component.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Önizleme yok
                    </div>
                  )}
                </div>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{component.name}</CardTitle>
                    {component.isGlobal && (
                      <Badge variant="outline">Global</Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {component.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleComponentSelect(component)}
                      >
                        Detaylar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                      {selectedComponent && (
                        <>
                          <DialogHeader>
                            <DialogTitle>{selectedComponent.name}</DialogTitle>
                            <DialogDescription>
                              {selectedComponent.description}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="relative h-56 bg-muted mt-4">
                            {selectedComponent.thumbnail ? (
                              <Image
                                src={selectedComponent.thumbnail}
                                alt={selectedComponent.name}
                                fill
                                className="object-contain"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                Önizleme yok
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <h4 className="font-medium mb-1">Tür</h4>
                              <p className="text-sm text-muted-foreground">
                                {selectedComponent.type}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Durum</h4>
                              <Badge
                                variant={
                                  selectedComponent.isActive
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {selectedComponent.isActive ? "Aktif" : "Pasif"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 mt-6">
                            <Button
                              onClick={() =>
                                router.push(
                                  `/component-editor/${selectedComponent.id}`
                                )
                              }
                            >
                              Düzenle
                            </Button>
                            <Button variant="default">Sayfaya Ekle</Button>
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button variant="default" size="sm">
                    Ekle
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
