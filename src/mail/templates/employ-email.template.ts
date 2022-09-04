import configuration from '../../Utils/config/configuration';

export const employEmailTemplate = (studentId: string) => {
  const { ssl, domain, port } = configuration().server;
  return `
  <h1>Zatrudnienie</h1>
  <h2>Kursant o ID: ${studentId}, znalazł zatrudnienie</h2>
    `;
};
