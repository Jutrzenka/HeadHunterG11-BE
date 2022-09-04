import configuration from '../../Utils/config/configuration';

export const employStudentByHrEmailTemplate = (
  studentId: string,
  hr: string,
) => {
  const { ssl, domain, port } = configuration().server;
  return `
  <h1>Zatrudnienie</h1>
  <h2>Kursant o ID: ${studentId}, został zatrudniony przez ${hr}</h2>
    `;
};
