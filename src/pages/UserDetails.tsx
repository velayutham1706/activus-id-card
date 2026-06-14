import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/contexts/AppContext";

interface UserDetailsProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const UserDetails = ({ isCollapsed, setIsCollapsed }: UserDetailsProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { users, updateUser, projects, currentUser } = useAppContext();

  const user = users.find((u) => u.id === id);

  // User form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [dob, setDob] = useState("");
  const [inductionDate, setInductionDate] = useState("");
  const [validTill, setValidTill] = useState("");
  const [healthCheckupDate, setHealthCheckupDate] = useState("");
  const [uidNo, setUidNo] = useState("");
  const [idNo, setIdNo] = useState("");
  const [contractor, setContractor] = useState("");
  const [safetyViolation, setSafetyViolation] = useState<string | null>(null);
  const [safetyIncharge, setSafetyIncharge] = useState("");
  const [hrExecutive, setHrExecutive] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAddress(user.address || "");
      setBloodGroup(user.bloodGroup || "");
      setEmergencyContact(user.emergencyContact || "");
      setDob(user.dob || "");
      setInductionDate(user.inductionDate || "");
      setValidTill(user.validTill || "");
      setHealthCheckupDate(user.healthCheckupDate || "");
      setUidNo(user.uidNo || "");
      setIdNo(user.idNo || "");
      setContractor(user.contractor || "");
      setSafetyViolation(user.safetyViolation || null);
      setSafetyIncharge(user.safetyIncharge || "");
      setHrExecutive(user.hrExecutive || "");
      setPhotoPreview(user.photo || null);
    }
  }, [user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let photoUrl = user.photo;

    if (photoFile) {
      const reader = new FileReader();
      photoUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(photoFile);
      });
    }

    updateUser(user.id, {
      name,
      address,
      bloodGroup,
      emergencyContact,
      dob,
      inductionDate,
      validTill,
      healthCheckupDate,
      uidNo,
      idNo,
      contractor,
      safetyViolation: safetyViolation as "green" | "yellow" | "red" | null,
      safetyIncharge,
      hrExecutive,
      photo: photoUrl,
    });

    toast({
      title: "Success",
      description: "User information updated successfully",
    });

    // Navigate back to users page after saving
    navigate("/users");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        className={`flex-1 p-4 sm:p-8 transition-all duration-300 ${
          isCollapsed ? "ml-[60px]" : "ml-[60px] sm:ml-64"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/users")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-600 mt-1 capitalize">{user.role}</p>
            </div>
          </div>
          <Button onClick={handleSubmit} className="sm:self-end bg-[#337688]">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Input
                      id="bloodGroup"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      placeholder="E.g., A+, B-, O+"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inductionDate">Induction Date</Label>
                    <Input
                      id="inductionDate"
                      type="date"
                      value={inductionDate}
                      onChange={(e) => setInductionDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validTill">Valid Till</Label>
                    <Input
                      id="validTill"
                      type="date"
                      value={validTill}
                      onChange={(e) => setValidTill(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="healthCheckupDate">
                      Health Checkup Date
                    </Label>
                    <Input
                      id="healthCheckupDate"
                      type="date"
                      value={healthCheckupDate}
                      onChange={(e) => setHealthCheckupDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="Contact number"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter address"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ID Card Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractor">
                      Contractor Name & Address
                    </Label>
                    <textarea
                      id="contractor"
                      value={contractor}
                      onChange={(e) => setContractor(e.target.value)}
                      placeholder="Enter contractor details"
                      className="w-full h-32 px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Safety Violation</Label>
                    <RadioGroup
                      value={safetyViolation || ""}
                      onValueChange={(value) =>
                        setSafetyViolation(value === "" ? null : value)
                      }
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="green" id="safety-green" />
                        <Label
                          htmlFor="safety-green"
                          className="flex items-center"
                        >
                          <span className="h-4 w-4 rounded-full bg-green-500 inline-block mr-1"></span>
                          Good
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yellow" id="safety-yellow" />
                        <Label
                          htmlFor="safety-yellow"
                          className="flex items-center"
                        >
                          <span className="h-4 w-4 rounded-full bg-yellow-500 inline-block mr-1"></span>
                          Warning
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="red" id="safety-red" />
                        <Label
                          htmlFor="safety-red"
                          className="flex items-center"
                        >
                          <span className="h-4 w-4 rounded-full bg-red-500 inline-block mr-1"></span>
                          Violation
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="" id="safety-none" />
                        <Label htmlFor="safety-none">None</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Photo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="w-40 h-48 mb-4 border rounded-md flex items-center justify-center bg-gray-50 overflow-hidden">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm text-center p-4">
                        No photo uploaded
                      </div>
                    )}
                  </div>

                  <Label
                    htmlFor="photo-upload"
                    className="cursor-pointer flex items-center justify-center w-full"
                  >
                    <div className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
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

                  {photoPreview && (
                    <p className="text-xs text-gray-500 mt-2">
                      Photo will be displayed on the ID card
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role & Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Role</Label>
                    <div className="mt-1 px-3 py-2 border rounded-md bg-gray-50 capitalize">
                      {user.role}
                    </div>
                  </div>

                  <div>
                    <Label>Projects</Label>
                    <div className="mt-1 p-2 border rounded-md min-h-[100px]">
                      {user.projectIds.length > 0 ? (
                        <ul className="space-y-1">
                          {user.projectIds.map((projectId) => {
                            const project = projects.find(
                              (p) => p.id === projectId,
                            );
                            return (
                              <li
                                key={projectId}
                                className="text-sm py-1 px-2 hover:bg-gray-50 rounded"
                              >
                                {project?.name || "Unknown project"}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="text-center text-gray-500 text-sm p-4">
                          Not assigned to any projects
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDetails;
