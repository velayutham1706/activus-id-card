import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Building, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";

interface ContactDetailsProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const ContactDetails = ({
  isCollapsed,
  setIsCollapsed,
}: ContactDetailsProps) => {
  const { id } = useParams();

  const contact = {
    name: "Sama",
    email: "sama@example.com",
    phone: "+1 234 567 890",
    company: "Tech Corp",
    role: "CEO",
    location: "San Francisco, CA",
    deals: [
      {
        id: 1,
        name: "Enterprise Package",
        value: "$50,000",
        status: "In Progress",
      },
      { id: 2, name: "Consulting Project", value: "$25,000", status: "Won" },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        className={`transition-all duration-300 ${isCollapsed ? "ml-[60px]" : "ml-64"} p-8`}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{contact.name}</h1>
          <p className="text-gray-600 mt-1">
            {contact.role} at {contact.company}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>{contact.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <span>{contact.company}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span>{contact.location}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Deals</h2>
              <div className="space-y-4">
                {contact.deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{deal.name}</h3>
                      <p className="text-sm text-gray-600">{deal.value}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${deal.status === "Won"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                        }`}
                    >
                      {deal.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Activity</h2>
              <div className="space-y-4">
                <p className="text-gray-600">No recent activity</p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactDetails;
