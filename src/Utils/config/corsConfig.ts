import configuration from './configuration';

const { ssl, port, domain } = configuration().server;

const whitelistAddress = [
  `${ssl}admin.${domain}:${port}`,
  `${ssl}register.${domain}:${port}`,
  `${ssl}${domain}:${port}`,
];
const whitelistMethod = [`GET`, 'PUT', 'POST', 'PATH'];

export const whitelistCors = {
  address: whitelistAddress,
  methods: whitelistMethod,
};
