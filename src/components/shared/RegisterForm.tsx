// react
import React, { useMemo } from 'react';
// third-party
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
// application
import { useDetachableForm } from '~/services/hooks';
import { validateEmail } from '~/services/validators';

export interface IRegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  namespace?: string;
  disabled?: boolean;
  idPrefix?: string;
}

export function getRegisterFormDefaultValue(initialData: IRegisterForm | null = null): IRegisterForm {
  return {
    email: '',
    password: '',
    confirmPassword: '',
    ...initialData,
  };
}

function RegisterForm(props: Props) {
  const { namespace, disabled, idPrefix } = props;
  const intl = useIntl();

  // ✅ ใส่ generic ให้ชัด
  const formMethods = useFormContext<IRegisterForm>();
  const { getValues, getFieldState, formState } = formMethods;

  const fieldId = idPrefix ? `${idPrefix}-` : '';
  const ns = useMemo(() => (namespace ? `${namespace}.` : ''), [namespace]);
  const register = useDetachableForm(formMethods, disabled || false);

  // ✅ ใช้ getFieldState แทน errors?.field
  // หมายเหตุ: เมื่อมี namespace ชนิด literal จะไม่ตรง type ของ RHF เลย cast เป็น any เพื่อ TS เงียบ
  const emailState = getFieldState(`${ns}email` as any, formState);
  const passwordState = getFieldState(`${ns}password` as any, formState);
  const confirmPasswordState = getFieldState(`${ns}confirmPassword` as any, formState);

  return (
    <>
      <div className="form-group">
        <label htmlFor={`${fieldId}email`}>
          <FormattedMessage id="INPUT_EMAIL_ADDRESS_LABEL" />
        </label>
        <input
          type="text"
          id={`${fieldId}email`}
          className={classNames('form-control', { 'is-invalid': !!emailState.error })}
          disabled={disabled}
          placeholder={intl.formatMessage({ id: 'INPUT_EMAIL_ADDRESS_PLACEHOLDER' })}
          {...register(`${ns}email` as any, { required: true, validate: { email: validateEmail } })}
        />
        <div className="invalid-feedback">
          {emailState.error?.type === 'required' && <FormattedMessage id="ERROR_FORM_REQUIRED" />}
          {emailState.error?.type === 'email' && <FormattedMessage id="ERROR_FORM_INCORRECT_EMAIL" />}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={`${fieldId}password`}>
          <FormattedMessage id="INPUT_PASSWORD_LABEL" />
        </label>
        <input
          type="password"
          id={`${fieldId}password`}
          className={classNames('form-control', { 'is-invalid': !!passwordState.error })}
          disabled={disabled}
          placeholder={intl.formatMessage({ id: 'INPUT_PASSWORD_PLACEHOLDER' })}
          {...register(`${ns}password` as any, { required: true })}
        />
        <div className="invalid-feedback">
          {passwordState.error?.type === 'required' && <FormattedMessage id="ERROR_FORM_REQUIRED" />}
        </div>
      </div>

      <div className="form-group mb-0">
        <label htmlFor={`${fieldId}confirm-password`}>
          <FormattedMessage id="INPUT_PASSWORD_REPEAT_LABEL" />
        </label>
        <input
          type="password"
          id={`${fieldId}confirm-password`}
          className={classNames('form-control', { 'is-invalid': !!confirmPasswordState.error })}
          disabled={disabled}
          placeholder={intl.formatMessage({ id: 'INPUT_PASSWORD_REPEAT_PLACEHOLDER' })}
          {...register(`${ns}confirmPassword` as any, {
            required: true,
            validate: {
              match: (value) => value === getValues(`${ns}password` as any),
            },
          })}
        />
        <div className="invalid-feedback">
          {confirmPasswordState.error?.type === 'required' && <FormattedMessage id="ERROR_FORM_REQUIRED" />}
          {confirmPasswordState.error?.type === 'match' && (
            <FormattedMessage id="ERROR_FORM_PASSWORD_DOES_NOT_MATCH" />
          )}
        </div>
      </div>
    </>
  );
}

export default RegisterForm;
