import { useState, useEffect, type ReactElement } from 'react';
import './UserProfilePage.scss';
import Header, { type HeaderProps } from '../Header/Header';
type UserProps = HeaderProps & {};

import {
  fetchCustomerProfile,
  CtError,
} from '../../services/customer-data/customer-data-service';
import type { UserProfile } from '../../types/user-profile';
import UserMainInfo from './UserMainInfo';
import UserAddressesInfo from './UserAddresses';
import UserPassword from './UserPassword';
import { useNavigate } from 'react-router-dom';

export const UserProfilePage = ({ size }: UserProps): ReactElement => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomerProfile()
      .then((data) => {
        setProfile(data);
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof CtError
            ? 'Failed to load profile'
            : 'Unexpected error',
        );
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('customer-token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  if (errorMessage) {
    return (
      <>
        <Header size={size} />
        <div className='user-profile-page'>
          <p className='error'>{errorMessage}</p>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header size={size} />
        <div className='user-profile-page'>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header size={size} />
      <div className='user-profile-page'>
        <UserMainInfo userData={profile} setProfile={setProfile} />
        <UserAddressesInfo userData={profile} setProfile={setProfile} />
        <UserPassword userData={profile} setProfile={setProfile} />
      </div>
    </>
  );
};

export default UserProfilePage;
