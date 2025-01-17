import { sendRequest } from './request';
import { 
  IAPIFunction,
  BaseTransaction, 
  PhoneTransaction
} from './types';

/**
 * @scope: okta.myaccount.phone.read
 */
export const getPhones: IAPIFunction<PhoneTransaction[]> = async (
  oktaAuth,
  options?
) => {
  const transaction = await sendRequest(oktaAuth, {
    url: '/idp/myaccount/phones',
    method: 'GET',
    accessToken: options?.accessToken,
    transactionClassName: 'PhoneTransaction'
  }) as PhoneTransaction[];
  return transaction;
};

/**
 * @scope: okta.myaccount.phone.read
 */
export const getPhone: IAPIFunction<PhoneTransaction> = async (
  oktaAuth,
  options
) => {
  const { accessToken, id } = options!;
  const transaction = await sendRequest(oktaAuth, {
    url: `/idp/myaccount/phones/${id}`,
    method: 'GET',
    accessToken,
    transactionClassName: 'PhoneTransaction'
  }) as PhoneTransaction;
  return transaction;
};

/**
 * @scope: okta.myaccount.phone.manage
 */
export const addPhone: IAPIFunction<PhoneTransaction> = async (
  oktaAuth, 
  options
): Promise<PhoneTransaction> => {
  const { accessToken, payload } = options!;
  const transaction = await sendRequest(oktaAuth, {
    url: '/idp/myaccount/phones',
    method: 'POST',
    payload,
    accessToken,
    transactionClassName: 'PhoneTransaction'
  }) as PhoneTransaction;
  return transaction;
};

/**
 * @scope: okta.myaccount.phone.manage
 */
export const deletePhone: IAPIFunction<BaseTransaction> = async (
  oktaAuth, 
  options
) => {
  const { id, accessToken } = options!;
  const transaction = await sendRequest(oktaAuth, {
    url: `/idp/myaccount/phones/${id}`,
    method: 'DELETE',
    accessToken,
  }) as BaseTransaction;
  return transaction;
};

/**
 * @scope: okta.myaccount.phone.manage
 */
export const sendPhoneChallenge: IAPIFunction<BaseTransaction> = async (
  oktaAuth, 
  options
) => {
  const { accessToken, id, payload } = options!;
  const transaction = await sendRequest(oktaAuth, {
    url: `/idp/myaccount/phones/${id}/challenge`,
    method: 'POST',
    payload,
    accessToken
  }) as BaseTransaction;
  return transaction;
};

/**
 * @scope: okta.myaccount.phone.manage
 */
export const verifyPhoneChallenge: IAPIFunction<BaseTransaction> = async (
  oktaAuth,
  options
) => {
  const { id, payload, accessToken } = options!;
  const transaction = await sendRequest(oktaAuth, {
    url: `/idp/myaccount/phones/${id}/verify`,
    method: 'POST',
    payload,
    accessToken
  }) as BaseTransaction;
  return transaction;
};
