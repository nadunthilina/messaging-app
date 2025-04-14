import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Settings = ({ user, profilePhoto, setProfilePhoto }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result); // Base64 string
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a profile photo');
      setMessageType('danger');
      return;
    }
    try {
      const response = await axios.put('http://localhost:5000/api/auth/update-profile', {
        username: user,
        profilePhoto: file,
      });
      setProfilePhoto(file);
      setMessage(response.data.message);
      setMessageType('success');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
      setMessageType('danger');
    }
  };

  return (
    <Card style={{ width: '400px', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <Card.Body>
        <Card.Title className="text-center mb-4">Settings</Card.Title>
        {message && <Alert variant={messageType}>{message}</Alert>}
        <div className="text-center mb-4">
          {profilePhoto ? (
            <Image src={profilePhoto} roundedCircle width="100" height="100" />
          ) : (
            <div className="bg-secondary rounded-circle mx-auto" style={{ width: '100px', height: '100px' }}></div>
          )}
        </div>
        <Form onSubmit={handleUpdateProfile}>
          <Form.Group className="mb-3" controlId="formProfilePhoto">
            <Form.Label>Profile Photo</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 mb-3">
            Update Profile
          </Button>
          <Button variant="outline-secondary" className="w-100" onClick={() => navigate('/')}>
            Back to Chat
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Settings;