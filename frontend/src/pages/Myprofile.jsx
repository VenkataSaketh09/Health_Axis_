import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Edit, Save, X, User, Phone, Mail, MapPin, Heart, Shield } from "lucide-react"
import { assets } from '../assets/assets'

const Myprofile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    // Basic Account Information
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    
    // Personal Information
    dateOfBirth: '1990-05-15',
    gender: 'male',
    bloodGroup: 'O+',
    height: '175',
    weight: '70',
    
    // Contact & Location
    address: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'us',
    
    // Medical Information
    medicalConditions: 'Mild hypertension, Seasonal allergies',
    allergies: 'Peanuts, Pollen',
    medications: 'Lisinopril 10mg daily, Claritin as needed',
    emergencyContactName: 'Jane Doe',
    emergencyContactNumber: '+1 (555) 987-6543',
    familyDoctor: 'Dr. Smith, City General Hospital'
  })

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    console.log('Profile saved:', profileData)
    setIsEditing(false)
    // Add your save logic here
  }

  const handleCancel = () => {
    setIsEditing(false)
    // You might want to reset to original data here
  }

  const calculateAge = (dateOfBirth) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const formatGender = (gender) => {
    const genderMap = {
      'male': 'Male',
      'female': 'Female',
      'other': 'Other',
      'prefer-not-to-say': 'Prefer not to say'
    }
    return genderMap[gender] || gender
  }

  const formatCountry = (country) => {
    const countryMap = {
      'us': 'United States',
      'ca': 'Canada',
      'uk': 'United Kingdom',
      'au': 'Australia',
      'in': 'India',
      'other': 'Other'
    }
    return countryMap[country] || country
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img 
                    // src={FormData.gender==="Male"?assets.male:assets.female} 
                    src={assets.male}
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {profileData.firstName} {profileData.lastName}
                </CardTitle>
                <p className="text-gray-600">
                  {calculateAge(profileData.dateOfBirth)} years old • {formatGender(profileData.gender)}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{profileData.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{profileData.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">
                        {new Date(profileData.dateOfBirth).toLocaleDateString()} ({calculateAge(profileData.dateOfBirth)} years)
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    {isEditing ? (
                      <Select onValueChange={(value) => handleInputChange('gender', value)} value={profileData.gender}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{formatGender(profileData.gender)}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    {isEditing ? (
                      <Select onValueChange={(value) => handleInputChange('bloodGroup', value)} value={profileData.bloodGroup}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{profileData.bloodGroup}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    {isEditing ? (
                      <Input
                        id="height"
                        type="number"
                        value={profileData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{profileData.height} cm</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    {isEditing ? (
                      <Input
                        id="weight"
                        type="number"
                        value={profileData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{profileData.weight} kg</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Contact Information Tab */}
            <TabsContent value="contact" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="flex-1"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-md flex-1">{profileData.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {isEditing ? (
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="flex-1"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-md flex-1">{profileData.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={2}
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-md">{profileData.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    {isEditing ? (
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{profileData.city}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    {isEditing ? (
                      <Input
                        id="state"
                        value={profileData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{profileData.state}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    {isEditing ? (
                      <Input
                        id="zipCode"
                        value={profileData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{profileData.zipCode}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  {isEditing ? (
                    <Select onValueChange={(value) => handleInputChange('country', value)} value={profileData.country}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="in">India</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-md">{formatCountry(profileData.country)}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Medical Information Tab */}
            <TabsContent value="medical" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-semibold">Medical Information</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="medicalConditions">Medical Conditions</Label>
                    {isEditing ? (
                      <Textarea
                        id="medicalConditions"
                        value={profileData.medicalConditions}
                        onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md min-h-[80px]">
                        {profileData.medicalConditions || 'No medical conditions listed'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    {isEditing ? (
                      <Textarea
                        id="allergies"
                        value={profileData.allergies}
                        onChange={(e) => handleInputChange('allergies', e.target.value)}
                        rows={2}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">
                        {profileData.allergies || 'No allergies listed'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    {isEditing ? (
                      <Textarea
                        id="medications"
                        value={profileData.medications}
                        onChange={(e) => handleInputChange('medications', e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md min-h-[80px]">
                        {profileData.medications || 'No medications listed'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="familyDoctor">Family Doctor</Label>
                    {isEditing ? (
                      <Input
                        id="familyDoctor"
                        value={profileData.familyDoctor}
                        onChange={(e) => handleInputChange('familyDoctor', e.target.value)}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">
                        {profileData.familyDoctor || 'No family doctor listed'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Emergency Contact Tab */}
            <TabsContent value="emergency" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold">Emergency Contact</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                    {isEditing ? (
                      <Input
                        id="emergencyContactName"
                        value={profileData.emergencyContactName}
                        onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">
                        {profileData.emergencyContactName || 'No emergency contact listed'}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactNumber">Emergency Contact Number</Label>
                    {isEditing ? (
                      <Input
                        id="emergencyContactNumber"
                        type="tel"
                        value={profileData.emergencyContactNumber}
                        onChange={(e) => handleInputChange('emergencyContactNumber', e.target.value)}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">
                        {profileData.emergencyContactNumber || 'No emergency contact number listed'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-orange-600" />
                    <h4 className="font-semibold text-orange-800">Important Emergency Information</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-orange-700">Blood Type:</p>
                      <p className="text-orange-900">{profileData.bloodGroup}</p>
                    </div>
                    <div>
                      <p className="font-medium text-orange-700">Key Allergies:</p>
                      <p className="text-orange-900">{profileData.allergies || 'None listed'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-orange-700">Critical Medications:</p>
                      <p className="text-orange-900">{profileData.medications || 'None listed'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-orange-700">Medical Conditions:</p>
                      <p className="text-orange-900">{profileData.medicalConditions || 'None listed'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default Myprofile