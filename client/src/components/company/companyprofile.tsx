import { useUser } from '@/context/UserContext';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, GraduationCap, Award, Edit, Save, X, Plus, Trash2, MapPin, Navigation, Info, Phone, BookUser } from 'lucide-react';
import Cookies from 'js-cookie';
import { useToast } from '@/hooks/use-toast';
import { editCompanyProfile } from '@/api/companyApi';

const CompanyProfile = () => {
  const { userDetails, setUserDetails } = useUser();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const { toast } = useToast();

  const [editedName, setEditedName] = useState(userDetails?.userDetails?.name || '');
  const [editedAddress, setEditedAddress] = useState(userDetails?.userDetails?.location || '');
  const [editedDescription, setEditedDescription] = useState(userDetails?.userDetails?.description || '');
  const [editedPhone, setEditedPhone] = useState(userDetails?.userDetails?.description || '');

  const token = Cookies.get("token");


  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };


  const handleNameSave = async () => {
    try {
      if (!editedName.trim()) {
        toast({
          title: "Name cannot be empty",
          variant: "destructive",
        });
        return;
      }

      if (userDetails?.userDetails) {
        const response = await editCompanyProfile(
          { field: "company_name", value: editedName },
          token
        );

        if (response.status === 200) {
          toast({
            title: "Name updated successfully!",
          });

          // Update context
          setUserDetails({
            ...userDetails,
            userDetails: {
              ...userDetails.userDetails,
              company_name: editedName,
            },
          });

          const updated = {
            ...userDetails,
            userDetails: {
              ...userDetails.userDetails,
              company_name: editedName,
            },
          };

          localStorage.setItem("details", JSON.stringify(updated)); // ✅ save to localStorage

          setIsEditingName(false);
        } else {
          toast({
            title: "Failed to update name",
            description: response.data?.message || "Try again later.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Name update error:", error);
      toast({
        title: "Something went wrong",
        description: "Unable to update name.",
        variant: "destructive",
      });
    }
  };


  const handleAddressSave = async () => {
    try {
      if (!editedAddress.trim()) {
        toast({
          title: "Address cannot be empty",
          variant: "destructive",
        });
        return;
      }

      if (userDetails?.userDetails) {
        const response = await editCompanyProfile(
          { field: "location", value: editedAddress },
          token
        );

        if (response.status === 200) {
          toast({
            title: "Address updated successfully!",
          });

          // Update context
          setUserDetails({
            ...userDetails,
            userDetails: {
              ...userDetails.userDetails,
              location: editedAddress,
            },
          });

          const updated = {
            ...userDetails,
            userDetails: {
              ...userDetails.userDetails,
              location: editedAddress,
            },
          };

          localStorage.setItem("details", JSON.stringify(updated)); // ✅ save to localStorage

          setIsEditingAddress(false);
        } else {
          toast({
            title: "Failed to update address",
            description: response.data?.message || "Try again later.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Address update error:", error);
      toast({
        title: "Something went wrong",
        description: "Unable to update address.",
        variant: "destructive",
      });
    }
  };

  const handleDescriptionSave = async () => {
    try {
      if (!editedDescription.trim()) {
        toast({
          title: "Description cannot be empty",
          variant: "destructive",
        });
        return;
      }

      if (userDetails?.userDetails) {
        const response = await editCompanyProfile(
          { field: "description", value: editedDescription },
          token
        );

        if (response.status === 200) {
          toast({
            title: "Company Description updated successfully!",
          });

          // Update context
          setUserDetails({
            ...userDetails,
            userDetails: {
              ...userDetails.userDetails,
              description: editedDescription,
            },
          });

          const updated = {
            ...userDetails,
            userDetails: {
              ...userDetails.userDetails,
              description: editedDescription,
            },
          };

          localStorage.setItem("details", JSON.stringify(updated)); // ✅ save to localStorage

          setIsEditingDescription(false);
        } else {
          toast({
            title: "Failed to update description",
            description: response.data?.message || "Try again later.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("description update error:", error);
      toast({
        title: "Something went wrong",
        description: "Unable to update description.",
        variant: "destructive",
      });
    }
  };

  const handlePhoneSave = async () => {
    try {
      if (!editedPhone.trim()) {
        toast({
          title: "phone cannot be empty",
          variant: "destructive",
        });
        return;
      }

      if (userDetails?.userDetails) {
        const response = await editCompanyProfile(
          { field: "phone", value: editedPhone },
          token
        );

        if (response.status === 200) {
          toast({
            title: "Company phone updated successfully!",
          });

          // Update context
          setUserDetails({
            ...userDetails,
            userDetails: {
              ...userDetails.userDetails,
              phone: editedPhone,
            },
          });

          const updated = {
            ...userDetails,
            userDetails: {
              ...userDetails.userDetails,
              phone: editedPhone,
            },
          };

          localStorage.setItem("details", JSON.stringify(updated)); // ✅ save to localStorage

          setIsEditingPhone(false);
        } else {
          toast({
            title: "Failed to update description",
            description: response.data?.message || "Try again later.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("description update error:", error);
      toast({
        title: "Something went wrong",
        description: "Unable to update description.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className='dark:bg-slate-900'>
      <div className="container mx-auto px-4 py-24 max-w-4xl ">
        <div className="space-y-6">
          <h1 className='text-3xl font-bold flex justify-center'>Company Profile</h1>
          {/* Header Card */}
          <Card className="bg-gray-700 border-none shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" alt={userDetails?.userDetails?.company_name || 'User'} />
                    <AvatarFallback className="bg-blue-500 text-white text-lg">
                      {userDetails?.userDetails?.company_name ? getInitials(userDetails?.userDetails?.company_name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    {isEditingName ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="text-2xl font-bold dark:bg-gray-800 outline-none"
                        />
                        <Button size="sm" onClick={handleNameSave}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditingName(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-3xl font-bold text-slate-100">
                          {userDetails?.userDetails?.company_name || 'Company Name'}
                        </CardTitle>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditingName(true)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <p className="text-gray-400 mt-1">{userDetails?.userType || 'Student'}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>


          {/* E-mail */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-500">{userDetails?.userDetails?.email || 'email@example.com'}</span>
                </div>
                {userDetails?.company_name && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">Company: {userDetails.company_name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Phone  */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookUser  className="h-5 w-5 text-blue-600" />
                  Phone
                </div>
                <Button size="sm" variant="outline" onClick={() => setIsEditingPhone(!isEditingPhone)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isEditingPhone ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                      placeholder="Enter company phone"
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handlePhoneSave}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditingPhone(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-500">{userDetails?.userDetails?.phone || 'Please add your company phone'}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-blue-600" />
                  Address
                </div>
                <Button size="sm" variant="outline" onClick={() => setIsEditingAddress(!isEditingAddress)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isEditingAddress ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editedAddress}
                      onChange={(e) => setEditedAddress(e.target.value)}
                      placeholder="Enter company address"
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleAddressSave}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditingAddress(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-500">{userDetails?.userDetails?.location || 'Please add your address'}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>






          {/* Description  */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  Description
                </div>
                <Button size="sm" variant="outline" onClick={() => setIsEditingDescription(!isEditingDescription)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isEditingDescription ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      placeholder="Enter company description"
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleDescriptionSave}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditingDescription(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-500">{userDetails?.userDetails?.description || 'Please add your company description'}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>




        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;