import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { IDCard } from "@/contexts/AppContext";
import CardsList from "./CardsList";
import { Card } from "../ui/card";

interface CardTabsProps {
  tab: string;
  setTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredIdCards: IDCard[];
  selectedCards: string[];
  setSelectedCards: (selectedCards: string[]) => void;
  cardListProps: any;
}

const CardTabs: React.FC<CardTabsProps> = ({
  tab,
  setTab,
  searchTerm,
  setSearchTerm,
  filteredIdCards,
  selectedCards,
  setSelectedCards,
  cardListProps,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, project or ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="pending" value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="review">In Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="generated">Generated</TabsTrigger>
        </TabsList>
        <TabsContent value={tab}>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCards(
                            filteredIdCards.map((card) => card.id),
                          );
                        } else {
                          setSelectedCards([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <CardsList
                  cards={filteredIdCards}
                  selectedCards={selectedCards}
                  setSelectedCards={setSelectedCards}
                  {...cardListProps}
                />
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CardTabs;
