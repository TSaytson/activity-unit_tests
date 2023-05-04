import prisma from '../../src/config/database';
import { faker } from '@faker-js/faker';

function generateVoucher() {
  return {
    code: faker.datatype.string(),
    discount: 10
  }
}

export default {
  generateVoucher
}