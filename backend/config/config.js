
require('dotenv').config();

module.exports = {
  development: {
    username: 'neondb_owner',
    password: 'npg_ZDkSPtn54uBx',
    database: 'neondb',
    host: 'ep-lingering-forest-a90pyy5j.gwc.azure.neon.tech',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    }
  },
  production: {
    username: 'neondb_owner',
    password: 'npg_ZDkSPtn54uBx',
    database: 'neondb',
    host: 'ep-lingering-forest-a90pyy5j.gwc.azure.neon.tech',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    }
  }
};

