import { type FormEvent, type ReactElement, useState } from 'react';
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

  const handleAddFormSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
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
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value, type, checked } = event.target;
    setNewAddress((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement>,
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
      <div className='address-management'>
        <h2>Manage Addresses</h2>

        <ul className='address-management__list'>
          {userData.addresses.map((addr) => (
            <li key={addr.id} className='address-management__item'>
              <div className='address-management__details'>
                <div className='address'>
                  {addr.streetName}, {addr.city}, {addr.postalCode},
                  {addr.country}
                </div>
                {userData.defaultShippingAddressId === addr.id && (
                  <p className='tag extra-light'>Default Shipping</p>
                )}
                {userData.defaultBillingAddressId === addr.id && (
                  <p className='tag extra-light'>Default Billing</p>
                )}
              </div>
              <div className='address-management__actions'>
                <button
                  type='button'
                  className='action-btn'
                  onClick={() => {
                    openModal('edit-address');
                    handleEditClick(addr);
                  }}
                >
                  <Pencil className='icon' />
                </button>
                <button
                  type='button'
                  className='action-btn'
                  onClick={() => handleRemoveAddress(addr.id)}
                >
                  <Trash className='icon' />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className='button_container'>
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
          {modalContent === 'edit-address' && (
            <div className='edit-address-modal-container'>
              <div className='address-management__edit-form'>
                <label className='street-label'>
                  Street
                  <input
                    value={editingValues.streetName}
                    onChange={(event) => {
                      handleEditChange(event, 'streetName');
                      setStreetValidError(validateStreet(event.target.value));
                    }}
                  />
                  {streetValidError && (
                    <span className='street input-validation-span'>
                      {streetValidError}
                    </span>
                  )}
                </label>
                <label className='city-label'>
                  City
                  <input
                    value={editingValues.city}
                    onChange={(event) => {
                      handleEditChange(event, 'city');
                      setCityValidError(validateCity(event.target.value));
                    }}
                  />
                  {cityValidError && (
                    <span className='city input-validation-span'>
                      {cityValidError}
                    </span>
                  )}
                </label>
                <label className='postal-code-label'>
                  Postal Code
                  <input
                    value={editingValues.postalCode}
                    onChange={(event) => {
                      handleEditChange(event, 'postalCode');
                      setPostValidError(
                        validatePostalCode(
                          event.target.value,
                          editingValues.country,
                        ),
                      );
                    }}
                  />
                  {postValidError && (
                    <span className='postalCode input-validation-span'>
                      {postValidError}
                    </span>
                  )}
                </label>
                <label className='country-label'>
                  Country
                  <input
                    value={editingValues.country}
                    onChange={(event) => {
                      handleEditChange(event, 'country');
                      setCountryValidError(validateCountry(event.target.value));
                    }}
                  />
                  {countryValidError && (
                    <span className='country input-validation-span'>
                      {countryValidError}
                    </span>
                  )}
                </label>
                <label className='check-box-default-address'>
                  <span> Set as default shipping address</span>
                  <input
                    type='checkbox'
                    name='defaultShipping'
                    checked={
                      userData.defaultShippingAddressId === editingAddressId
                    }
                    onChange={() => {
                      if (
                        userData.defaultShippingAddressId !==
                          editingAddressId &&
                        editingAddressId
                      ) {
                        handleSetDefaultAddress(editingAddressId, 'Shipping');
                      } else {
                        if (editingAddressId) {
                          handleRemoveDefaultAddress(
                            editingAddressId,
                            'Shipping',
                          );
                        }
                      }
                    }}
                  />
                </label>
                <label className='check-box-default-address'>
                  <span> Set as default billing address</span>
                  <input
                    type='checkbox'
                    name='defaultBilling'
                    checked={
                      userData.defaultBillingAddressId === editingAddressId
                    }
                    onChange={() => {
                      if (
                        userData.defaultBillingAddressId !== editingAddressId &&
                        editingAddressId
                      ) {
                        handleSetDefaultAddress(editingAddressId, 'Billing');
                      } else {
                        if (editingAddressId) {
                          handleRemoveDefaultAddress(
                            editingAddressId,
                            'Billing',
                          );
                        }
                      }
                    }}
                  />
                </label>
                <button type='button' onClick={handleEditSave}>
                  Save
                </button>
              </div>
            </div>
          )}

          {modalContent === 'add-address' && (
            <div className='add-address-modal-container'>
              <div className='address-management__add-form'>
                <label className='street-label'>
                  Street
                  <input
                    name='streetName'
                    value={newAddress.streetName}
                    onChange={(event) => {
                      handleAddFormChange(event);
                      setStreetValidError(validateStreet(event.target.value));
                    }}
                  />
                  {streetValidError && (
                    <span className='street input-validation-span'>
                      {streetValidError}
                    </span>
                  )}
                </label>
                <label className='city-label'>
                  City
                  <input
                    name='city'
                    value={newAddress.city}
                    onChange={(event) => {
                      handleAddFormChange(event);
                      setCityValidError(validateCity(event.target.value));
                    }}
                  />
                  {cityValidError && (
                    <span className='city input-validation-span'>
                      {cityValidError}
                    </span>
                  )}
                </label>
                <label className='postal-code-label'>
                  Postal Code
                  <input
                    name='postalCode'
                    value={newAddress.postalCode}
                    onChange={(event) => {
                      handleAddFormChange(event);
                      setPostValidError(
                        validatePostalCode(
                          event.target.value,
                          newAddress.country,
                        ),
                      );
                    }}
                  />
                  {postValidError && (
                    <span className='postalCode input-validation-span'>
                      {postValidError}
                    </span>
                  )}
                </label>
                <label className='country-label'>
                  Country
                  <input
                    name='country'
                    value={newAddress.country}
                    onChange={(event) => {
                      handleAddFormChange(event);
                      setCountryValidError(validateCountry(event.target.value));
                    }}
                  />
                  {countryValidError && (
                    <span className='country input-validation-span'>
                      {countryValidError}
                    </span>
                  )}
                </label>
                <label className='check-box-default-address'>
                  <span> Set as default shipping address</span>
                  <input
                    type='checkbox'
                    name='isDefaultShipping'
                    checked={newAddress.isDefaultShipping}
                    onChange={handleAddFormChange}
                  />
                </label>
                <label className='check-box-default-address'>
                  <span> Set as default billing address</span>
                  <input
                    type='checkbox'
                    name='isDefaultBilling'
                    checked={newAddress.isDefaultBilling}
                    onChange={handleAddFormChange}
                  />
                </label>
                <button type='button' onClick={handleAddFormSubmit}>
                  Add
                </button>
              </div>
            </div>
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

export default UserAddressesInfo;
