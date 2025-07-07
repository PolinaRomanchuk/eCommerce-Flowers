import { type FormEvent, useState, type ReactElement, useContext } from 'react';
import type { UserProfile } from '../../types/user-profile';
import Modal from '../../utils/modal/modal';
import {
  changeCustomerPassword,
  fetchCustomerProfile,
} from '../../services/customer-data/customer-data-service';
import {
  validateOldPassword,
  validatePassword,
  validatePasswordConfirm,
} from '../../utils/validate';
import { AuthContext } from '../../context/AuthContext';

import { ReactComponent as EyeOpen } from './../../assets/Login/eye.svg';
import { ReactComponent as EyeClose } from './../../assets/Login/crossed-eye.svg';

import type { PasswordFieldData } from '../../data/user-password-field.ts';

type UserPasswordProps = {
  userData: UserProfile;
  setProfile: (profile: UserProfile) => void;
};

export const UserPassword = ({
  userData,
  setProfile,
}: UserPasswordProps): ReactElement => {
  const [modalActive, setModalActive] = useState(false);
  const [modalContent, setModalContent] = useState<
    'password' | 'modal-message' | null
  >(null);
  const [modalMessage, setModalMessage] = useState('');
  const openModal = (
    type: 'password' | 'modal-message',
    message?: string,
  ): void => {
    setModalContent(type);
    setModalActive(true);
    if (message) {
      setModalMessage(message);
    }
  };

  const [passwordValidError, setPasswordValidError] = useState('');
  const [newPasswordValidError, setNewPasswordValidError] = useState('');
  const [confirmPasswordValidError, setConfirmPasswordValidError] =
    useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const auth = useContext(AuthContext);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordFields: PasswordFieldData[] = [
    {
      label: 'Current Password',
      value: currentPassword,
      setValue: setCurrentPassword,
      show: showCurrentPassword,
      setShow: setShowCurrentPassword,
      error: passwordValidError,
      setError: setPasswordValidError,
      validate: validateOldPassword,
    },
    {
      label: 'New Password',
      value: newPassword,
      setValue: setNewPassword,
      show: showNewPassword,
      setShow: setShowNewPassword,
      error: newPasswordValidError,
      setError: setNewPasswordValidError,
      validate: validatePassword,
    },
    {
      label: 'Confirm New Password',
      value: confirmPassword,
      setValue: setConfirmPassword,
      show: showConfirmPassword,
      setShow: setShowConfirmPassword,
      error: confirmPasswordValidError,
      setError: setConfirmPasswordValidError,
      validate: (value: string) => validatePasswordConfirm(value, newPassword),
    },
  ];

  const handlePasswordSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if (!userData) {
      return;
    }

    if (
      passwordValidError !== '' ||
      newPasswordValidError !== '' ||
      confirmPasswordValidError !== ''
    ) {
      return;
    }

    try {
      const { data, error } = await changeCustomerPassword({
        version: userData.version,
        currentPassword,
        newPassword,
      });
      if (data) {
        await auth?.logout();
        await auth?.anonymousAccess();
        await auth?.login(
          data.email,
          newPassword,
          () => {
            openModal('modal-message', 'Something went wrong');
          },
          () => {
            handleReset();
            openModal(
              'modal-message',
              'Your password has been successfully updated',
            );
          },
        );
        const freshData = await fetchCustomerProfile();
        setProfile(freshData);
      }
      if (error === 'InvalidCurrentPassword') {
        openModal(
          'modal-message',
          'You entered an incorrect current password.Try again',
        );
      }
    } catch (error) {
      void error;
      openModal('modal-message', 'Something went wrong');
    }
  };

  const handleReset = (): void => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordValidError('');
    setNewPasswordValidError('');
    setConfirmPasswordValidError('');
  };

  return (
    <>
      <button
        type='button'
        onClick={() => openModal('password')}
        className='user-profile__password-button'
      >
        <p className='user-profile__password-button-label medium'>
          Change Password
        </p>
      </button>

      {modalActive && (
        <Modal
          active={modalActive}
          setActive={setModalActive}
          onClose={handleReset}
        >
          {modalContent === 'password' && (
            <form
              className='user-profile__password-form'
              onSubmit={handlePasswordSubmit}
            >
              {passwordFields.map((field, index) => (
                <div
                  key={index}
                  className={`user-profile__password-field user-profile__password-field--${field.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <label
                    className='user-profile__password-label'
                    htmlFor={field.label}
                  >
                    {field.label}
                  </label>

                  <div className='user-profile__password-wrapper'>
                    <input
                      id={field.label}
                      type={field.show ? 'text' : 'password'}
                      value={field.value}
                      onChange={(event) => {
                        field.setValue(event.target.value);
                        field.setError(field.validate(event.target.value));
                      }}
                      required
                      className='user-profile__password-input'
                    />

                    <div
                      className='user-profile__password-toggle'
                      onClick={() => field.setShow(!field.show)}
                    >
                      {field.show ? (
                        <EyeOpen className='user-profile__password-toggle-icon' />
                      ) : (
                        <EyeClose className='user-profile__password-toggle-icon' />
                      )}
                    </div>
                  </div>

                  {field.error && (
                    <span className='user-profile__password-error extra-light'>
                      {field.error}
                    </span>
                  )}
                </div>
              ))}

              <div className='user-profile__password-button-wrapper'>
                <button type='submit'>
                  <span>Save Password</span>
                </button>
              </div>
            </form>
          )}
          {modalContent === 'modal-message' && (
            <div className='update-modal-message-container'>
              <div className='update-modal-message-text'>{modalMessage}</div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default UserPassword;
