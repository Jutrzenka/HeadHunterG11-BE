import configuration from '../../Utils/config/configuration';
import * as striptags from 'striptags';

export const editEmailTemplate = (login: string, registerCode: string) => {
  const { ssl, domain, port } = configuration().server;
  return `
  <h1>HeadHunter MegaK</h1>
  <h2>Email na Twoim koncie został zmieniony. Wejdź w poniższy link, aby dokończyć zmianę.</h2>
  <p>Twój link aktywacyjny do platformy HeadHunter MegaK:</p>
  <a href="${
    ssl ? 'https://' : 'http://'
  }register.${domain}:${port}/api/auth/register/${login}/${registerCode}">
  KLIKNIJ TUTAJ
</a>
  <p>Lub wejdź na ten adres: ${
    ssl ? 'https://' : 'http://'
  }register.${domain}:${port}/api/auth/register/${striptags(
    login,
  )}/${registerCode}</p>
    `;
};
