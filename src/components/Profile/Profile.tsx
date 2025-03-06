import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';
import Cookies from 'universal-cookie';
import fetcher from '../../lib/fetcher';

// Profile component for managing user profile information
function Profile() {
  const navigate = useNavigate();
  const cookies = new Cookies();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState('');

  // Load user profile data when component mounts
  useEffect(() => {
    getUserProfile();
  }, []);

  // Fetch user profile data from the API
  const getUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetcher('/Api/Auth/profile', {
        method: 'GET',
      });

      if (response.success && response.data) {
        // Update state with user data
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setUserName(response.data.userName);
        setEmail(response.data.email);

        // Set profile image if available, otherwise use placeholder
        if (response.data.profileImage) {
          setProfileImage(response.data.profileImage);
        } else {
          setProfileImage(
            `https://ui-avatars.com/api/?name=${response.data.firstName}+${response.data.lastName}&background=random`
          );
        }
      } else {
        toast.error('Failed to load profile. Please try again.');
        // Redirect to login if unauthorized
        if (response.status === 401) {
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('An error occurred while loading your profile.');
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update
  const handleUpdate = async () => {
    try {
      setUpdating(true);

      const response = await fetcher('/Api/Auth/profile', {
        method: 'PUT',
        body: {
          firstName,
          lastName,
        },
      });

      if (response.success) {
        // Update cookies with new values
        cookies.set('firstName', firstName);
        cookies.set('lastName', lastName);

        toast.success('Profile updated successfully!');
      } else {
        toast.error(response.error || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating your profile.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-1">Profile</h1>
      <p className="text-sm text-gray-500 mb-8">Manage your Kepler profile</p>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Profile picture</h2>
        <div className="flex justify-center">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profileImage} alt={`${firstName} ${lastName}`} />
            <AvatarFallback className="text-lg">
              {userName
                ? userName.substring(0, 2).toUpperCase()
                : firstName && lastName
                  ? `${firstName[0]}${lastName[0]}`
                  : 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Email</h2>
        <p className="text-gray-500">{email}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">First Name</h2>
        <Input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Last Name</h2>
        <Input
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>

      <Button
        onClick={handleUpdate}
        disabled={updating}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {updating ? 'Updating...' : 'Update'}
      </Button>
    </div>
  );
}

export default Profile;
