/*!
 * Copyright (c) 2015-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 
 * See the License for the specific language governing permissions and limitations under the License.
 */


import { StorageManager } from '../StorageManager';
import { CustomUrls } from './OktaAuthOptions';
import { FlowIdentifier, IdxTransactionMeta } from '../idx/types';

export interface TransactionManagerOptions {
  storageManager?: StorageManager;
  enableSharedStorage?: boolean; // default true
  saveNonceCookie?: boolean; // default true
  saveStateCookie?: boolean; // default true
  saveParamsCookie?: boolean; // default true
  saveLastResponse?: boolean; // default true
}

export interface TransactionMetaOptions {
  muteWarning?: boolean;
  state?: string;
  flow?: FlowIdentifier;
  codeVerifier?: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
  activationToken?: string;
  recoveryToken?: string;
}

// formerly known as "Redirect OAuth Params"
export interface OAuthTransactionMeta {
  issuer: string;
  redirectUri: string;
  state: string;
  nonce: string;
  responseType: string | string [];
  responseMode?: string;
  scopes: string[];
  clientId: string;
  urls: CustomUrls;
  ignoreSignature: boolean;
  originalUri?: string;
}

export interface PKCETransactionMeta extends OAuthTransactionMeta {
  codeVerifier: string;
  codeChallengeMethod: string;
  codeChallenge: string;
}

export type CustomAuthTransactionMeta = Record<string, string | undefined>;

export type TransactionMeta =
  IdxTransactionMeta |
  PKCETransactionMeta |
  OAuthTransactionMeta |
  CustomAuthTransactionMeta;

function isObjectWithProperties(obj) {
  if (!obj || typeof obj !== 'object' || Object.values(obj).length === 0) {
    return false;
  }
  return true;
}

export function isOAuthTransactionMeta(obj: any): obj is OAuthTransactionMeta {
  if (!isObjectWithProperties(obj)) {
    return false;
  }
  return !!obj.redirectUri || !!obj.responseType;
}

export function isPKCETransactionMeta(obj: any): obj is PKCETransactionMeta {
  if (!isOAuthTransactionMeta(obj)) {
    return false;
  }
  return !!(obj as any).codeVerifier;
}

export function isIdxTransactionMeta(obj: any): obj is IdxTransactionMeta {
  if (!isPKCETransactionMeta(obj)) {
    return false;
  }
  return !!(obj as any).interactionHandle;
}

export function isCustomAuthTransactionMeta(obj: any): obj is CustomAuthTransactionMeta {
  if (!isObjectWithProperties(obj)) {
    return false;
  }
  const isAllStringValues = Object.values(obj).find((value) => (typeof value !== 'string')) === undefined;
  return isAllStringValues;
}

export function isTransactionMeta(obj: any): obj is TransactionMeta {
  if (isOAuthTransactionMeta(obj) || isCustomAuthTransactionMeta(obj)) {
    return true;
  }
  return false;
}
