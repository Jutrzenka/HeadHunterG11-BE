import configuration from '../../Utils/config/configuration';
import * as striptags from 'striptags';

export const registerEmailTemplate = (login: string, registerCode: string) => {
  const { ssl, domain, port } = configuration().server;
  return `
  <h1>HeadHunter MegaK</h1>
  <p>Twój link aktywacyjny do platformy HeadHunter MegaK:</p>
  <a href="${
    ssl ? 'https://' : 'http://'
  }register.${domain}:${port}/students/${login}/${registerCode}">
  KLIKNIJ TUTAJ
  </a>
  <p>Lub wejdź na ten adres: ${
    ssl ? 'https://' : 'http://'
  }register.${domain}:${port}/students/${striptags(login)}/${registerCode}</p>
    `;
};
