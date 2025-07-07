import type { ReactElement } from 'react';
import type { Address } from '../../types/registration';

export const AddressForm = ({
  values,
  errors,
  onChange,
  onSubmit,
  isDefaultShipping,
  isDefaultBilling,
  onToggleShipping,
  onToggleBilling,
  buttonText,
}: {
  values: Address;
  errors: Record<string, string>;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSubmit: () => void;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
  onToggleShipping?: () => void;
  onToggleBilling?: () => void;
  buttonText: string;
}): ReactElement => {
  return (
    <div className='address-management__form'>
      <label htmlFor='streetName'>
        Street
        <input
          id='streetName'
          name='streetName'
          value={values.streetName}
          onChange={onChange}
        />
        {errors.streetName && (
          <span className='address-management__form-error'>
            {errors.streetName}
          </span>
        )}
      </label>

      <label>
        City
        <input name='city' value={values.city} onChange={onChange} />
        {errors.city && (
          <span className='address-management__form-error'>{errors.city}</span>
        )}
      </label>

      <label>
        Postal Code
        <input
          name='postalCode'
          value={values.postalCode}
          onChange={onChange}
        />
        {errors.postalCode && (
          <span className='address-management__form-error'>
            {errors.postalCode}
          </span>
        )}
      </label>

      <label>
        Country
        <select name='country' value={values.country} onChange={onChange}>
          <option value=''>Select country</option>
          <option value='BY'>Belarus</option>
          <option value='PL'>Poland</option>
          <option value='GE'>Georgia</option>
        </select>
        {errors.country && (
          <span className='address-management__form-error'>
            {errors.country}
          </span>
        )}
      </label>

      {onToggleShipping && (
        <div className='address-management__checkbox'>
          <label className='address-management__checkbox-label'>
            Set as default shipping address
          </label>
          <input
            type='checkbox'
            checked={isDefaultShipping}
            onChange={onToggleShipping}
            className='address-management__checkbox-input'
          />
        </div>
      )}

      {onToggleBilling && (
        <div className='address-management__checkbox'>
          <label className='address-management__checkbox-label'>
            Set as default billing address
          </label>
          <input
            type='checkbox'
            checked={isDefaultBilling}
            onChange={onToggleBilling}
            className='address-management__checkbox-input'
          />
        </div>
      )}

      <div className='address-management__submit'>
        <button type='button' onClick={onSubmit}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};
