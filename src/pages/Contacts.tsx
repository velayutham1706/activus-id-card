import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";

interface ContactsProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Contacts = ({ isCollapsed, setIsCollapsed }: ContactsProps) => {
  const [search, setSearch] = useState("");

  const mockContacts = [
    { id: 1, name: "John Doe", email: "john@example.com", company: "Tech Corp", role: "CEO" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", company: "Design Co", role: "Designer" },
  ];

  return (
    <div className="min-h-screen bg-white flex relative">
      <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className={`flex-1 p-4 sm:p-8 transition-all duration-300 ${
        isCollapsed ? 'ml-[60px]' : 'ml-[60px] sm:ml-64'
      }`}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Contacts</h1>
            <p className="text-gray-600 mt-1">Manage your contacts and leads</p>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary/90 transition-colors">
            <Plus className="h-5 w-5" />
            <span>Add Contact</span>
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockContacts.map((contact) => (
            <Link key={contact.id} to={`/contacts/${contact.id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-semibold text-lg">{contact.name}</h3>
                <p className="text-gray-600">{contact.email}</p>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>{contact.company}</span>
                  <span>{contact.role}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Contacts;