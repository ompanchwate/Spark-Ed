import { useUser } from '@/context/UserContext';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, GraduationCap, Award, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { editStudProfile } from "@/app/api/studentsApi";
import Cookies from 'js-cookie';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { userDetails, setUserDetails } = useUser(); // Context
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const { toast } = useToast();

  const [editedName, setEditedName] = useState(userDetails?.userDetails?.name || '');
  const [newSkill, setNewSkill] = useState('');
  const [editedEducation, setEditedEducation] = useState([]);
  const token = Cookies.get("token");

  const skills = userDetails?.userDetails?.skills;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  // Parse the string to array
  let parsedSkills = [];
  let educationArray = [];

  try {
    educationArray = JSON.parse(userDetails?.userDetails?.education || "[]");
    parsedSkills = JSON.parse(skills || "[]");

    // Sort education by end year in descending order (most recent first)
    educationArray.sort((a, b) => {
      const endYearA = parseInt(a.endYear) || 0;
      const endYearB = parseInt(b.endYear) || 0;
      return endYearB - endYearA;
    });
  } catch (err) {
    console.error("Error parsing data:", err);
  }

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
        const response = await editStudProfile(
          { field: "name", value: editedName },
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
              name: editedName,
            },
          });

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


  const handleAddSkill = () => {
    if (newSkill.trim() && userDetails?.userDetails) {
      const updatedSkills = [...parsedSkills, newSkill.trim()];
      setUserDetails({
        ...userDetails,
        userDetails: {
          ...userDetails.userDetails,
          skills: JSON.stringify(updatedSkills)
        }
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (indexToRemove: number) => {
    if (userDetails?.userDetails) {
      const updatedSkills = parsedSkills.filter((_, index) => index !== indexToRemove);
      setUserDetails({
        ...userDetails,
        userDetails: {
          ...userDetails.userDetails,
          skills: JSON.stringify(updatedSkills)
        }
      });
    }
  };

  const handleAddEducation = () => {
    const newEducation = {
      degree: '',
      college: '',
      startYear: '',
      endYear: '',
      location: ''
    };
    setEditedEducation([...editedEducation, newEducation]);
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updated = [...editedEducation];
    updated[index] = { ...updated[index], [field]: value };
    setEditedEducation(updated);
  };

  const handleSaveEducation = () => {
    if (userDetails?.userDetails) {
      const combinedEducation = [...educationArray, ...editedEducation.filter(edu =>
        edu.degree || edu.college || edu.startYear || edu.endYear || edu.location
      )];

      // Sort the combined education by end year in descending order
      combinedEducation.sort((a, b) => {
        const endYearA = parseInt(a.endYear) || 0;
        const endYearB = parseInt(b.endYear) || 0;
        return endYearB - endYearA;
      });

      setUserDetails({
        ...userDetails,
        userDetails: {
          ...userDetails.userDetails,
          education: JSON.stringify(combinedEducation)
        }
      });
      setEditedEducation([]);
      setIsEditingEducation(false);
    }
  };

  const handleRemoveEducation = (indexToRemove: number) => {
    if (userDetails?.userDetails) {
      const updatedEducation = educationArray.filter((_, index) => index !== indexToRemove);
      setUserDetails({
        ...userDetails,
        userDetails: {
          ...userDetails.userDetails,
          education: JSON.stringify(updatedEducation)
        }
      });
    }
  };

  return (
    <div className='dark:bg-slate-900'>
      <div className="container mx-auto px-4 py-24 max-w-4xl ">
        <div className="space-y-6">
          {/* Header Card */}
          <Card className="bg-gray-700 border-none shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" alt={userDetails?.userDetails?.name || 'User'} />
                    <AvatarFallback className="bg-blue-500 text-white text-lg">
                      {userDetails?.userDetails?.name ? getInitials(userDetails?.userDetails?.name) : 'U'}
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
                          {userDetails?.userDetails?.name || 'User Name'}
                        </CardTitle>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditingName(true)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <p className="text-gray-400 mt-1">{userDetails?.userDetails?.userType || 'Student'}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Contact Information */}
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

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  Skills & Technologies
                </div>
                <Button size="sm" variant="outline" onClick={() => setIsEditingSkills(!isEditingSkills)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {parsedSkills.length > 0 ? (
                    parsedSkills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          {skill}
                        </Badge>
                        {isEditingSkills && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveSkill(index)}
                            className="h-6 w-6 p-0 hover:bg-red-100"
                          >
                            <X className="h-3 w-3 text-red-600" />
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No skills added yet</p>
                  )}
                </div>

                {isEditingSkills && (
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Input
                      placeholder="Add new skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <Button onClick={handleAddSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                  Education (Most Recent First)
                </div>
                <Button size="sm" variant="outline" onClick={() => setIsEditingEducation(!isEditingEducation)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {educationArray.length > 0 ? (
                  educationArray.map((edu, idx) => (
                    <div key={idx} className="border-l-4 border-purple-200 pl-4 py-2 relative">
                      {isEditingEducation && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveEducation(idx)}
                          className="absolute top-0 right-0 h-8 w-8 p-0 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                      <h3 className="font-semibold text-gray-500">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.college}</p>
                      <p className="text-sm text-gray-500">
                        {edu.startYear} - {edu.endYear}
                      </p>
                      <p className="text-sm text-purple-600 font-medium">{edu.location}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No education info added</p>
                )}

                {/* New Education Entries */}
                {editedEducation.map((edu, idx) => (
                  <div key={`new-${idx}`} className="border-l-4 border-green-200 pl-4 py-2 space-y-2">
                    <Input
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                    />
                    <Input
                      placeholder="College/University"
                      value={edu.college}
                      onChange={(e) => handleEducationChange(idx, 'college', e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Start Year"
                        value={edu.startYear}
                        onChange={(e) => handleEducationChange(idx, 'startYear', e.target.value)}
                      />
                      <Input
                        placeholder="End Year"
                        value={edu.endYear}
                        onChange={(e) => handleEducationChange(idx, 'endYear', e.target.value)}
                      />
                    </div>
                    <Input
                      placeholder="Location"
                      value={edu.location}
                      onChange={(e) => handleEducationChange(idx, 'location', e.target.value)}
                    />
                  </div>
                ))}

                {isEditingEducation && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button onClick={handleAddEducation} variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Education
                    </Button>
                    {editedEducation.length > 0 && (
                      <Button onClick={handleSaveEducation}>
                        <Save className="h-4 w-4 mr-1" />
                        Save Changes
                      </Button>
                    )}
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

export default Profile;