import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import fetcher from '@/lib/fetcher';
import Cookies from 'universal-cookie';

function Profile() {
  const cookies = new Cookies();
  const [firstName, setFirstName] = useState('Adepeju');
  const [lastName, setLastName] = useState('Orefejo');
  const [email, setEmail] = useState('test@test.com');
  const [profileImage, setProfileImage] = useState('https://example.com/profile.jpg');

  useEffect(() => {
    const getUserProfile = async () => {
      const token = cookies.get('token');

      const response = await fetcher('/Api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.success) {
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setEmail(response.data.email);
        setProfileImage(response.data.profileImage);
      }
    };

    getUserProfile();
  }, []);

  const handleUpdate = async () => {
    const token = cookies.get('token');

    await fetcher('/Api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: {
        firstName,
        lastName,
        email,
        profileImage,
      },
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-2">Profile</h1>
      <p className="text-sm text-gray-500 mb-4">Manage your Kepler profile</p>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Profile picture</h2>
        <Avatar>
          <AvatarImage src={profileImage} alt="Profile" className="w-24 h-24 rounded-full" />
        </Avatar>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Email</h2>
        <p className="text-gray-500">{email}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">First Name</h2>
        <Input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Last Name</h2>
        <Input value={lastName} onChange={e => setLastName(e.target.value)} />
      </div>

      <Button onClick={handleUpdate}>Update</Button>
    </div>
  );
}

export default Profile;
