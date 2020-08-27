import gunr from './mailgun';
import { IMailgunConfig, Gunr } from './types';

let instance: Gunr<'signup' | 'reset' | 'newsletter' | 'invoice' | 'receipt' | 'chargefail' | 'overdue' | 'disconnect1' | 'disconnect2' | 'disconnect3'>;

export function getInstance(apiKey?: string | IMailgunConfig, apiDomain?: string) {
  if (!instance)
    instance = gunr(apiKey, apiDomain);
  return instance;
}

export default getInstance();