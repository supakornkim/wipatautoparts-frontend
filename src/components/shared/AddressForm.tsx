// react
import React, { useEffect, useMemo, useState } from 'react';
// third-party
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
// application
import { countriesApi } from '~/api';
import { ICountry } from '~/interfaces/country';
import { useDetachableForm } from '~/services/hooks';
import { validateEmail } from '~/services/validators';

export interface IAddressForm {
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  email: string;
  phone: string;
}

interface Props {
  namespace?: string; // ไม่ใช้ในกรณีนี้ แต่คงไว้ได้
  disabled?: boolean;
  idPrefix?: string;
}

export function getAddressFormDefaultValue(initialData: IAddressForm | null = null): IAddressForm {
  return {
    firstName: '',
    lastName: '',
    company: '',
    country: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    email: '',
    phone: '',
    ...initialData,
  };
}

function AddressForm(props: Props) {
  const { namespace, disabled, idPrefix } = props;
  const intl = useIntl();
  // ★ ใส่ generic ของฟอร์มให้ชัด
  const formMethods = useFormContext<IAddressForm>();
  const { register, getFieldState, formState } = formMethods;

  const fieldId = idPrefix ? `${idPrefix}-` : '';
  const ns = useMemo(() => (namespace ? `${namespace}.` : ''), [namespace]);
  // ★ helper สร้าง path field (รองรับ namespace ในอนาคต)
  const fieldName = <K extends keyof IAddressForm>(k: K) => `${ns}${k}` as const;

  const [countries, setCountries] = useState<ICountry[] | null>(null);
  const detachableRegister = useDetachableForm(formMethods, disabled || false);

  useEffect(() => {
    let canceled = false;
    countriesApi.getCountries().then((result) => {
      if (!canceled) setCountries(result);
    });
    return () => { canceled = true; };
  }, []);

  if (countries === null) return null;

  // ตัวอย่างการใช้ getFieldState
  const firstNameState = getFieldState(fieldName('firstName'), formState);
  const lastNameState = getFieldState(fieldName('lastName'), formState);
  const countryState = getFieldState(fieldName('country'), formState);
  const address1State = getFieldState(fieldName('address1'), formState);
  const cityState = getFieldState(fieldName('city'), formState);
  const stateState = getFieldState(fieldName('state'), formState);
  const postcodeState = getFieldState(fieldName('postcode'), formState);
  const emailState = getFieldState(fieldName('email'), formState);
  const phoneState = getFieldState(fieldName('phone'), formState);

  return (
    <>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor={`${fieldId}first-name`}>
            <FormattedMessage id="INPUT_FIRST_NAME_LABEL" />
          </label>
          <input
            type="text"
            id={`${fieldId}first-name`}
            className={classNames('form-control', { 'is-invalid': !!firstNameState.error })}
            disabled={disabled}
            placeholder={intl.formatMessage({ id: 'INPUT_FIRST_NAME_PLACEHOLDER' })}
            {...detachableRegister(fieldName('firstName'), { required: true })}
          />
          <div className="invalid-feedback">
            {firstNameState.error?.type === 'required' && <FormattedMessage id="ERROR_FORM_REQUIRED" />}
          </div>
        </div>

        <div className="form-group col-md-6">
          <label htmlFor={`${fieldId}last-name`}>
            <FormattedMessage id="INPUT_LAST_NAME_LABEL" />
          </label>
          <input
            type="text"
            id={`${fieldId}last-name`}
            className={classNames('form-control', { 'is-invalid': !!lastNameState.error })}
            disabled={disabled}
            placeholder={intl.formatMessage({ id: 'INPUT_LAST_NAME_PLACEHOLDER' })}
            {...detachableRegister(fieldName('lastName'), { required: true })}
          />
          <div className="invalid-feedback">
            {lastNameState.error?.type === 'required' && <FormattedMessage id="ERROR_FORM_REQUIRED" />}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={`${fieldId}company-name`}>
          <FormattedMessage id="INPUT_COMPANY_LABEL" />
          <span className="text-muted">{' ('}<FormattedMessage id="TEXT_OPTIONAL" />)</span>
        </label>
        <input
          type="text"
          id={`${fieldId}company-name`}
          className="form-control"
          disabled={disabled}
          placeholder={intl.formatMessage({ id: 'INPUT_COMPANY_PLACEHOLDER' })}
          {...detachableRegister(fieldName('company'))}
        />
      </div>

      <div className="form-group">
        <label htmlFor={`${fieldId}country`}>
          <FormattedMessage id="INPUT_COUNTRY_LABEL" />
        </label>
        <select
          id={`${fieldId}country`}
          className={classNames('form-control', { 'is-invalid': !!countryState.error })}
          disabled={disabled}
          {...detachableRegister(fieldName('country'), { required: true })}
        >
          <option value="">{intl.formatMessage({ id: 'INPUT_COUNTRY_PLACEHOLDER' })}</option>
          {countries?.map((c) => (
            <option key={c.code} value={c.code}>
              {intl.formatMessage({ id: `COUNTRY_NAME_${c.code}` })}
            </option>
          ))}
        </select>
        <div className="invalid-feedback">
          {countryState.error?.type === 'required' && <FormattedMessage id="ERROR_FORM_REQUIRED" />}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={`${fieldId}address1`}>
          <FormattedMessage id="INPUT_STREET_ADDRESS_LABEL" />
        </label>
        <input
          type="text"
          id={`${fieldId}address1`}
          className={classNames('form-control', { 'is-invalid': !!address1State.error })}
          disabled={disabled}
          placeholder={intl.formatMessage({ id: 'INPUT_STREET_ADDRESS_PLACEHOLDER_1' })}
          {...detachableRegister(fieldName('address1'), { required: true })}
        />
        <div className="invalid-feedback">
          {address1State.error?.type === 'required' && <FormattedMessage id="ERROR_FORM_REQUIRED" />}
        </div>

        <label htmlFor={`${fieldId}address2`} className="sr-only">
          <FormattedMessage id="INPUT_STREET_ADDRESS_LABEL" />
        </label>
        <input
          type="text"
          id={`${fieldId}address2`}
          className="form-control mt-2"
          disabled={disabled}
          placeholder={intl.formatMessage({ id: 'INPUT_STREET_ADDRESS_PLACEHOLDER_2' })}
          {...detachableRegister(fieldName('address2'))}
        />
      </div>

      <div className="form-group">
        <label htmlFor={`${fieldId}city`}>
          <FormattedMessage id="INPUT_CITY_LABEL" />
        </label>
        <input
          type="text"
          id={`${fieldId}city`}
          className={classNames('form-control', { 'is-invalid': !!cityState.error })}
          disabled={disabled}
          placeholder={intl.formatMessage({ id: 'INPUT_CITY_PLACEHOLDER' })}
          {...detachableRegister(fieldName('city'), { required: true })}
        />
        <div className="invalid-feedback">
          {cityState.error?.type === 'required' && <FormattedMessage id="ERROR_FORM_REQUIRED" />}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={`${fieldId}state`}>
          <FormattedMessage id="INPUT_STATE_LABEL" />
        </label>
        <input
          type="text"
          id={`${fieldId}state`}
          className={classNames('form-control', { 'is-invalid': !!stateState.error })}
          disabled={disabled}
          placeholder={intl.formatMessage({ id: 'INPUT_STATE_PLACEHOLDER' })}
          {...detachableRegister(fieldName('state'), { required: true })}
        />
        <div className="invalid-feedback">
          {stateState.error?.type === 'required' && <FormattedMessage id="ERROR_FORM_REQUIRED" />}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={`${fieldId}postcode`}>
          <FormattedMessage id="INPUT_POSTCODE_LABEL" />
        </label>
        <input
          type="text"
          id={`${fieldId}postcode`}
          className={classNames('form-control', { 'is-invalid': !!postcodeState.error })}
          disabled={disabled}
          placeholder={intl.formatMessage({ id: 'INPUT_POSTCODE_PLACEHOLDER' })}
          {...detachableRegister(fieldName('postcode'), { required: true })}
        />
        <div className="invalid-feedback">
          {postcodeState.error?.type === 'required' && <FormattedMessage id="ERROR_FORM_REQUIRED" />}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group col-md-6 mb-0">
          <label htmlFor={`${fieldId}email`}>
            <FormattedMessage id="INPUT_EMAIL_ADDRESS_LABEL" />
          </label>
          <input
            type="email"
            id={`${fieldId}email`}
            className={classNames('form-control', { 'is-invalid': !!emailState.error })}
            disabled={disabled}
            placeholder={intl.formatMessage({ id: 'INPUT_EMAIL_ADDRESS_PLACEHOLDER' })}
            {...detachableRegister(fieldName('email'), { required: true, validate: { email: validateEmail } })}
          />
          <div className="invalid-feedback">
            {emailState.error?.type === 'required' && <FormattedMessage id="ERROR_FORM_REQUIRED" />}
            {emailState.error?.type === 'email' && <FormattedMessage id="ERROR_FORM_INCORRECT_EMAIL" />}
          </div>
        </div>

        <div className="form-group col-md-6 mb-0">
          <label htmlFor={`${fieldId}phone`}>
            <FormattedMessage id="INPUT_PHONE_NUMBER_LABEL" />
          </label>
          <input
            type="text"
            id={`${fieldId}phone`}
            className={classNames('form-control', { 'is-invalid': !!phoneState.error })}
            disabled={disabled}
            placeholder={intl.formatMessage({ id: 'INPUT_PHONE_NUMBER_PLACEHOLDER' })}
            {...detachableRegister(fieldName('phone'), { required: true })}
          />
          <div className="invalid-feedback">
            {phoneState.error?.type === 'required' && <FormattedMessage id="ERROR_FORM_REQUIRED" />}
          </div>
        </div>
      </div>
    </>
  );
}

export default AddressForm;
