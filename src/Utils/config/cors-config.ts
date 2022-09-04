import configuration from './configuration';

const { ssl, port, domain } = configuration().server;

const whitelistAddress = [
  `${ssl ? 'https://' : 'http://'}admin.${domain}:${port}`,
  `${ssl ? 'https://' : 'http://'}register.${domain}:${port}`,
  `${ssl ? 'https://' : 'http://'}${domain}:${port}`,
];
const whitelistMethod = [`GET`, 'PUT', 'POST', 'PATCH', 'DELETE'];

export const whitelistCors = {
  address: whitelistAddress,
  methods: whitelistMethod,
};
