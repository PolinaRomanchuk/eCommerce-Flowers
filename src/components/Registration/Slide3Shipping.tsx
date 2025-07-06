import { ErrorMessage, Field } from 'formik';

const Slide3Shipping = (): React.ReactElement => {
  return (
    <div className='registration__slide'>
      <div className='registration__slide-data registration__slide-data--shipping'>
        <fieldset className='registration__fieldset'>
          <p className='registration__fieldset-title'>Shipping Address</p>
          <div className='registration__slide__field-group'>
            <div className='registration__slide__field'>
              <label
                htmlFor='shippingAddress.country'
                className='registration__slide__label'
              >
                Country
              </label>

              <Field
                id='shippingAddress.country'
                name='shippingAddress.country'
                as='select'
                required
                className='registration__slide__input registration__slide__input--select'
              >
                <option value=''>Select a country</option>
                <option value='BY'>Belarus</option>
                <option value='GE'>Georgia</option>
                <option value='PL'>Poland</option>
              </Field>
              <ErrorMessage
                name='shippingAddress.country'
                component='p'
                className='registration__slide__error extra-light'
              />
            </div>

            <div className='registration__slide__field'>
              <label
                htmlFor='shippingAddress.city'
                className='registration__slide__label'
              >
                City
              </label>
              <Field
                id='shippingAddress.city'
                name='shippingAddress.city'
                type='text'
                required
                className='registration__slide__input'
              />
              <ErrorMessage
                name='shippingAddress.city'
                component='p'
                className='registration__slide__error extra-light'
              />
            </div>
          </div>

          <div className='registration__slide__field-group'>
            <div className='registration__slide__field'>
              <label
                htmlFor='shippingAddress.postalCode'
                className='registration__slide__label'
              >
                Postal Code
              </label>

              <Field
                id='shippingAddress.postalCode'
                name='shippingAddress.postalCode'
                type='text'
                required
                className='registration__slide__input'
              />
              <ErrorMessage
                name='shippingAddress.postalCode'
                component='p'
                className='registration__slide__error extra-light'
              />
            </div>
            <div className='registration__slide__field'>
              <label
                htmlFor='shippingAddress.streetName'
                className='registration__slide__label'
              >
                Street
              </label>
              <Field
                id='shippingAddress.streetName'
                name='shippingAddress.streetName'
                type='text'
                required
                className='registration__slide__input'
              />
              <ErrorMessage
                name='shippingAddress.streetName'
                component='p'
                className='registration__slide__error extra-light'
              />
            </div>
          </div>
        </fieldset>
        <div className='registration__slide__field registration__slide__field--checkbox'>
          <Field
            id='defaultShippingAddress'
            type='checkbox'
            name='defaultShippingAddress'
            className='registration__slide__field--checkbox-input'
          />
          <label
            htmlFor='defaultShippingAddress'
            className='registration__slide__checkbox-label extra-light'
          >
            Set as default shipping address
          </label>
        </div>
      </div>
    </div>
  );
};

export default Slide3Shipping;
