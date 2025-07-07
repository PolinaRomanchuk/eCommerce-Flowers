import { type ChangeEvent, type ReactElement, useState } from 'react';
import type { UserProfile } from '../../types/user-profile';
import Modal from '../../utils/modal/modal';
import {
  addCustomerAddress,
  changeCustomerAddress,
  removeCustomerAddress,
  removeDefaultAddress,
  setDefaultAddress,
} from '../../services/customer-data/customer-data-service';
import type { Address } from '../../types/registration';
import {
  validateCity,
  validateCountry,
  validatePostalCode,
  validateStreet,
} from '../../utils/validate';

import { ReactComponent as Trash } from './../../assets/User/trash.svg';
import { ReactComponent as Pencil } from './../../assets/User/pencil.svg';
import { AddressForm } from './AddressForm';

type UserAddressesInfoProps = {
  userData: UserProfile;
  setProfile: (profile: UserProfile) => void;
};

export const UserAddressesInfo = ({
  userData,
  setProfile,
}: UserAddressesInfoProps): ReactElement => {
  const [modalActive, setModalActive] = useState(false);
  const [modalContent, setModalContent] = useState<
    'edit-address' | 'modal-message' | 'add-address' | null
  >(null);
  const openModal = (
    type: 'edit-address' | 'modal-message' | 'add-address',
    message?: string,
  ): void => {
    setModalContent(type);
    setModalActive(true);
    if (message) {
      setModalMessage(message);
    }
  };
  const [modalMessage, setModalMessage] = useState('');

  const [streetValidError, setStreetValidError] = useState('');
  const [cityValidError, setCityValidError] = useState('');
  const [postValidError, setPostValidError] = useState('');
  const [countryValidError, setCountryValidError] = useState('');

  const [newAddress, setNewAddress] = useState<
    Address & { isDefaultShipping: boolean; isDefaultBilling: boolean }
  >({
    id: '',
    streetName: '',
    city: '',
    postalCode: '',
    country: '',
    isDefaultShipping: false,
    isDefaultBilling: false,
  });

  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<Address>({
    id: '',
    streetName: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const handleAddFormSubmit = async (): Promise<void> => {
    if (!userData) {
      return;
    }

    if (
      streetValidError !== '' ||
      cityValidError !== '' ||
      postValidError !== '' ||
      countryValidError !== ''
    ) {
      return;
    }
    try {
      let updated = await addCustomerAddress(userData.version, {
        id: '',
        streetName: newAddress.streetName,
        city: newAddress.city,
        postalCode: newAddress.postalCode,
        country: newAddress.country,
      });
      const added = updated.addresses[updated.addresses.length - 1];
      if (newAddress.isDefaultShipping) {
        updated = await setDefaultAddress(
          updated.version,
          added.id,
          'Shipping',
        );
      }
      if (newAddress.isDefaultBilling) {
        updated = await setDefaultAddress(updated.version, added.id, 'Billing');
      }

      setProfile(updated);
      openModal('modal-message', 'Your address has been added successfully!');
      setNewAddress({
        id: '',
        streetName: '',
        city: '',
        postalCode: '',
        country: '',
        isDefaultShipping: false,
        isDefaultBilling: false,
      });
    } catch (error) {
      void error;
      openModal('modal-message', 'Something went wrong');
    }
  };

  const handleAddFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value, type } = event.target;
    const isCheckbox = type === 'checkbox';
    const checked = isCheckbox
      ? (event.target as HTMLInputElement).checked
      : undefined;

    setNewAddress((previous) => ({
      ...previous,
      [name]: isCheckbox ? checked : value,
    }));
  };

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof Address,
  ): void => {
    const { value } = event.target;
    setEditingValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSetDefaultAddress = async (
    addressId: string,
    addressType: string,
  ): Promise<void> => {
    if (!userData) {
      return;
    }
    try {
      const updated = await setDefaultAddress(
        userData.version,
        addressId,
        addressType,
      );
      setProfile(updated);
    } catch (error) {
      void error;
      openModal('modal-message', 'Something went wrong');
    }
  };

  const handleRemoveDefaultAddress = async (
    addressId: string,
    addressType: string,
  ): Promise<void> => {
    if (!userData) {
      return;
    }
    try {
      const updated = await removeDefaultAddress(
        userData.version,
        addressId,
        addressType,
      );
      setProfile(updated);
    } catch (error) {
      void error;
      openModal('modal-message', 'Something went wrong');
    }
  };

  const handleEditSave = async (): Promise<void> => {
    if (!userData || !editingAddressId) {
      return;
    }

    if (
      streetValidError !== '' ||
      cityValidError !== '' ||
      postValidError !== '' ||
      countryValidError !== ''
    ) {
      return;
    }
    try {
      const updated = await changeCustomerAddress(
        userData.version,
        editingAddressId,
        editingValues,
      );
      setProfile(updated);
      setEditingAddressId(null);
      openModal('modal-message', 'Your data has been updated successfully!');
    } catch (error) {
      void error;
      openModal('modal-message', 'Something went wrong');
    }
  };

  const handleRemoveAddress = async (addressId: string): Promise<void> => {
    if (!userData) {
      return;
    }
    try {
      const updated = await removeCustomerAddress(userData.version, addressId);
      setProfile(updated);
    } catch (error) {
      void error;
      openModal('modal-message', 'Something went wrong');
    }
  };

  const handleEditClick = (addr: Address): void => {
    setEditingAddressId(addr.id);
    setEditingValues(addr);
  };

  const handleReset = (): void => {
    setStreetValidError('');
    setCityValidError('');
    setPostValidError('');
    setCountryValidError('');
    setEditingAddressId(null);
    setEditingValues({
      id: '',
      streetName: '',
      city: '',
      postalCode: '',
      country: '',
    });
    setNewAddress({
      id: '',
      streetName: '',
      city: '',
      postalCode: '',
      country: '',
      isDefaultShipping: false,
      isDefaultBilling: false,
    });
  };

  return (
    <>
      <div className='user-profile__section'>
        <h2 className='user-profile__title'>Manage Addresses</h2>

        <ul className='user-profile__summary'>
          {userData.addresses.map((addr) => (
            <li key={addr.id} className='user-profile__summary-item'>
              <div className='user-profile__address-text-container'>
                <div className='user-profile__address-text'>
                  {addr.streetName}, {addr.city}, {addr.postalCode},
                  {addr.country}
                </div>
                {userData.defaultShippingAddressId === addr.id && (
                  <p className='user-profile__tag'>Default Shipping</p>
                )}
                {userData.defaultBillingAddressId === addr.id && (
                  <p className='user-profile__tag'>Default Billing</p>
                )}
              </div>
              <div className='user-profile__actions'>
                <button
                  type='button'
                  className='user-profile__action-btn'
                  onClick={() => {
                    openModal('edit-address');
                    handleEditClick(addr);
                  }}
                >
                  <Pencil className='user-profile__icon' />
                </button>
                <button
                  type='button'
                  className='user-profile__action-btn'
                  onClick={() => handleRemoveAddress(addr.id)}
                >
                  <Trash className='user-profile__icon' />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className='user-profile__button-container'>
          <button type='button' onClick={() => openModal('add-address')}>
            <span>Add Address</span>
          </button>
        </div>
      </div>
      {modalActive && (
        <Modal
          active={modalActive}
          setActive={setModalActive}
          onClose={handleReset}
        >
          {(modalContent === 'edit-address' ||
            modalContent === 'add-address') && (
            <div className='user-modal__container'>
              <AddressForm
                values={
                  modalContent === 'edit-address' ? editingValues : newAddress
                }
                errors={{
                  streetName: streetValidError,
                  city: cityValidError,
                  postalCode: postValidError,
                  country: countryValidError,
                }}
                onChange={(
                  event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
                ) => {
                  const value = event.target.value;
                  const name = event.target.name;

                  if (modalContent === 'edit-address') {
                    handleEditChange(event, name as keyof Address);
                  } else {
                    handleAddFormChange(event);
                  }

                  if (name === 'streetName') {
                    setStreetValidError(validateStreet(value));
                  } else if (name === 'city') {
                    setCityValidError(validateCity(value));
                  } else if (name === 'postalCode') {
                    const country =
                      modalContent === 'edit-address'
                        ? editingValues.country
                        : newAddress.country;
                    setPostValidError(validatePostalCode(value, country));
                  } else if (name === 'country') {
                    setCountryValidError(validateCountry(value));
                  }
                }}
                onSubmit={
                  modalContent === 'edit-address'
                    ? handleEditSave
                    : handleAddFormSubmit
                }
                isDefaultShipping={
                  modalContent === 'edit-address'
                    ? userData.defaultShippingAddressId === editingAddressId
                    : newAddress.isDefaultShipping
                }
                isDefaultBilling={
                  modalContent === 'edit-address'
                    ? userData.defaultBillingAddressId === editingAddressId
                    : newAddress.isDefaultBilling
                }
                onToggleShipping={() => {
                  if (!editingAddressId) {
                    return;
                  }
                  if (modalContent === 'edit-address') {
                    if (
                      userData.defaultShippingAddressId !== editingAddressId
                    ) {
                      handleSetDefaultAddress(editingAddressId, 'Shipping');
                    } else {
                      handleRemoveDefaultAddress(editingAddressId, 'Shipping');
                    }
                  } else {
                    setNewAddress((previous) => ({
                      ...previous,
                      isDefaultShipping: !previous.isDefaultShipping,
                    }));
                  }
                }}
                onToggleBilling={() => {
                  if (!editingAddressId) {
                    return;
                  }
                  if (modalContent === 'edit-address') {
                    if (userData.defaultBillingAddressId !== editingAddressId) {
                      handleSetDefaultAddress(editingAddressId, 'Billing');
                    } else {
                      handleRemoveDefaultAddress(editingAddressId, 'Billing');
                    }
                  } else {
                    setNewAddress((previous) => ({
                      ...previous,
                      isDefaultBilling: !previous.isDefaultBilling,
                    }));
                  }
                }}
                buttonText={modalContent === 'edit-address' ? 'Save' : 'Add'}
              />
            </div>
          )}

          {modalContent === 'modal-message' && (
            <div className='user-modal__message'>{modalMessage}</div>
          )}
        </Modal>
      )}
    </>
  );
};

export default UserAddressesInfo;
