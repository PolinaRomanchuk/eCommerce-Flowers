import { ErrorMessage, Field, useFormikContext } from 'formik';
import type { RegistrationValues } from '../../types/registration';

const Slide4Billing = (): React.ReactElement => {
  const { values } = useFormikContext<RegistrationValues>();

  return (
    <div className='registration__slide'>
      <div className='registration__slide-data registration__slide-data--billing'>
        <fieldset
          disabled={values.useSameAddress}
          className='registration__fieldset'
        >
          <p className='registration__fieldset-title'>Billing Address</p>
          <div className='registration__slide__field-group'>
            <div className='registration__slide__field'>
              <label
                htmlFor='billingAddress.country'
                className='registration__slide__label'
              >
                Country
              </label>

              <Field
                id='billingAddress.country'
                name='billingAddress.country'
                as='select'
                className='registration__slide__input registration__slide__input--select'
                required={!values.useSameAddress}
              >
                <option value=''>Select a country</option>
                <option value='BY'>Belarus</option>
                <option value='GE'>Georgia</option>
                <option value='PL'>Poland</option>
              </Field>
              <ErrorMessage
                name='billingAddress.country'
                component='p'
                className='registration__slide__error extra-light'
              />
            </div>

            <div className='registration__slide__field'>
              <label
                htmlFor='billingAddress.city'
                className='registration__slide__label'
              >
                City
              </label>
              <Field
                id='billingAddress.city'
                name='billingAddress.city'
                type='text'
                required={!values.useSameAddress}
                className='registration__slide__input'
              />
              <ErrorMessage
                name='billingAddress.city'
                component='p'
                className='registration__slide__error extra-light'
              />
            </div>
          </div>

          <div className='registration__slide__field-group'>
            <div className='registration__slide__field'>
              <label
                htmlFor='billingAddress.postalCode'
                className='registration__slide__label'
              >
                Postal Code
              </label>

              <Field
                id='billingAddress.postalCode'
                name='billingAddress.postalCode'
                type='text'
                required={!values.useSameAddress}
                className='registration__slide__input'
              />
              <ErrorMessage
                name='billingAddress.postalCode'
                component='p'
                className='registration__slide__error extra-light'
              />
            </div>
            <div className='registration__slide__field'>
              <label
                htmlFor='billingAddress.streetName'
                className='registration__slide__label'
              >
                Street
              </label>
              <Field
                id='billingAddress.streetName'
                name='billingAddress.streetName'
                type='text'
                required={!values.useSameAddress}
                className='registration__slide__input'
              />
              <ErrorMessage
                name='billingAddress.streetName'
                component='p'
                className='registration__slide__error extra-light'
              />
            </div>
          </div>
        </fieldset>

        <div className='registration__slide__field registration__slide__field--checkbox'>
          <Field
            id='useSameAddress'
            type='checkbox'
            name='useSameAddress'
            className='registration__slide__field--checkbox-input'
          />
          <label
            htmlFor='useSameAddress'
            className='registration__slide__checkbox-label extra-light'
          >
            Use same address for billing
          </label>
        </div>
        <div className='registration__slide__field registration__slide__field--checkbox'>
          <Field
            id='defaultBillingAddress'
            type='checkbox'
            name='defaultBillingAddress'
            className='registration__slide__field--checkbox-input'
          />
          <label
            htmlFor='defaultBillingAddress'
            className='registration__slide__checkbox-label extra-light'
          >
            Set as default billing address
          </label>
        </div>
      </div>
    </div>
  );
};

export default Slide4Billing;
