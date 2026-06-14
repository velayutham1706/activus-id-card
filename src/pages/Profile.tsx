import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/AppContext";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { User, Upload } from "lucide-react";

interface ProfileProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Profile = ({ isCollapsed, setIsCollapsed }: ProfileProps) => {
  const { toast } = useToast();
  const { currentUser, updateUser } = useAppContext();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    currentUser?.photo || null,
  );

  const [formData, setFormData] = useState({
    address: currentUser?.address || "",
    bloodGroup: currentUser?.bloodGroup || "",
    emergencyContact: currentUser?.emergencyContact || "",
    dob: currentUser?.dob || "",
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    let photoUrl = currentUser.photo;

    if (photoFile) {
      const reader = new FileReader();
      photoUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(photoFile);
      });
    }

    updateUser(currentUser.id, {
      ...formData,
      photo: photoUrl,
    });

    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  if (!currentUser) return null;

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          className={`flex-1 p-4 md:p-6 bg-gray-50 overflow-y-auto ${isCollapsed ? "ml-[60px]" : "ml-64"}`}
        >
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">My Profile</h1>

            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-gray-400" />
                      )}
                    </div>

                    <Label
                      htmlFor="photo-upload"
                      className="cursor-pointer inline-flex items-center"
                    >
                      <div className="flex items-center justify-center px-4 py-2 bg-[#337688] text-white rounded-md hover:bg-primary/90">
                        <Upload className="h-4 w-4 mr-2" />
                        <span>Upload Photo</span>
                      </div>
                      <Input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={currentUser.name} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={currentUser.email} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Input
                        id="bloodGroup"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        placeholder="E.g., A+, B-, O+"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">
                        Emergency Contact
                      </Label>
                      <Input
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        placeholder="Contact number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-[#337688]">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Profile;
