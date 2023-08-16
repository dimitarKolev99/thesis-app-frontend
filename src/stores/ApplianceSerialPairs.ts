import { defineStore } from 'pinia'

export const useApplianceVoucherStore = defineStore('appliance_voucher', {

  state: () => ({
    pairs: [],
    iv: null,
  }),

  getters: {
    getPairs(): [{ serialNumber: string, voucherCode: string }] {
      return this.pairs;
    },

    getIv() {
      return this.iv;
    }
  },

  actions: {
    addPair(pair: { serialNumber: string, voucherCode: string }): void {
      this.pairs.push(pair);
    },

    setIv(iv) {
      this.iv = iv;
    }
  }

});
