import gunr from './mailgun';
import { IMailgunConfig, Gunr } from './types';

let instance: Gunr<'signup' | 'reset' | 'newsletter' | 'invoice' | 'receipt' | 'chargefail'>;

export function getInstance(apiKey?: string | IMailgunConfig, apiDomain?: string) {
  if (!instance)
    instance = gunr(apiKey, apiDomain);
  return instance;
}

export default getInstance();