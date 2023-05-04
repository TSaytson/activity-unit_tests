import { Prisma, Voucher } from "@prisma/client";
import voucherRepository from "repositories/voucherRepository";
import voucherService from "services/voucherService";
import { conflictError } from "utils/errorUtils";
import voucherFactory from "../factories/voucher.factory";

describe(`createVoucher unit tests suite`, () => {
  it(`should create a voucher`, async () => {
    const voucher = voucherFactory.generateVoucher();
    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
      return null;
    });
    const spy = jest.spyOn(voucherRepository, 'createVoucher').mockImplementationOnce((): any => {
      return null;
    });
    await voucherService.createVoucher(voucher.code, voucher.discount);
    expect(spy).toBeCalled();
  });
  it(`should return that voucher already exists`, () => {
    const voucher = voucherFactory.generateVoucher();
    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
      return voucher;
    });
    const spy = jest.spyOn(voucherRepository, 'createVoucher').mockImplementationOnce((): any => {
      return null;
    });
    const promise = voucherService.createVoucher(voucher.code, voucher.discount);
    expect(spy).toBeCalled();
    expect(promise).rejects.toEqual(conflictError('Voucher already exist.'));
  });
});

describe(`Apply vouchers unit tests suite`, () => {
  it(`Should not apply discount to an order below 100 amount`, () => {
    const amount = 99;
    const voucher = voucherFactory.generateVoucher();
    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
      return voucher;
    });
    const promise = voucherService.applyVoucher(voucher.code, amount);
    expect(promise).resolves.toEqual({
      amount,
      discount: voucher.discount,
      finalAmount: amount,
      applied: false,
    })
  });
  it(`Should respond with correct applied discount when amount is 100`, () => {
    const amount = 100;
    const voucher = voucherFactory.generateVoucher();
    const finalAmount = amount - amount * (voucher.discount/100);
    jest.spyOn(voucherRepository, 'getVoucherByCode').mockImplementationOnce((): any => {
      return voucher;
    });
    jest.spyOn(voucherRepository, 'useVoucher').mockImplementationOnce((): any => {
      return {
        used: true
      }
    });
    const promise = voucherService.applyVoucher(voucher.code, amount);
    expect(promise).resolves.toEqual({
      amount,
      discount: voucher.discount,
      finalAmount,
      applied: true
    })
  })
})