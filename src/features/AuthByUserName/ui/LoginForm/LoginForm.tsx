import React, { useCallback } from 'react';
import { Button, Input, Typography } from 'shared';
import { classNames, DynamicComponent, useAppDispatch } from 'app';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { authActions, authByUserNameReducer, authByUserNameThunk, getError, getIsLoading } from '../../config';
import cls from './LoginForm.module.scss';
import { LoginFormProps, LoginFormTypes } from './LoginForm.types';

const LoginForm = ({ onClose }: LoginFormProps) => {
  const { t } = useTranslation();
  const { handleSubmit, control } = useForm<LoginFormTypes>();
  const dispatch = useAppDispatch();
  const error = useSelector(getError);
  const isLoading = useSelector(getIsLoading);

  const onSubmit = useCallback(
    async (data: LoginFormTypes) => {
      dispatch(
        authActions.setUserData({
          username: data.username,
          password: data.password,
        })
      );
      const res = await dispatch(authByUserNameThunk({ username: data.username, password: data.password }));
      if (res?.meta?.requestStatus === 'fulfilled') {
        onClose();
      }
    },
    [dispatch, onClose]
  );

  return (
    <DynamicComponent shouldRemoveAfterUnmount reducers={{ login: authByUserNameReducer }}>
      <form className={classNames(cls.form)} onSubmit={handleSubmit(onSubmit)}>
        <div className={classNames(cls.inputsWrapper)}>
          <Controller
            name='username'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <Input
                data-testid='usernameInputId'
                fullWidth
                className='mb10'
                placeholder={t('userNameLogin')}
                {...field}
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <Input
                type='password'
                data-testid='passwordInputId'
                fullWidth
                placeholder={t('userNamePassword')}
                {...field}
              />
            )}
          />
        </div>
        {error ? <Typography error>{error}</Typography> : null}
        <div className={classNames(cls.btnWrapper)}>
          <Button disabled={isLoading} data-testid='saveBtnId' theme='contained' type='submit'>
            {t('save')}
          </Button>
          <Button data-testid='closeBtnId' theme='contained' onClick={onClose}>
            {t('close')}
          </Button>
        </div>
      </form>
    </DynamicComponent>
  );
};

export default LoginForm;
